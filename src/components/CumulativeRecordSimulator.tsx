import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Info, FastForward } from 'lucide-react';

export const CumulativeRecordSimulator: React.FC = () => {
  const [responseCount, setResponseCount] = useState<number>(0);
  const [points, setPoints] = useState<{ time: number; count: number }[]>([
    { time: 0, count: 0 }
  ]);
  const [autoRate, setAutoRate] = useState<'off' | 'slow' | 'fast' | 'pause'>('off');
  const timerRef = useRef<any>(null);

  // Time ticker in seconds
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const nextTime = prev + 1;
        // Every second, ensure there is a point on the record
        setPoints(current => {
          const lastCount = current.length > 0 ? current[current.length - 1].count : 0;
          return [...current.slice(-50), { time: nextTime, count: lastCount }];
        });
        return nextTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle auto-pacer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoRate === 'fast') {
      timerRef.current = setInterval(() => {
        triggerResponse();
      }, 400); // 2.5 responses per sec -> steep slope
    } else if (autoRate === 'slow') {
      timerRef.current = setInterval(() => {
        triggerResponse();
      }, 2000); // 0.5 responses per sec -> gentle slope
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRate]);

  const triggerResponse = () => {
    setResponseCount(prev => {
      const nextCount = prev + 1;
      setPoints(current => {
        const last = current[current.length - 1];
        if (!last) return [{ time: 0, count: nextCount }];
        // Add step
        return [...current.slice(-50), { time: last.time, count: nextCount }];
      });
      return nextCount;
    });
  };

  const handleReset = () => {
    setAutoRate('off');
    setResponseCount(0);
    setElapsedSeconds(0);
    setPoints([{ time: 0, count: 0 }]);
  };

  // Dimensions for SVG cumulative record
  const svgWidth = 700;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const minTime = points.length > 0 ? Math.max(0, points[0].time) : 0;
  const maxTime = Math.max(minTime + 30, elapsedSeconds);
  const minCount = points.length > 0 ? points[0].count : 0;
  const maxCount = Math.max(minCount + 20, responseCount + 4);

  const getX = (t: number) => padding.left + ((t - minTime) / (maxTime - minTime || 1)) * graphWidth;
  const getY = (c: number) => padding.top + graphHeight - ((c - minCount) / (maxCount - minCount || 1)) * graphHeight;

  // Path string for stepped cumulative response
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${getX(points[0].time)} ${getY(points[0].count)}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${getX(points[i].time)} ${getY(points[i].count)}`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Skinnerian Apparatus Simulation</span>
          <span aria-hidden="true">·</span>
          <span>Cumulative Record Mastery</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Cumulative Record & Slope Analyzer
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          In a cumulative record, responses accumulate continuously and the paper rolls forward. The slope of the line equals the rate of responding. Watch the pen step upward with every response!
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={triggerResponse}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tap Response (+1 Target Gaze)</span>
            </button>

            <button
              onClick={() => setAutoRate(autoRate === 'fast' ? 'off' : 'fast')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                autoRate === 'fast'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Simulate High Rate (Steep)
            </button>

            <button
              onClick={() => setAutoRate(autoRate === 'slow' ? 'off' : 'slow')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                autoRate === 'slow'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Simulate Low Rate (Shallow)
            </button>

            <button
              onClick={() => setAutoRate('pause')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                autoRate === 'pause'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Simulate Extinction / Pause (Flat)
            </button>

            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors ml-1"
              title="Reset record"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-800 font-semibold">
              Total Cumulative Count: {responseCount}
            </div>
            <div className="font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
              Session Time: {elapsedSeconds}s
            </div>
          </div>
        </div>

        {/* SVG Cumulative Record Display */}
        <div className="overflow-x-auto bg-slate-900 rounded-xl p-4">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none font-mono">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const yVal = minCount + r * (maxCount - minCount);
              const yPos = getY(yVal);
              return (
                <g key={`cgrid-${i}`}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={svgWidth - padding.right}
                    y2={yPos}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-500"
                  >
                    {Math.round(yVal)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line
              x1={padding.left}
              y1={svgHeight - padding.bottom}
              x2={svgWidth - padding.right}
              y2={svgHeight - padding.bottom}
              stroke="#475569"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={svgHeight - padding.bottom}
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Labels */}
            <text
              x={padding.left + graphWidth / 2}
              y={svgHeight - 12}
              textAnchor="middle"
              className="text-[11px] fill-slate-400 font-sans"
            >
              Continuous Time / Paper Feed (Seconds)
            </text>
            <text
              x={-padding.top - graphHeight / 2}
              y={18}
              transform="rotate(-90)"
              textAnchor="middle"
              className="text-[11px] fill-slate-400 font-sans"
            >
              Cumulative Responses
            </text>

            {/* Cumulative Pen Trace */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Active Pen Head */}
            {points.length > 0 && (
              <circle
                cx={getX(points[points.length - 1].time)}
                cy={getY(points[points.length - 1].count)}
                r="5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>

        {/* Interpretive Legend Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Steep Slope = High Rate</span>
            </div>
            <p className="text-slate-600">
              When student engages in rapid, frequent responses (e.g., fluently identifying AAC symbols or rapidly scanning text).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Gentle Slope = Low Rate</span>
            </div>
            <p className="text-slate-600">
              Responses are spaced far apart in time. Student exhibits prolonged latency or long inter-response times (IRTs).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Flat Line = ZERO Responding</span>
            </div>
            <p className="text-slate-600">
              No behavior occurred during that window. Never goes downward because responses cannot un-occur!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
