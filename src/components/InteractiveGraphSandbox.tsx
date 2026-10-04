import React, { useState, useMemo } from 'react';
import { StudentCase, DataPoint, PhaseChange } from '../types';
import { STUDENT_CASES } from '../data/studentCases';
import {
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Info,
  Sliders,
  ChevronDown
} from 'lucide-react';

export const InteractiveGraphSandbox: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(STUDENT_CASES[0].id);
  const currentCase = useMemo(() => {
    return STUDENT_CASES.find(c => c.id === selectedCaseId) || STUDENT_CASES[0];
  }, [selectedCaseId]);

  // Working state for the graph
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(currentCase.initialData);
  const [phaseChanges, setPhaseChanges] = useState<PhaseChange[]>(currentCase.phaseChanges);
  const [targetGoal, setTargetGoal] = useState<number>(currentCase.targetGoal);
  const [aimLineTargetSession, setAimLineTargetSession] = useState<number>(currentCase.aimLineTargetSession);

  // Overlay toggles
  const [showLevel, setShowLevel] = useState<boolean>(true);
  const [showTrend, setShowTrend] = useState<boolean>(true);
  const [showAimLine, setShowAimLine] = useState<boolean>(true);
  const [showVariability, setShowVariability] = useState<boolean>(false);

  // Graph Type Switcher (Line Graph vs Bar Chart vs Scatterplot)
  const [displayGraphType, setDisplayGraphType] = useState<'line' | 'bar' | 'scatterplot'>('line');

  // Edit / Input state
  const [newVal, setNewVal] = useState<string>('');
  const [newPhase, setNewPhase] = useState<'Baseline' | 'Intervention' | 'Fading' | 'Maintenance'>('Intervention');
  const [newNote, setNewNote] = useState<string>('');

  // When switching case, update state
  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    const found = STUDENT_CASES.find(c => c.id === id) || STUDENT_CASES[0];
    setDataPoints(found.initialData);
    setPhaseChanges(found.phaseChanges);
    setTargetGoal(found.targetGoal);
    setAimLineTargetSession(found.aimLineTargetSession);
  };

  const handleResetCurrentCase = () => {
    setDataPoints(currentCase.initialData);
    setPhaseChanges(currentCase.phaseChanges);
    setTargetGoal(currentCase.targetGoal);
    setAimLineTargetSession(currentCase.aimLineTargetSession);
  };

  // Phase segmentation
  const baselinePoints = useMemo(() => dataPoints.filter(p => p.phase === 'Baseline'), [dataPoints]);
  const interventionPoints = useMemo(() => dataPoints.filter(p => p.phase === 'Intervention'), [dataPoints]);
  const fadingPoints = useMemo(() => dataPoints.filter(p => p.phase === 'Fading'), [dataPoints]);

  // Calculations: Baseline Median
  const baselineMedian = useMemo(() => {
    if (baselinePoints.length === 0) return 0;
    const sorted = [...baselinePoints].map(p => p.value).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }, [baselinePoints]);

  // Baseline Mean
  const baselineMean = useMemo(() => {
    if (baselinePoints.length === 0) return 0;
    const sum = baselinePoints.reduce((acc, p) => acc + p.value, 0);
    return Number((sum / baselinePoints.length).toFixed(1));
  }, [baselinePoints]);

  // Intervention Mean
  const interventionMean = useMemo(() => {
    if (interventionPoints.length === 0) return 0;
    const sum = interventionPoints.reduce((acc, p) => acc + p.value, 0);
    return Number((sum / interventionPoints.length).toFixed(1));
  }, [interventionPoints]);

  // PND (Percentage of Non-Overlapping Data)
  const pndCalculation = useMemo(() => {
    if (baselinePoints.length === 0 || interventionPoints.length === 0) return null;
    const isIncrease = currentCase.behaviorType === 'increase';

    if (isIncrease) {
      const maxBaseline = Math.max(...baselinePoints.map(p => p.value));
      const nonOverlapping = interventionPoints.filter(p => p.value > maxBaseline).length;
      const percentage = Number(((nonOverlapping / interventionPoints.length) * 100).toFixed(1));
      let interpretation = 'Ineffective';
      let badgeClass = 'text-rose-700 bg-rose-50 border-rose-200';
      if (percentage >= 90) {
        interpretation = 'Highly Effective';
        badgeClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (percentage >= 70) {
        interpretation = 'Moderately Effective';
        badgeClass = 'text-blue-700 bg-blue-50 border-blue-200';
      } else if (percentage >= 50) {
        interpretation = 'Questionable Effectiveness';
        badgeClass = 'text-amber-700 bg-amber-50 border-amber-200';
      }
      return { percentage, nonOverlapping, total: interventionPoints.length, maxBaseline, interpretation, badgeClass };
    } else {
      const minBaseline = Math.min(...baselinePoints.map(p => p.value));
      const nonOverlapping = interventionPoints.filter(p => p.value < minBaseline).length;
      const percentage = Number(((nonOverlapping / interventionPoints.length) * 100).toFixed(1));
      let interpretation = 'Ineffective';
      let badgeClass = 'text-rose-700 bg-rose-50 border-rose-200';
      if (percentage >= 90) {
        interpretation = 'Highly Effective';
        badgeClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (percentage >= 70) {
        interpretation = 'Moderately Effective';
        badgeClass = 'text-blue-700 bg-blue-50 border-blue-200';
      } else if (percentage >= 50) {
        interpretation = 'Questionable Effectiveness';
        badgeClass = 'text-amber-700 bg-amber-50 border-amber-200';
      }
      return { percentage, nonOverlapping, total: interventionPoints.length, minBaseline, interpretation, badgeClass };
    }
  }, [baselinePoints, interventionPoints, currentCase.behaviorType]);

  // Aim Line Slope: From (last baseline session, baseline median) to (aimLineTargetSession, targetGoal)
  const lastBaselineSession = baselinePoints.length > 0 ? baselinePoints[baselinePoints.length - 1].session : 1;
  const aimSlope = useMemo(() => {
    const run = aimLineTargetSession - lastBaselineSession;
    if (run <= 0) return 0;
    return (targetGoal - baselineMedian) / run;
  }, [aimLineTargetSession, lastBaselineSession, targetGoal, baselineMedian]);

  const getAimValueAtSession = (session: number) => {
    if (session < lastBaselineSession) return null;
    return baselineMedian + aimSlope * (session - lastBaselineSession);
  };

  // 4-Point Rule Evaluation
  const fourPointEvaluation = useMemo(() => {
    if (interventionPoints.length < 4) {
      return {
        triggered: false,
        consecutiveCount: 0,
        triggeringIds: [] as string[],
        status: 'Insufficient data (<4 intervention sessions)',
        type: undefined as 'failing' | 'accelerating' | undefined,
        recommendation: undefined as string | undefined
      };
    }

    const isIncrease = currentCase.behaviorType === 'increase';
    let consecutiveCount = 0;
    let triggeringIds: string[] = [];

    // Check consecutive intervention points against aim line
    for (let i = 0; i < interventionPoints.length; i++) {
      const pt = interventionPoints[i];
      const aimVal = getAimValueAtSession(pt.session);
      if (aimVal === null) continue;

      const isFailing = isIncrease ? pt.value < aimVal : pt.value > aimVal;
      if (isFailing) {
        consecutiveCount++;
        triggeringIds.push(pt.id);
        if (consecutiveCount >= 4) {
          return {
            triggered: true,
            type: 'failing',
            consecutiveCount,
            triggeringIds,
            status: '4-Point Rule Triggered: Intervention modification required! 4 consecutive points fall below the aim line.',
            recommendation: 'Evaluate treatment fidelity, assess visual sensory barriers (glare/complexity), and adjust prompt hierarchy or reinforcement strength.'
          };
        }
      } else {
        consecutiveCount = 0;
        triggeringIds = [];
      }
    }

    // Check if 4 consecutive points exceed aimline significantly (accelerating progress)
    let accelCount = 0;
    let accelIds: string[] = [];
    for (let i = 0; i < interventionPoints.length; i++) {
      const pt = interventionPoints[i];
      const aimVal = getAimValueAtSession(pt.session);
      if (aimVal === null) continue;

      const isAccelerating = isIncrease ? pt.value >= aimVal : pt.value <= aimVal;
      if (isAccelerating) {
        accelCount++;
        accelIds.push(pt.id);
        if (accelCount >= 4) {
          return {
            triggered: true,
            type: 'accelerating',
            consecutiveCount: accelCount,
            triggeringIds: accelIds,
            status: 'Accelerating Progress: 4 consecutive points at or exceeding aim line trajectory!',
            recommendation: 'Plan prompt fading, introduce generalization probes, or raise target mastery criterion.'
          };
        }
      } else {
        accelCount = 0;
        accelIds = [];
      }
    }

    return {
      triggered: false,
      consecutiveCount: 0,
      triggeringIds: [] as string[],
      status: 'Stable Progress: Data points are tracking along expected trajectory.',
      recommendation: 'Maintain current intervention implementation with consistent fidelity.',
      type: undefined as 'failing' | 'accelerating' | undefined
    };
  }, [interventionPoints, currentCase.behaviorType, aimSlope, baselineMedian, lastBaselineSession]);

  // Graph Coordinate Geometry
  const maxSession = Math.max(aimLineTargetSession, ...dataPoints.map(p => p.session), 12);
  const maxVal = Math.max(targetGoal * 1.25, ...dataPoints.map(p => p.value), 20);
  const minVal = 0;

  const width = 840;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (session: number) => padding.left + ((session - 1) / (maxSession - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;

  // Render SVG Data Paths (Respecting rule: NEVER connect across condition changes!)
  const renderPhaseDataPath = (points: DataPoint[], color: string) => {
    if (points.length < 1) return null;
    const sorted = [...points].sort((a, b) => a.session - b.session);
    let d = `M ${getX(sorted[0].session)} ${getY(sorted[0].value)}`;
    for (let i = 1; i < sorted.length; i++) {
      d += ` L ${getX(sorted[i].session)} ${getY(sorted[i].value)}`;
    }
    return (
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  // Linear Regression Trendline for a phase
  const getTrendlineCoords = (points: DataPoint[]) => {
    if (points.length < 2) return null;
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    points.forEach(p => {
      sumX += p.session;
      sumY += p.value;
      sumXY += p.session * p.value;
      sumXX += p.session * p.session;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minS = Math.min(...points.map(p => p.session));
    const maxS = Math.max(...points.map(p => p.session));
    return {
      x1: getX(minS),
      y1: getY(slope * minS + intercept),
      x2: getX(maxS),
      y2: getY(slope * maxS + intercept)
    };
  };

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newVal);
    if (isNaN(val)) return;
    const nextSession = dataPoints.length > 0 ? Math.max(...dataPoints.map(p => p.session)) + 1 : 1;
    const newPoint: DataPoint = {
      id: `pt-${Date.now()}`,
      session: nextSession,
      value: val,
      phase: newPhase,
      notes: newNote.trim() || undefined
    };
    setDataPoints([...dataPoints, newPoint]);
    setNewVal('');
    setNewNote('');
  };

  const handleDeletePoint = (id: string) => {
    setDataPoints(dataPoints.filter(p => p.id !== id));
  };

  const handleUpdatePointValue = (id: string, value: number) => {
    setDataPoints(dataPoints.map(p => p.id === id ? { ...p, value } : p));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Student Case Selector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Interactive Graphing Sandbox</span>
              <span aria-hidden="true">·</span>
              <span>TN Board Single-Case Design</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Visual Analysis & Progress Monitoring Workbench
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select a clinical case study or input custom student metrics to inspect Level, Trend, Aim Lines, and the 4-Point Decision Rule.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedCaseId}
                onChange={(e) => handleSelectCase(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-800 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                {STUDENT_CASES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.studentName} — {c.targetBehavior.slice(0, 32)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleResetCurrentCase}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset data points to original baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Clinical Case Context Callout */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
            <span>{currentCase.studentName}</span>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <span className="text-slate-600 font-normal">{currentCase.diagnosis}</span>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <span className="text-indigo-700 font-medium">Dimension: {currentCase.dimension} ({currentCase.unit})</span>
          </div>
          <p className="text-slate-600 mb-1.5">{currentCase.clinicalContext}</p>
          <div className="text-slate-700 bg-white p-2 rounded border border-slate-200">
            <span className="font-semibold text-indigo-900">Neurodivergent Focus: </span>
            {currentCase.neurodivergentConsiderations}
          </div>
        </div>
      </div>

      {/* 4-Point Rule Live Alert Banner */}
      {fourPointEvaluation.triggered && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            fourPointEvaluation.type === 'failing'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          {fourPointEvaluation.type === 'failing' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <div className="font-bold text-sm mb-0.5">{fourPointEvaluation.status}</div>
            <p className="mb-1 leading-relaxed">{fourPointEvaluation.recommendation}</p>
            <div className="text-[11px] opacity-80">
              Tennessee Board Standard: Progress monitoring data must trigger actionable intervention reviews before student failure persists.
            </div>
          </div>
        </div>
      )}

      {/* Main Graph & Control Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        {/* Graph Type & Overlays Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setDisplayGraphType('line')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                displayGraphType === 'line'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Equal-Interval Line Graph
            </button>
            <button
              onClick={() => setDisplayGraphType('bar')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                displayGraphType === 'bar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Bar Chart (Setting Comparisons)
            </button>
            <button
              onClick={() => setDisplayGraphType('scatterplot')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                displayGraphType === 'scatterplot'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Scatterplot (Time-of-Day Patterns)
            </button>
          </div>

          {displayGraphType === 'line' && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setShowLevel(!showLevel)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  showLevel ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Phase Mean Levels
              </button>
              <button
                onClick={() => setShowTrend(!showTrend)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  showTrend ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Trendlines
              </button>
              <button
                onClick={() => setShowAimLine(!showAimLine)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  showAimLine ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Aim Line (IEP Target)
              </button>
              <button
                onClick={() => setShowVariability(!showVariability)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  showVariability ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Stability Corridor (±20%)
              </button>
            </div>
          )}
        </div>

        {/* VIEW 1: EQUAL-INTERVAL LINE GRAPH */}
        {displayGraphType === 'line' && (
          <div>
            <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-full font-sans select-none">
            {/* Background Grid & Axis Lines */}
            <rect x="0" y="0" width={width} height={height} fill="#ffffff" />

            {/* Horizontal Grid lines (5 ticks) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const val = minVal + ratio * (maxVal - minVal);
              const yPos = getY(val);
              return (
                <g key={`grid-y-${idx}`}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={width - padding.right}
                    y2={yPos}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {Math.round(val)}
                  </text>
                </g>
              );
            })}

            {/* Vertical Session Grid ticks */}
            {Array.from({ length: maxSession }, (_, i) => i + 1).map(session => {
              const xPos = getX(session);
              return (
                <g key={`grid-x-${session}`}>
                  <line
                    x1={xPos}
                    y1={padding.top}
                    x2={xPos}
                    y2={height - padding.bottom}
                    stroke="#f8fafc"
                    strokeWidth="1"
                  />
                  <text
                    x={xPos}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-500"
                  >
                    {session}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Axis Titles */}
            <text
              x={padding.left + graphWidth / 2}
              y={height - 15}
              textAnchor="middle"
              className="text-xs font-semibold fill-slate-700"
            >
              Successive Sessions / Observation Periods (Abscissa)
            </text>
            <text
              x={-padding.top - graphHeight / 2}
              y={20}
              transform="rotate(-90)"
              textAnchor="middle"
              className="text-xs font-semibold fill-slate-700"
            >
              {currentCase.yAxisLabel} (Ordinate)
            </text>

            {/* Condition Change Lines */}
            {phaseChanges.map((pc, idx) => {
              const lineX = getX(pc.sessionBefore) + (getX(pc.sessionBefore + 1) - getX(pc.sessionBefore)) / 2;
              return (
                <g key={`phase-${idx}`}>
                  <line
                    x1={lineX}
                    y1={padding.top}
                    x2={lineX}
                    y2={height - padding.bottom}
                    stroke="#0f172a"
                    strokeWidth="1.75"
                    strokeDasharray={pc.type === 'dashed' ? '4 3' : 'none'}
                  />
                  {/* Phase Label above graph */}
                  <text
                    x={lineX + 6}
                    y={padding.top - 12}
                    textAnchor="start"
                    className="text-[10px] font-bold fill-slate-800 tracking-tight"
                  >
                    {pc.label}
                  </text>
                </g>
              );
            })}

            {/* Baseline Phase Label at top left */}
            <text
              x={getX(1)}
              y={padding.top - 12}
              textAnchor="start"
              className="text-[10px] font-bold fill-slate-800 tracking-tight"
            >
              Baseline
            </text>

            {/* Stability Corridor for Baseline (±20% of median) */}
            {showVariability && baselinePoints.length > 0 && (
              <rect
                x={padding.left}
                y={getY(baselineMedian * 1.2)}
                width={getX(lastBaselineSession) - padding.left}
                height={Math.abs(getY(baselineMedian * 0.8) - getY(baselineMedian * 1.2))}
                fill="#6366f1"
                fillOpacity="0.08"
                stroke="#6366f1"
                strokeDasharray="2 2"
                strokeWidth="0.75"
              />
            )}

            {/* Aim Line (Goal Line) */}
            {showAimLine && (
              <g>
                <line
                  x1={getX(lastBaselineSession)}
                  y1={getY(baselineMedian)}
                  x2={getX(aimLineTargetSession)}
                  y2={getY(targetGoal)}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
                {/* Aim Line Target Goal marker */}
                <circle
                  cx={getX(aimLineTargetSession)}
                  cy={getY(targetGoal)}
                  r="5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={getX(aimLineTargetSession) + 8}
                  y={getY(targetGoal) + 4}
                  className="text-[10px] font-bold fill-amber-700"
                >
                  Aim Goal ({targetGoal} {currentCase.unit})
                </text>
              </g>
            )}

            {/* Level Lines (Horizontal mean lines within phases) */}
            {showLevel && (
              <>
                {/* Baseline Mean Level */}
                {baselinePoints.length > 0 && (
                  <g>
                    <line
                      x1={padding.left}
                      y1={getY(baselineMean)}
                      x2={getX(lastBaselineSession)}
                      y2={getY(baselineMean)}
                      stroke="#64748b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padding.left + 5}
                      y={getY(baselineMean) - 4}
                      className="text-[9px] font-mono fill-slate-500"
                    >
                      Baseline Mean: {baselineMean}
                    </text>
                  </g>
                )}

                {/* Intervention Mean Level */}
                {interventionPoints.length > 0 && (
                  <g>
                    <line
                      x1={getX(interventionPoints[0].session)}
                      y1={getY(interventionMean)}
                      x2={getX(interventionPoints[interventionPoints.length - 1].session)}
                      y2={getY(interventionMean)}
                      stroke="#4f46e5"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={getX(interventionPoints[0].session) + 5}
                      y={getY(interventionMean) - 4}
                      className="text-[9px] font-mono fill-indigo-600"
                    >
                      Intervention Mean: {interventionMean}
                    </text>
                  </g>
                )}
              </>
            )}

            {/* Trendlines (Linear regression) */}
            {showTrend && (
              <>
                {getTrendlineCoords(baselinePoints) && (
                  <line
                    x1={getTrendlineCoords(baselinePoints)!.x1}
                    y1={getTrendlineCoords(baselinePoints)!.y1}
                    x2={getTrendlineCoords(baselinePoints)!.x2}
                    y2={getTrendlineCoords(baselinePoints)!.y2}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                )}
                {getTrendlineCoords(interventionPoints) && (
                  <line
                    x1={getTrendlineCoords(interventionPoints)!.x1}
                    y1={getTrendlineCoords(interventionPoints)!.y1}
                    x2={getTrendlineCoords(interventionPoints)!.x2}
                    y2={getTrendlineCoords(interventionPoints)!.y2}
                    stroke="#2563eb"
                    strokeWidth="1.5"
                  />
                )}
              </>
            )}

            {/* Data Paths: Never connect across phases! */}
            {renderPhaseDataPath(baselinePoints, '#475569')}
            {renderPhaseDataPath(interventionPoints, '#2563eb')}
            {renderPhaseDataPath(fadingPoints, '#059669')}

            {/* Data Point Dots with Hover / State circles */}
            {dataPoints.map(pt => {
              const cx = getX(pt.session);
              const cy = getY(pt.value);
              const isTriggering4Pt = fourPointEvaluation.triggeringIds?.includes(pt.id);
              const isFailing = fourPointEvaluation.type === 'failing' && isTriggering4Pt;

              return (
                <g key={pt.id} className="cursor-pointer group">
                  {/* Pulsing ring if flagged by 4-point rule */}
                  {isTriggering4Pt && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill={isFailing ? '#f43f5e' : '#10b981'}
                      fillOpacity="0.25"
                      stroke={isFailing ? '#e11d48' : '#059669'}
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isTriggering4Pt ? 5.5 : 4}
                    fill={
                      isTriggering4Pt
                        ? isFailing
                          ? '#e11d48'
                          : '#059669'
                        : pt.phase === 'Baseline'
                        ? '#475569'
                        : pt.phase === 'Intervention'
                        ? '#2563eb'
                        : '#059669'
                    }
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Tooltip on point */}
                  <title>
                    {`Session ${pt.session}: ${pt.value} ${currentCase.unit} (${pt.phase})${
                      pt.notes ? `\nNote: ${pt.notes}` : ''
                    }`}
                  </title>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Graph Legend & PND Stat Block */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
              <span>Baseline Path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span>Intervention Path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 inline-block" />
              <span>Aim Line Trajectory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t border-slate-900 inline-block" />
              <span>Solid Phase Line (Major Change)</span>
            </div>
          </div>

          {/* PND (Percentage of Non-Overlapping Data) Metric */}
          {pndCalculation && (
            <div className="flex items-center justify-end gap-3">
              <span className="text-slate-500 font-medium">PND Effect Size:</span>
              <span className={`px-2.5 py-1 rounded-md font-bold border ${pndCalculation.badgeClass}`}>
                {pndCalculation.percentage}% ({pndCalculation.interpretation})
              </span>
            </div>
          )}
        </div>
      </div>
    )}

    {/* VIEW 2: BAR CHART (SETTING COMPARISONS) */}
    {displayGraphType === 'bar' && (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-900 text-sm">
              Categorical Setting Comparison: Visual Tracking Duration (Minutes)
            </h3>
            <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded font-semibold">
              Discrete Category Display
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Use bar charts to summarize visual tracking across discrete, non-continuous settings or prompt conditions.
          </p>
        </div>

        {/* SVG Bar Chart */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl border border-slate-200">
          <svg viewBox="0 0 760 320" className="w-full h-auto font-sans select-none">
            {/* Background Grid */}
            {[0, 3, 6, 9, 12, 15].map((val, idx) => {
              const y = 260 - (val / 15) * 220;
              return (
                <g key={`bar-grid-${idx}`}>
                  <line x1="70" y1={y} x2="720" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="60" y={y + 4} textAnchor="end" className="text-[11px] font-mono fill-slate-400">
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1="70" y1="260" x2="720" y2="260" stroke="#475569" strokeWidth="1.5" />
            <line x1="70" y1="30" x2="70" y2="260" stroke="#475569" strokeWidth="1.5" />

            <text x="395" y="300" textAnchor="middle" className="text-xs font-semibold fill-slate-700">
              Classroom & Therapy Environments (Discrete Categories)
            </text>
            <text x="-145" y="24" transform="rotate(-90)" textAnchor="middle" className="text-xs font-semibold fill-slate-700">
              Average Visual Tracking Duration (Minutes)
            </text>

            {/* Bars */}
            {[
              { label: 'Resource Room', sub: 'Low noise & dim light', val: 11.2, color: '#4f46e5' },
              { label: 'Speech Therapy', sub: '1:1 structured prompts', val: 8.4, color: '#0284c7' },
              { label: 'Inclusion Class', sub: 'Busy gen ed classroom', val: 3.8, color: '#f59e0b' },
              { label: 'Cafeteria / Gym', sub: 'High sensory overload', val: 1.1, color: '#e11d48' },
            ].map((bar, i) => {
              const barWidth = 90;
              const x = 110 + i * 155;
              const barHeight = (bar.val / 15) * 220;
              const y = 260 - barHeight;

              return (
                <g key={`bar-${i}`} className="cursor-pointer">
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={bar.color}
                    rx="4"
                    className="hover:opacity-90 transition-opacity"
                  />
                  {/* Value on top of bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-xs font-bold font-mono fill-slate-800"
                  >
                    {bar.val} min
                  </text>
                  {/* Category Label below axis */}
                  <text
                    x={x + barWidth / 2}
                    y="278"
                    textAnchor="middle"
                    className="text-xs font-bold fill-slate-800"
                  >
                    {bar.label}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y="292"
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500"
                  >
                    {bar.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Clinical Interpretation for Bar Chart */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
          <strong className="block font-bold text-indigo-900">
            Instructional Decision from this Bar Chart:
          </strong>
          <p className="leading-relaxed">
            The student sustains visual tracking for 11.2 minutes in the low-stimulus Resource Room, but plummets to 3.8 minutes in the inclusion classroom and 1.1 minutes in the cafeteria. 
            <strong>Clinical Modification:</strong> The IEP team should introduce noise-reducing headphones and a tri-fold desktop visual privacy carrel in the general education classroom to simulate the protective acoustics of the resource room.
          </p>
        </div>
      </div>
    )}

    {/* VIEW 3: SCATTERPLOT (TEMPORAL PATTERN DISCOVERY) */}
    {displayGraphType === 'scatterplot' && (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-900 text-sm">
              Behavioral Scatterplot: Temporal Distribution of Visual Disengagement
            </h3>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded font-semibold">
              Time-of-Day Pattern Analysis
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Organizes 30-minute intervals across days of the week to reveal fatigue windows, medication wear-off, and environmental glare.
          </p>
        </div>

        {/* Scatterplot Matrix */}
        <div className="overflow-x-auto bg-white p-5 rounded-xl border border-slate-200">
          <div className="min-w-[600px] space-y-2">
            <div className="grid grid-cols-6 gap-2 text-xs font-bold text-slate-700 pb-2 border-b border-slate-200 text-center">
              <div className="text-left font-mono">Time Block</div>
              <div>Monday</div>
              <div>Tuesday</div>
              <div>Wednesday</div>
              <div>Thursday</div>
              <div>Friday</div>
            </div>

            {[
              { time: '08:30 - 09:00', data: [0, 0, 0, 0, 0], note: 'Morning arrival / high alert' },
              { time: '09:00 - 09:30', data: [0, 1, 0, 0, 1], note: 'Structured math centers' },
              { time: '09:30 - 10:00', data: [1, 0, 1, 0, 0], note: 'Phonics reading group' },
              { time: '10:00 - 10:30', data: [0, 0, 0, 1, 0], note: 'Snack break' },
              { time: '10:30 - 11:00', data: [1, 1, 0, 1, 1], note: 'Writing station' },
              { time: '11:00 - 11:30', data: [3, 2, 3, 3, 2], note: 'Pre-lunch hunger / visual fatigue window!' },
              { time: '11:30 - 12:00', data: [3, 3, 3, 3, 3], note: 'Peak disengagement & sensory overload' },
              { time: '12:00 - 12:30', data: [0, 0, 0, 0, 0], note: 'Lunch (no tracking recorded)' },
              { time: '12:30 - 01:00', data: [0, 0, 0, 0, 0], note: 'Recess' },
              { time: '01:00 - 01:30', data: [1, 0, 0, 1, 0], note: 'Quiet story listening' },
              { time: '01:30 - 02:00', data: [2, 3, 2, 3, 2], note: 'Afternoon sun glare through west window!' },
              { time: '02:00 - 02:30', data: [1, 1, 1, 1, 2], note: 'End of day pack-up' },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-2 items-center text-xs py-1 hover:bg-slate-50 rounded">
                <div className="font-mono text-slate-600 text-[11px] font-medium">{row.time}</div>
                {row.data.map((count, dIdx) => {
                  let cellClass = 'bg-slate-100 text-slate-400 border-slate-200';
                  let label = '0';
                  if (count === 1) {
                    cellClass = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
                    label = '1-2';
                  } else if (count >= 2) {
                    cellClass = 'bg-rose-600 text-white border-rose-700 font-bold';
                    label = '3+';
                  }
                  return (
                    <div
                      key={dIdx}
                      className={`h-7 flex items-center justify-center rounded border text-[11px] transition-transform ${cellClass}`}
                      title={`${row.time}: ${count} visual disengagement episodes (${row.note})`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend for Scatterplot */}
          <div className="flex items-center justify-between text-xs pt-4 mt-4 border-t border-slate-100 text-slate-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block" />
                <span>Zero Disengagement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 inline-block" />
                <span>1-2 Low Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-600 inline-block" />
                <span>3+ High Concentration (Cluster)</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Hover cells to see clinical session context
            </span>
          </div>
        </div>

        {/* Clinical Decision from Scatterplot */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
          <strong className="block font-bold text-purple-900">
            Instructional Decisions Inferred from this Scatterplot:
          </strong>
          <ul className="list-disc list-inside space-y-1 text-purple-900">
            <li>
              <strong>11:00 AM - 12:00 PM Red Cluster:</strong> Visual tracking consistently collapses right before lunch due to hunger and visual fatigue. <em>Action:</em> Schedule visual reading assessments between 8:30 AM and 10:30 AM.
            </li>
            <li>
              <strong>1:30 PM - 2:00 PM Afternoon Cluster:</strong> Investigation shows afternoon sunlight hits the student's desk directly from the unshaded window. <em>Action:</em> Move the student’s workstation away from the window or draw the classroom blinds.
            </li>
          </ul>
        </div>
      </div>
    )}
  </div>

  {/* Data Editor & Quick Input Panel */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Session Point Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Session Observation</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Record a new data point to test graph reaction and 4-point rule detection.
          </p>

          <form onSubmit={handleAddPoint} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Value ({currentCase.unit})
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={newVal}
                onChange={e => setNewVal(e.target.value)}
                placeholder={`e.g. ${targetGoal}`}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Experimental Phase
              </label>
              <select
                value={newPhase}
                onChange={e => setNewPhase(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Baseline">Baseline</option>
                <option value="Intervention">Intervention</option>
                <option value="Fading">Fading / Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Clinical Observation Note (Optional)
              </label>
              <input
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="e.g. Needed sensory break, lights dimmed"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-xs"
            >
              Append Data Point
            </button>
          </form>
        </div>

        {/* Data Table with Inline Values */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Session Data Log</h3>
              <p className="text-xs text-slate-500">Edit values directly or remove data points.</p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total Sessions: {dataPoints.length}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-semibold z-10">
                <tr>
                  <th className="p-2 border-b border-slate-200 w-16">Session</th>
                  <th className="p-2 border-b border-slate-200 w-24">Phase</th>
                  <th className="p-2 border-b border-slate-200 w-28">Value ({currentCase.unit})</th>
                  <th className="p-2 border-b border-slate-200">Clinical Notes</th>
                  <th className="p-2 border-b border-slate-200 w-10 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataPoints.map((pt) => (
                  <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2 font-mono text-slate-700 font-medium">#{pt.session}</td>
                    <td className="p-2">
                      <span
                        className={`text-[11px] font-medium ${
                          pt.phase === 'Baseline'
                            ? 'text-slate-600'
                            : pt.phase === 'Intervention'
                            ? 'text-blue-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {pt.phase}
                      </span>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        value={pt.value}
                        onChange={(e) => handleUpdatePointValue(pt.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs"
                      />
                    </td>
                    <td className="p-2 text-slate-600 truncate max-w-xs">{pt.notes || '—'}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeletePoint(pt.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
