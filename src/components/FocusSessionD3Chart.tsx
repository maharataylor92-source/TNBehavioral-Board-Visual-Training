import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  Info,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Activity
} from 'lucide-react';
import { SavedStudySession } from '../lib/firestoreService';

export interface FocusSessionD3ChartProps {
  sessions: SavedStudySession[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const CATEGORY_CONFIG: Record<
  string,
  { name: string; color: string; bg: string; border: string; section: string }
> = {
  Measurement: {
    name: 'Measurement',
    color: '#6366f1', // Indigo
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    section: 'Section A'
  },
  Assessment: {
    name: 'Assessment',
    color: '#0284c7', // Sky
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    section: 'Section B'
  },
  'Skill Acquisition': {
    name: 'Skill Acquisition',
    color: '#10b981', // Emerald
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    section: 'Section C'
  },
  'Behavior Reduction': {
    name: 'Behavior Reduction',
    color: '#f43f5e', // Rose
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    section: 'Section D'
  },
  'Documentation & Reporting': {
    name: 'Documentation & Reporting',
    color: '#d97706', // Amber
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    section: 'Section E'
  },
  'Ethics & Professional Conduct': {
    name: 'Ethics',
    color: '#9333ea', // Purple
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    section: 'Section F'
  }
};

const DEFAULT_CATEGORY = 'Measurement';

function safeDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? new Date() : val;
  }
  if (typeof val === 'object' && val !== null) {
    if (typeof val.toDate === 'function') {
      try {
        const d = val.toDate();
        if (d instanceof Date && !isNaN(d.getTime())) return d;
      } catch {
        // continue
      }
    }
    if (typeof val.seconds === 'number') {
      const d = new Date(val.seconds * 1000);
      if (!isNaN(d.getTime())) return d;
    }
  }
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  } catch {
    // continue
  }
  return new Date();
}

