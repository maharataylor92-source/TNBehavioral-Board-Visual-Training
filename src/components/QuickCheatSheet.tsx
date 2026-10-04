import React from 'react';
import { Printer, Download, BookMarked, CheckCircle2 } from 'lucide-react';

export const QuickCheatSheet: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <span>Test-Day High Yield</span>
            <span aria-hidden="true">·</span>
            <span>Printable Cheat Sheet</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Tennessee Board Cram Sheet: Data & Graphing
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Condensed formulas, measurement artifacts, graphing rules, and 4-point progress monitoring decision protocols.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF Cheat Sheet</span>
        </button>
      </div>

      {/* Printable Body */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
        <div className="border-b-2 border-slate-900 pb-3">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
                TN Behavioral Health & Board Exam Quick Review
              </h1>
              <div className="text-xs text-slate-600">
                Data Collection, Graphing Visual Analysis & Progress Monitoring for Neurodivergent Learners
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              Exam Version 2026.1
            </div>
          </div>
        </div>

        {/* Section 1: Measurement Artifacts */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
            1. Measurement Systems & Biases (Artifacts)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block text-slate-900 mb-1">Whole Interval Recording (WIR)</strong>
              <div className="text-rose-700 font-bold mb-1">UNDERESTIMATES Behavior Duration</div>
              <p className="text-slate-600 text-[11px]">
                Requires behavior throughout 100% of interval. Best for behaviors to <strong>INCREASE</strong> (e.g., continuous visual gaze on task).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block text-slate-900 mb-1">Partial Interval Recording (PIR)</strong>
              <div className="text-rose-700 font-bold mb-1">OVERESTIMATES Behavior Duration</div>
              <p className="text-slate-600 text-[11px]">
                Scored positive if behavior occurs at ANY point. Best for behaviors to <strong>DECREASE</strong> (e.g., off-task visual wandering, stimming).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block text-slate-900 mb-1">Momentary Time Sampling (MTS)</strong>
              <div className="text-emerald-700 font-bold mb-1">NO SYSTEMATIC BIAS</div>
              <p className="text-slate-600 text-[11px]">
                Scored only at exact end instant. Teacher does not have to watch student continuously; practical for busy classrooms.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Formulas & Calculations */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
            2. Core Board Mathematical Formulas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-bold text-slate-900 font-sans text-xs mb-1">Rate</div>
              <div className="bg-white p-2 rounded border border-slate-200 text-slate-800">
                Rate = Total Count ÷ Total Observation Time
              </div>
              <span className="text-[10px] text-slate-500 font-sans mt-1 block">
                Required when session observation lengths vary across days.
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-bold text-slate-900 font-sans text-xs mb-1">Percentage of Non-Overlapping Data (PND)</div>
              <div className="bg-white p-2 rounded border border-slate-200 text-slate-800 text-[11px]">
                (Intervention pts exceeding highest baseline ÷ Total intervention pts) × 100%
              </div>
              <span className="text-[10px] text-slate-500 font-sans mt-1 block">
                &gt;90% = Highly Effective | 70-90% = Moderate | &lt;50% = Ineffective.
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-bold text-slate-900 font-sans text-xs mb-1">Total Count IOA</div>
              <div className="bg-white p-2 rounded border border-slate-200 text-slate-800">
                IOA = (Smaller Count ÷ Larger Count) × 100%
              </div>
              <span className="text-[10px] text-slate-500 font-sans mt-1 block">
                TN standard: Collected on 20-33% of sessions; must be &gt;= 80%.
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-bold text-slate-900 font-sans text-xs mb-1">Interval-by-Interval IOA</div>
              <div className="bg-white p-2 rounded border border-slate-200 text-slate-800 text-[11px]">
                IOA = [Agreements ÷ (Agreements + Disagreements)] × 100%
              </div>
              <span className="text-[10px] text-slate-500 font-sans mt-1 block">
                The gold standard reliability calculation for time-sampling methods.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Graphing Conventions & 4-Point Rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
              Single-Case Graphing Conventions
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <strong>Solid Vertical Line:</strong> Major Phase Change (new intervention variable).</li>
              <li>• <strong>Dashed Vertical Line:</strong> Minor Condition Change (prompt fading, parameter tweak).</li>
              <li>• <strong>DO NOT CONNECT POINTS:</strong> Across phase lines, across time breaks/absences, across scale breaks.</li>
              <li>• <strong>Cumulative Record Slope:</strong> Steep = High rate, Shallow = Low rate, Flat = Zero responding. (Never goes downward!).</li>
              <li>• <strong>Visual Analysis Triad:</strong> Level (mean/median), Trend (slope direction), Variability (bounce/stability envelope).</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
              The 4-Point Progress Monitoring Rule
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              <li>
                • <strong>4 Consecutive Points BELOW Aim Line:</strong>
                <span className="text-rose-700 font-semibold block">MODIFY INTERVENTION IMMEDIATELY!</span>
                Check treatment fidelity, evaluate sensory clutter/glare, revise prompt hierarchy.
              </li>
              <li>
                • <strong>4 Consecutive Points ABOVE Aim Line:</strong>
                <span className="text-emerald-700 font-semibold block">ACCELERATE PROGRESS / PLAN FADING!</span>
                Raise goal criterion or fade prompt supports toward independence.
              </li>
              <li>
                • <strong>Points bounce equidistant above/below:</strong>
                <span className="text-blue-700 font-semibold block">MAINTAIN CURRENT PLAN & MONITOR.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4: Visual Tracking Specifics for Neurodivergent Students */}
        <div className="p-4 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs text-indigo-950">
          <h4 className="font-bold mb-1 uppercase tracking-wide text-indigo-900">
            Visual Tracking Clinical Rules for Neurodivergent Students
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div>
              <strong>Stranger Test:</strong> Must specify observable orientation (e.g., "head within 45° of worksheet for &gt;= 3 continuous sec"), never subjective traits like "paying attention."
            </div>
            <div>
              <strong>Joint Visual Attention:</strong> Requires 3-point alternating gaze: Student ➔ Object ➔ Communication Partner ➔ Object.
            </div>
            <div>
              <strong>CVI Accommodations:</strong> High figure-ground contrast (yellow/red on black), reduced array complexity (4-8 icons), and extra motor-planning latency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
