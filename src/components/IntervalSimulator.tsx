import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Info, CheckCircle2, AlertCircle, Cloud, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveIntervalSession } from '../lib/firestoreService';

interface SimulationBlock {
  startSec: number; // e.g. 0 to 30
  endSec: number;
  status: 'on-task' | 'off-task';
  description: string;
}

export const IntervalSimulator: React.FC = () => {
  const { currentUser, login } = useAuth();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // 30-second observation broken into six 5-second intervals
  const totalDurationSec = 30;
  const intervalLengthSec = 5;
  const totalIntervals = totalDurationSec / intervalLengthSec; // 6 intervals

  // Pre-defined realistic behavioral episode: Maya reading with Typoscope
  // True on-task duration:
  // 0-3.5: on-task (3.5s)
  // 3.5-5.0: off-task (1.5s) -> Interval 1 (0-5s): Partial (+), Whole (-), MTS end at 5s is off-task (-)
  // 5.0-10.0: on-task (5.0s) -> Interval 2 (5-10s): Partial (+), Whole (+), MTS end at 10s is on-task (+)
  // 10.0-12.0: off-task (2.0s)
  // 12.0-14.5: on-task (2.5s)
  // 14.5-15.0: off-task (0.5s) -> Interval 3 (10-15s): Partial (+), Whole (-), MTS end at 15s is off-task (-)
  // 15.0-19.0: off-task (4.0s)
  // 19.0-20.0: on-task (1.0s) -> Interval 4 (15-20s): Partial (+), Whole (-), MTS end at 20s is on-task (+)
  // 20.0-25.0: off-task (5.0s) -> Interval 5 (20-25s): Partial (-), Whole (-), MTS end at 25s is off-task (-)
  // 25.0-30.0: on-task (5.0s) -> Interval 6 (25-30s): Partial (+), Whole (+), MTS end at 30s is on-task (+)
  const timelineEvents: SimulationBlock[] = useMemo(() => [
    { startSec: 0, endSec: 3.5, status: 'on-task', description: 'Visually scanning sentence 1' },
    { startSec: 3.5, endSec: 5.0, status: 'off-task', description: 'Glanced at window glare' },
    { startSec: 5.0, endSec: 10.0, status: 'on-task', description: 'Continuous gaze on reading line 2' },
    { startSec: 10.0, endSec: 12.0, status: 'off-task', description: 'Shifted head to teacher footsteps' },
    { startSec: 12.0, endSec: 14.5, status: 'on-task', description: 'Visual fixation on vocabulary card' },
    { startSec: 14.5, endSec: 19.0, status: 'off-task', description: 'Hand stimming / peripheral eye flutter' },
    { startSec: 19.0, endSec: 20.0, status: 'on-task', description: 'Brief glance at page' },
    { startSec: 20.0, endSec: 25.0, status: 'off-task', description: 'Staring at ceiling acoustic tiles' },
    { startSec: 25.0, endSec: 30.0, status: 'on-task', description: 'Re-engaged visual focus with reading guide' },
  ], []);

  // Compute Ground Truth Continuous Duration
  const trueOnTaskSec = useMemo(() => {
    return timelineEvents
      .filter(e => e.status === 'on-task')
      .reduce((acc, e) => acc + (e.endSec - e.startSec), 0);
  }, [timelineEvents]);

  const truePercentage = useMemo(() => {
    return Number(((trueOnTaskSec / totalDurationSec) * 100).toFixed(1));
  }, [trueOnTaskSec, totalDurationSec]);

  // Compute Discontinuous Scores
  const intervalScoring = useMemo(() => {
    const intervals = [];
    for (let i = 0; i < totalIntervals; i++) {
      const start = i * intervalLengthSec;
      const end = (i + 1) * intervalLengthSec;

      // Find events overlapping with this interval
      const overlapping = timelineEvents.filter(e => e.startSec < end && e.endSec > start);

      // Check Whole Interval: Did behavior occur 100% of this interval?
      let onTaskDurationInInterval = 0;
      overlapping.forEach(e => {
        if (e.status === 'on-task') {
          const overlapStart = Math.max(e.startSec, start);
          const overlapEnd = Math.min(e.endSec, end);
          onTaskDurationInInterval += Math.max(0, overlapEnd - overlapStart);
        }
      });
      const isWhole = Math.abs(onTaskDurationInInterval - intervalLengthSec) < 0.05;

      // Check Partial Interval: Did behavior occur ANY time in interval?
      const isPartial = onTaskDurationInInterval > 0;

      // Check MTS: Was behavior occurring at exact end?
      const eventAtEnd = timelineEvents.find(e => e.startSec <= end && e.endSec >= end);
      const isMTS = eventAtEnd ? eventAtEnd.status === 'on-task' : false;

      intervals.push({
        intervalNumber: i + 1,
        timeSpan: `${start}s - ${end}s`,
        onTaskDurationInInterval,
        isWhole,
        isPartial,
        isMTS
      });
    }

    const wholeCount = intervals.filter(iv => iv.isWhole).length;
    const partialCount = intervals.filter(iv => iv.isPartial).length;
    const mtsCount = intervals.filter(iv => iv.isMTS).length;

    return {
      intervals,
      wholePercent: Number(((wholeCount / totalIntervals) * 100).toFixed(1)),
      partialPercent: Number(((partialCount / totalIntervals) * 100).toFixed(1)),
      mtsPercent: Number(((mtsCount / totalIntervals) * 100).toFixed(1)),
      wholeCount,
      partialCount,
      mtsCount
    };
  }, [timelineEvents, totalIntervals, intervalLengthSec]);

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        setCurrentTime(prev => {
          const next = prev + delta;
          if (next >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return next;
        });
      }
      lastTimeRef.current = timestamp;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, totalDurationSec]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Find active event at current playhead
  const currentEvent = useMemo(() => {
    return timelineEvents.find(e => currentTime >= e.startSec && currentTime <= e.endSec) || timelineEvents[0];
  }, [currentTime, timelineEvents]);

  const currentIntervalIndex = Math.min(Math.floor(currentTime / intervalLengthSec), totalIntervals - 1);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Interactive Simulation</span>
          <span aria-hidden="true">·</span>
          <span>Core Board Examination Concept</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Discontinuous vs. Continuous Measurement Lab
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Observe how the same 30-second episode of visual tracking behavior produces radically different scores depending on whether you choose Whole Interval, Partial Interval, or Momentary Time Sampling.
        </p>
      </div>

      {/* Main Simulation Stage */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Playback Controls & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Play Observation'}</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              Time: {currentTime.toFixed(1)}s / {totalDurationSec}s
            </div>
          </div>

          {/* Current Real-time Behavior Status */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Live Student State:</span>
            <span
              className={`px-3 py-1 rounded-md font-bold text-xs ${
                currentEvent.status === 'on-task'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {currentEvent.status === 'on-task' ? '● VISUAL GAZE ON TASK' : '▲ GAZE DISENGAGED / LOOKING AWAY'}
            </span>
            <span className="text-slate-500 italic hidden md:inline">({currentEvent.description})</span>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>0s (Start)</span>
            <span>Intervals of 5 seconds</span>
            <span>30s (End)</span>
          </div>

          {/* Interactive Timeline Bar */}
          <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 select-none">
            {/* Behavioral Segments */}
            {timelineEvents.map((evt, idx) => {
              const leftPercent = (evt.startSec / totalDurationSec) * 100;
              const widthPercent = ((evt.endSec - evt.startSec) / totalDurationSec) * 100;
              return (
                <div
                  key={idx}
                  style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  className={`absolute top-0 bottom-0 flex items-center justify-center text-[10px] font-semibold text-white transition-opacity ${
                    evt.status === 'on-task' ? 'bg-emerald-600' : 'bg-slate-400'
                  }`}
                  title={`${evt.status === 'on-task' ? 'On-Task' : 'Off-Task'}: ${evt.description} (${evt.startSec}s - ${evt.endSec}s)`}
                >
                  {widthPercent > 10 && (
                    <span className="truncate px-1 opacity-90">{evt.status === 'on-task' ? 'On-Task' : 'Off'}</span>
                  )}
                </div>
              );
            })}

            {/* Interval Divider Tick Marks */}
            {Array.from({ length: totalIntervals + 1 }, (_, i) => i * intervalLengthSec).map(sec => (
              <div
                key={`tick-${sec}`}
                style={{ left: `${(sec / totalDurationSec) * 100}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10 pointer-events-none"
              >
                <span className="absolute -top-5 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-700 bg-white px-0.5 rounded">
                  {sec}s
                </span>
              </div>
            ))}

            {/* Red Playhead Indicator */}
            <div
              style={{ left: `${(currentTime / totalDurationSec) * 100}%` }}
              className="absolute top-0 bottom-0 w-1 bg-rose-600 z-20 pointer-events-none shadow-md"
            >
              <div className="w-2.5 h-2.5 bg-rose-600 rounded-full -translate-x-[3px] -translate-y-1" />
            </div>
          </div>
        </div>

        {/* Interval-by-Interval Decision Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-lg">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="p-2.5 border-b border-slate-200">Interval</th>
                <th className="p-2.5 border-b border-slate-200">Time Window</th>
                <th className="p-2.5 border-b border-slate-200">Continuous On-Task</th>
                <th className="p-2.5 border-b border-slate-200">Whole Interval (WIR)</th>
                <th className="p-2.5 border-b border-slate-200">Partial Interval (PIR)</th>
                <th className="p-2.5 border-b border-slate-200">Momentary Time Sampling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {intervalScoring.intervals.map((iv, idx) => {
                const isCurrent = idx === currentIntervalIndex;
                return (
                  <tr
                    key={iv.intervalNumber}
                    className={`transition-colors ${
                      isCurrent ? 'bg-indigo-50/80 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-2.5 font-mono text-slate-800 font-bold">
                      Interval {iv.intervalNumber}
                      {isCurrent && <span className="ml-1 text-[10px] text-indigo-600 font-normal">◀ ACTIVE</span>}
                    </td>
                    <td className="p-2.5 text-slate-600 font-mono">{iv.timeSpan}</td>
                    <td className="p-2.5 font-mono text-slate-700">
                      {iv.onTaskDurationInInterval.toFixed(1)}s / {intervalLengthSec}s
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          iv.isWhole ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {iv.isWhole ? '+ (Yes)' : '- (No)'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          iv.isPartial ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {iv.isPartial ? '+ (Yes)' : '- (No)'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          iv.isMTS ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {iv.isMTS ? '+ (Yes)' : '- (No)'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* The Big Comparison Callout: Over- vs. Under-Estimation */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Mathematical Proof of Measurement Artifacts (Exam High-Yield)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Ground Truth */}
            <div className="p-3.5 bg-white rounded-lg border-2 border-slate-900">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Continuous Ground Truth
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">{truePercentage}%</div>
              <p className="text-[11px] text-slate-600 mt-1">
                Actual time spent on-task: <strong>{trueOnTaskSec} seconds</strong> out of 30s.
              </p>
            </div>

            {/* Whole Interval */}
            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                Whole Interval (WIR)
              </span>
              <div className="text-2xl font-bold font-mono text-rose-700">{intervalScoring.wholePercent}%</div>
              <p className="text-[11px] text-rose-700 font-medium mt-1">
                UNDERESTIMATES by {(truePercentage - intervalScoring.wholePercent).toFixed(1)}%!
              </p>
              <div className="text-[10px] text-slate-500 mt-1">
                Requires 100% of interval. Missed 3 intervals due to brief glances away.
              </div>
            </div>

            {/* Partial Interval */}
            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Partial Interval (PIR)
              </span>
              <div className="text-2xl font-bold font-mono text-amber-700">{intervalScoring.partialPercent}%</div>
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                OVERESTIMATES by {(intervalScoring.partialPercent - truePercentage).toFixed(1)}%!
              </p>
              <div className="text-[10px] text-slate-500 mt-1">
                Credited full 5s intervals even if student looked for only 1 second!
              </div>
            </div>

            {/* Momentary Time Sampling */}
            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Momentary Time Sampling
              </span>
              <div className="text-2xl font-bold font-mono text-blue-700">{intervalScoring.mtsPercent}%</div>
              <p className="text-[11px] text-blue-700 font-medium mt-1">
                Within {Math.abs(intervalScoring.mtsPercent - truePercentage).toFixed(1)}% of Ground Truth
              </p>
              <div className="text-[10px] text-slate-500 mt-1">
                Samples only at exact end-ticks (5s, 10s, 15s...). No systematic bias.
              </div>
            </div>
          </div>

          {/* Save Lab Session to Firestore / Dashboard */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              {currentUser ? (
                <span>Logged in as <strong>{currentUser.email}</strong> · Metrics sync to your Progress Dashboard</span>
              ) : (
                <span>Sign in with Google to sync interval lab metrics to your Recharts Dashboard</span>
              )}
            </div>

            <button
              onClick={async () => {
                if (!currentUser) {
                  login();
                  return;
                }
                setIsSaving(true);
                try {
                  await saveIntervalSession({
                    userId: currentUser.uid,
                    scenarioName: 'Maya - Reading with Typoscope (30s)',
                    truePercent: truePercentage,
                    pirPercent: intervalScoring.partialPercent,
                    wirPercent: intervalScoring.wholePercent,
                    mtsPercent: intervalScoring.mtsPercent,
                    biasRecognized: true,
                    createdAt: new Date().toISOString()
                  });
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                } catch (err) {
                  console.error('Failed to log interval lab:', err);
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged to Dashboard & Firestore!</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>{currentUser ? 'Save Lab Results to Dashboard' : 'Sign In & Save Results'}</span>
                </>
              )}
            </button>
          </div>

          {/* Clinical Takeaway */}
          <div className="p-3 bg-indigo-50/80 rounded-lg text-xs text-indigo-900 border border-indigo-100">
            <strong className="block mb-1">Why this matters for your partner's State Board Test:</strong>
            Tennessee State Board test scenario questions will test this exact paradox: If a supervisor asks her to track an autistic child’s visual schedule adherence to qualify for discharge or mastery, using <em>Partial Interval</em> will inflate the success rate to 83.3% when the child was only on-task 56.7% of the time! Conversely, <em>Whole Interval</em> provides a tough, conservative standard (33.3%) ensuring genuine habit formation.
          </div>
        </div>
      </div>
    </div>
  );
};