function safeDateKey(val: any): string {
  const d = safeDate(val);
  try {
    return d.toISOString().split('T')[0];
  } catch {
    const year = d.getFullYear() || 2026;
    const month = String((d.getMonth() || 0) + 1).padStart(2, '0');
    const day = String(d.getDate() || 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

interface DailyAggregatedData {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  categoryMinutes: Record<string, number>;
  totalMinutes: number;
}

export const FocusSessionD3Chart: React.FC<FocusSessionD3ChartProps> = ({
  sessions,
  onRefresh,
  isLoading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Filter and mode state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'daily' | 'cumulative'>('daily');
  const [timeRange, setTimeRange] = useState<'all' | '14d' | '30d'>('all');
  const [showAverageOverlay, setShowAverageOverlay] = useState<boolean>(true);
  const [averageMode, setAverageMode] = useState<'session' | 'daily'>('session');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: Date;
    category: string;
    minutes: number;
    cumulative?: number;
  } | null>(null);

  // Normalize sessions and prepare sorted array
  const preparedSessions = useMemo(() => {
    if (!Array.isArray(sessions)) return [];
    return [...sessions]
      .filter(s => s && typeof s === 'object')
      .sort((a, b) => safeDate(a.createdAt).getTime() - safeDate(b.createdAt).getTime());
  }, [sessions]);

  // Filter sessions by timeRange if requested
  const filteredSessions = useMemo(() => {
    if (timeRange === 'all') return preparedSessions;
    const now = Date.now();
    const days = timeRange === '14d' ? 14 : 30;
    const cutoff = now - days * 86400000;
    return preparedSessions.filter(s => safeDate(s.createdAt).getTime() >= cutoff);
  }, [preparedSessions, timeRange]);

  // Aggregate sessions by day
  const dailyData = useMemo(() => {
    if (filteredSessions.length === 0) return [];

    // Group by YYYY-MM-DD
    const map = new Map<string, { date: Date; minutesByCat: Record<string, number> }>();

    filteredSessions.forEach(s => {
      const d = safeDate(s.createdAt);
      const dateKey = safeDateKey(s.createdAt);
      const category = s.studyArea && CATEGORY_CONFIG[s.studyArea] ? s.studyArea : DEFAULT_CATEGORY;

      if (!map.has(dateKey)) {
        // Normalize date to midnight local
        const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        map.set(dateKey, {
          date: midnight,
          minutesByCat: {
            Measurement: 0,
            Assessment: 0,
            'Skill Acquisition': 0,
            'Behavior Reduction': 0,
            'Documentation & Reporting': 0,
            'Ethics & Professional Conduct': 0
          }
        });
      }

      const entry = map.get(dateKey)!;
      const duration = Number(s.durationMinutes) || 0;
      entry.minutesByCat[category] = (entry.minutesByCat[category] || 0) + duration;
    });

    // Convert to sorted array
    const sortedDays = Array.from(map.entries())
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([dateKey, val]) => {
        const total = Object.values(val.minutesByCat).reduce((acc, curr) => acc + curr, 0);
        return {
          date: val.date,
          dateKey,
          categoryMinutes: val.minutesByCat,
          totalMinutes: total
        } as DailyAggregatedData;
      });

    return sortedDays;
  }, [filteredSessions]);

  // Calculate cumulative trend data if viewMode is cumulative
  const cumulativeData = useMemo(() => {
    if (dailyData.length === 0) return [];

    const runningTotals: Record<string, number> = {
      Measurement: 0,
      Assessment: 0,
      'Skill Acquisition': 0,
      'Behavior Reduction': 0,
      'Documentation & Reporting': 0,
      'Ethics & Professional Conduct': 0,
      Total: 0
    };

    return dailyData.map(d => {
      const copy: Record<string, number> = {};
      Object.keys(CATEGORY_CONFIG).forEach(cat => {
        runningTotals[cat] += d.categoryMinutes[cat] || 0;
        copy[cat] = runningTotals[cat];
      });
      runningTotals.Total += d.totalMinutes;

      return {
        date: d.date,
        dateKey: d.dateKey,
        categoryMinutes: copy,
        totalMinutes: runningTotals.Total
      };
    });
  }, [dailyData]);

  // Summary statistics
  const stats = useMemo(() => {
    const totalMinutes = filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const catMinutes: Record<string, number> = {};
    Object.keys(CATEGORY_CONFIG).forEach(c => (catMinutes[c] = 0));

    filteredSessions.forEach(s => {
      const c = s.studyArea && CATEGORY_CONFIG[s.studyArea] ? s.studyArea : DEFAULT_CATEGORY;
      catMinutes[c] = (catMinutes[c] || 0) + s.durationMinutes;
    });

    let topCategory = 'Measurement';
    let maxMin = 0;
    Object.entries(catMinutes).forEach(([cat, min]) => {
      if (min > maxMin) {
        maxMin = min;
        topCategory = cat;
      }
    });

    const activeDaysCount = dailyData.length;
    const avgDailyMinutes = activeDaysCount > 0 ? Math.round(totalMinutes / activeDaysCount) : 0;

    return {
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      topCategory,
      topCategoryHours: (maxMin / 60).toFixed(1),
      activeDaysCount,
      avgDailyMinutes
    };
  }, [filteredSessions, dailyData]);

  // Calculate user's average study duration across all categories
  const avgSessionDuration = useMemo(() => {
    if (filteredSessions.length === 0) return 0;
    const total = filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    return Math.round(total / filteredSessions.length);
  }, [filteredSessions]);

  const avgDailyDuration = useMemo(() => {
    if (dailyData.length === 0) return 0;
    const total = filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    return Math.round(total / dailyData.length);
  }, [filteredSessions, dailyData]);

  const activeAverageDuration = averageMode === 'session' ? avgSessionDuration : avgDailyDuration;

  // D3 Rendering effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const chartData = viewMode === 'cumulative' ? cumulativeData : dailyData;

    if (chartData.length === 0) {
      return;
    }

    const containerWidth = Math.max(containerRef.current.clientWidth || 650, 320);
    const height = 320;
    const margin = { top: 25, right: 35, bottom: 45, left: 45 };
    const width = containerWidth;
    const innerWidth = Math.max(width - margin.left - margin.right, 100);
    const innerHeight = Math.max(height - margin.top - margin.bottom, 100);

    svg.attr('width', width).attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Determine categories to draw
    const categoriesToDraw =
      selectedCategory === 'All'
        ? Object.keys(CATEGORY_CONFIG)
        : [selectedCategory];

    // X Scale with robust extent guards
    const rawExtent = d3.extent(chartData, d => d.date);
    const startDate = rawExtent[0] instanceof Date && !isNaN(rawExtent[0].getTime())
      ? rawExtent[0]
      : new Date(Date.now() - 86400000);
    const endDate = rawExtent[1] instanceof Date && !isNaN(rawExtent[1].getTime())
      ? rawExtent[1]
      : new Date();

    const xExtent: [Date, Date] = [new Date(startDate), new Date(endDate)];

    // If only 1 data point, pad the domain slightly for aesthetics
    if (xExtent[0].getTime() === xExtent[1].getTime()) {
      xExtent[0] = new Date(xExtent[0].getTime() - 86400000);
      xExtent[1] = new Date(xExtent[1].getTime() + 86400000);
    }

    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range([0, innerWidth]);

    // Y Scale
    let maxY = 0;
    if (selectedCategory === 'All') {
      chartData.forEach(d => {
        categoriesToDraw.forEach(cat => {
          const val = d.categoryMinutes[cat] || 0;
          if (val > maxY) maxY = val;
        });
      });
    } else {
      chartData.forEach(d => {
        const val = d.categoryMinutes[selectedCategory] || 0;
        if (val > maxY) maxY = val;
      });
    }

    // Ensure Y scale accommodates the average line if active
    if (showAverageOverlay && activeAverageDuration > maxY) {
      maxY = activeAverageDuration;
    }

    // Give some breathing room on top
    const yMaxWithPadding = Math.max(maxY * 1.15, 30);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMaxWithPadding])
      .nice()
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid grid-y')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // Axes
    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(Math.min(chartData.length + 1, 7))
      .tickFormat(d3.timeFormat('%b %d') as any);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d}m`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', '#64748b');

    g.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', '#64748b');

    // Horizontal line overlay representing user's average study duration across all categories
    if (showAverageOverlay && activeAverageDuration > 0 && viewMode === 'daily') {
      const avgY = yScale(activeAverageDuration);

      // Translucent halo/glow behind line
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', avgY)
        .attr('y2', avgY)
        .attr('stroke', '#9333ea')
        .attr('stroke-width', 6)
        .attr('stroke-opacity', 0.15)
        .attr('stroke-linecap', 'round');

      // Primary distinct dashed horizontal line
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', avgY)
        .attr('y2', avgY)
        .attr('stroke', '#9333ea')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6 4')
        .attr('stroke-linecap', 'round');

      // Right-aligned pill badge displaying average value
      const badgeG = g
        .append('g')
        .attr('transform', `translate(${innerWidth}, ${avgY})`);

      const labelText = `Avg: ${activeAverageDuration}m (${averageMode === 'session' ? 'session' : 'day'})`;
      const badgeWidth = labelText.length * 6.5 + 16;

      badgeG
        .append('rect')
        .attr('x', -badgeWidth)
        .attr('y', -10)
        .attr('width', badgeWidth)
        .attr('height', 20)
        .attr('rx', 4)
        .attr('fill', '#9333ea');

      badgeG
        .append('text')
        .attr('x', -badgeWidth / 2)
        .attr('y', 3.5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('fill', '#ffffff')
        .text(labelText);
    }

    // Subtle 30m / 60m focus target reference line in Daily mode
    if (viewMode === 'daily') {
      const benchmarkMin = 30;
      if (yMaxWithPadding >= benchmarkMin) {
        const refY = yScale(benchmarkMin);
        g.append('line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', refY)
          .attr('y2', refY)
          .attr('stroke', '#cbd5e1')
          .attr('stroke-dasharray', '4 4')
          .attr('stroke-width', 1.5);

        g.append('text')
          .attr('x', innerWidth - 5)
          .attr('y', refY - 5)
          .attr('text-anchor', 'end')
          .attr('font-size', '10px')
          .attr('fill', '#94a3b8')
          .text('30m Daily Target');
      }
    }

    // Line generator with smooth curves
    const lineGenerator = d3
      .line<{ date: Date; minutes: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.minutes))
      .curve(d3.curveMonotoneX);

    // Area generator for translucent shading under the curve
    const areaGenerator = d3
      .area<{ date: Date; minutes: number }>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.minutes))
      .curve(d3.curveMonotoneX);

    // Draw lines and areas for each active category
    categoriesToDraw.forEach(cat => {
      const config = CATEGORY_CONFIG[cat] || {
        color: '#6366f1',
        name: cat
      };
      const series = chartData.map(d => ({
        date: d.date,
        minutes: d.categoryMinutes[cat] || 0
      }));

      // Don't render a flat 0 line if in "All Categories" and candidate hasn't studied this category yet
      const hasAnyMinutes = series.some(pt => pt.minutes > 0);
      if (!hasAnyMinutes && selectedCategory === 'All') {
        return;
      }

      // Shaded area gradient if single category selected
      if (selectedCategory !== 'All') {
        const gradientId = `grad-${cat.replace(/\s+/g, '-')}`;
        const defs = svg.append('defs');
        const linearGradient = defs
          .append('linearGradient')
          .attr('id', gradientId)
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%');

        linearGradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', config.color)
          .attr('stop-opacity', 0.25);

        linearGradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', config.color)
          .attr('stop-opacity', 0.0);

        g.append('path')
          .datum(series)
          .attr('fill', `url(#${gradientId})`)
          .attr('d', areaGenerator);
      }

      // Main line path
      const path = g
        .append('path')
        .datum(series)
        .attr('fill', 'none')
        .attr('stroke', config.color)
        .attr('stroke-width', selectedCategory === 'All' ? 2.5 : 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', lineGenerator);

      // Simple entry transition with safe getTotalLength
      let totalLength = 500;
      try {
        const node = path.node();
        if (node && typeof node.getTotalLength === 'function') {
          const l = node.getTotalLength();
          if (typeof l === 'number' && isFinite(l) && l > 0) {
            totalLength = l;
          }
        }
      } catch {
        totalLength = 500;
      }

      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // Data dots
      g.selectAll(`.dot-${cat.replace(/\s+/g, '-')}`)
        .data(series)
        .enter()
        .append('circle')
        .attr('class', `dot-${cat.replace(/\s+/g, '-')}`)
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.minutes))
        .attr('r', selectedCategory === 'All' ? 3.5 : 4.5)
        .attr('fill', '#ffffff')
        .attr('stroke', config.color)
        .attr('stroke-width', 2)
        .style('cursor', 'pointer');
    });

    // Vertical hover guide line
    const hoverGuide = g
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0);

    // Overlay rect for pointer interactions
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    overlay
      .on('mousemove', (event: MouseEvent) => {
        const [pointerX] = d3.pointer(event);
        if (!isFinite(pointerX)) return;
        const hoveredDate = xScale.invert(pointerX);
        if (!hoveredDate || isNaN(hoveredDate.getTime())) return;

        // Find nearest day in chartData
        const bisector = d3.bisector<DailyAggregatedData, Date>(d => d.date).center;
        const index = bisector(chartData, hoveredDate);
        const safeIdx = Math.max(0, Math.min(index, chartData.length - 1));
        const d = chartData[safeIdx];

        if (!d) return;

        const xPos = xScale(d.date);
        hoverGuide.attr('x1', xPos).attr('x2', xPos).attr('opacity', 1);

        // Position tooltip
        if (tooltipRef.current) {
          const rect = containerRef.current!.getBoundingClientRect();
          const pageX = event.clientX - rect.left;
          const pageY = event.clientY - rect.top;

          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${Math.min(pageX + 15, width - 210)}px`;
          tooltipRef.current.style.top = `${Math.max(pageY - 60, 10)}px`;
        }

        // Set hovered point state
        const targetCategory =
          selectedCategory === 'All' ? 'Total' : selectedCategory;
        const minutes =
          selectedCategory === 'All'
            ? d.totalMinutes
            : d.categoryMinutes[selectedCategory] || 0;

        setHoveredPoint({
          date: d.date,
          category: targetCategory,
          minutes
        });
      })
      .on('mouseleave', () => {
        hoverGuide.attr('opacity', 0);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
        setHoveredPoint(null);
      });
  }, [
    dailyData,
    cumulativeData,
    selectedCategory,
    viewMode,
    filteredSessions.length,
    showAverageOverlay,
    averageMode,
    activeAverageDuration
  ]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
      {/* Header with Title, Mode & Time Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Focus Session Trends by Study Area
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-700 tracking-wide uppercase">
              D3.js Visualization
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-dimensional line chart tracking study volume across RBT Task List sections.
          </p>
        </div>

        {/* View Mode Toggle, Average Overlay Toggle & Time Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Average Duration Overlay Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setShowAverageOverlay(!showAverageOverlay)}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                showAverageOverlay
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Toggle horizontal line overlay representing user's average study duration across all categories"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Avg Line: {showAverageOverlay ? 'ON' : 'OFF'}</span>
            </button>

            {showAverageOverlay && (
              <div className="flex items-center pl-1 pr-0.5 gap-0.5">
                <button
                  onClick={() => setAverageMode('session')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    averageMode === 'session'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Average study block duration across all categories"
                >
                  Session ({avgSessionDuration}m)
                </button>
                <button
                  onClick={() => setAverageMode('daily')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    averageMode === 'daily'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Average daily study time across all categories"
                >
                  Daily ({avgDailyDuration}m)
                </button>
              </div>
            )}
          </div>

          {/* Daily vs Cumulative */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-white text-indigo-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Minutes
            </button>
            <button
              onClick={() => setViewMode('cumulative')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'cumulative'
                  ? 'bg-white text-indigo-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Growth
            </button>
          </div>

          {/* Time range selector */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                timeRange === '14d'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                timeRange === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Time
            </button>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Firestore logs"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" /> Total Focus Time
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {stats.totalHours} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            {stats.totalMinutes} total minutes
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-500" /> Leading Domain
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1.5 truncate" title={stats.topCategory}>
            {stats.topCategory}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {stats.topCategoryHours} hrs committed
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Active Days
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {stats.activeDaysCount} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Consistency predictor
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Daily Focus Avg
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {stats.avgDailyMinutes} <span className="text-xs font-normal text-slate-500">min/day</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            On active study days
          </div>
        </div>
      </div>

      {/* Category Pills / Filters Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter Area:
        </span>

        {/* All Categories Button */}
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'All'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>All Categories</span>
          <span className="text-[10px] opacity-75 font-mono">
            ({Object.keys(CATEGORY_CONFIG).length})
          </span>
        </button>

        {/* Individual Category Badges */}
        {Object.entries(CATEGORY_CONFIG).map(([catKey, cfg]) => {
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-white font-bold shadow-xs text-slate-900 border-slate-300 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* D3 Chart Container */}
      <div ref={containerRef} className="relative w-full pt-1">
        {dailyData.length > 0 ? (
          <>
            <svg
              ref={svgRef}
              className="w-full overflow-visible font-sans select-none"
            />
            {/* Interactive HTML Tooltip floating over D3 Canvas */}
            <div
              ref={tooltipRef}
              className="absolute pointer-events-none transition-opacity duration-150 opacity-0 bg-slate-900/95 backdrop-blur-xs text-white text-xs p-2.5 rounded-xl shadow-xl border border-slate-800 z-20 min-w-[170px]"
            >
              {hoveredPoint && (
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {hoveredPoint.date.toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="font-bold text-white flex items-center justify-between gap-2">
                    <span className="truncate">{hoveredPoint.category}:</span>
                    <span className="text-amber-400 font-mono">
                      {hoveredPoint.minutes}m
                    </span>
                  </div>
                  {viewMode === 'cumulative' && (
                    <div className="text-[10px] text-slate-400">
                      Cumulative to date: {hoveredPoint.minutes} mins
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <Clock className="w-8 h-8 text-slate-300 animate-pulse" />
            <div className="text-sm font-bold text-slate-700">
              No Focus Session Logs Recorded Yet
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Start a 25-minute Pomodoro or 45-minute deep exam study block in the Study Timer to begin logging your progress curve.
            </p>
          </div>
        )}
      </div>

      {/* Domain Breakdown Bottom Legend */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([catKey, cfg]) => (
            <div key={catKey} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              <span className="text-[11px] text-slate-700">
                {cfg.name} <span className="text-slate-400 font-mono">({cfg.section})</span>
              </span>
            </div>
          ))}

          {showAverageOverlay && activeAverageDuration > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-purple-600" />
              <span className="text-[11px] font-bold text-purple-700">
                Average Duration ({activeAverageDuration}m across all categories)
              </span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Smooth curve interpolation via D3.js Monotone Spline</span>
        </div>
      </div>
    </div>
  );
};
