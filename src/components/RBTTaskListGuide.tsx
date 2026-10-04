import React, { useState } from 'react';
import {
  CheckCircle2,
  FileCheck,
  Clock,
  Layers,
  BarChart,
  Eye,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface TaskItem {
  code: string;
  title: string;
  summary: string;
  rbtResponsibility: string;
  visualTrackingExample: string;
  examTrap: string;
  boardChecklist: string[];
}

export const RBTTaskListGuide: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string>('A-1');

  const taskItems: TaskItem[] = [
    {
      code: 'A-1',
      title: 'Prepare for Data Collection',
      summary: 'Before the session starts, read the operational definition in the client’s Behavior Intervention Plan (BIP), verify target behaviors, and prepare all physical and digital recording tools.',
      rbtResponsibility: 'An RBT does not create the measurement system (the supervising BCBA designs it). The RBT is responsible for gathering tools (timers, clickers, high-contrast visual tokens, clipboards) and reviewing onset/offset criteria BEFORE interacting with the student.',
      visualTrackingExample: 'For a neurodivergent student working on visual schedule transitions, the RBT ensures the stopwatch is zeroed, the visual icon cards are sequenced, and the 10-second latency criteria is reviewed.',
      examTrap: 'Exam Question Trap: "What is the FIRST thing an RBT must do before beginning a data collection session?" Answer: Read the operational definition and gather materials before approaching the client.',
      boardChecklist: [
        'Review current operational definition and mastery criteria',
        'Gather measurement tools (stopwatch, interval timer, clicker counters)',
        'Prepare antecedent visual materials (high-contrast icons, visual schedule)',
        'Ensure clipboard and pencil or tablet data app are charged and ready'
      ]
    },
    {
      code: 'A-2',
      title: 'Implement Continuous Measurement Procedures',
      summary: 'Recording every single instance of a target behavior throughout the entire observation session without sampling.',
      rbtResponsibility: 'RBTs must be fluent in selecting and calculating the 5 continuous dimensions: Frequency, Rate, Duration, Latency, and IRT.',
      visualTrackingExample: 'Tracking Latency: Measuring the exact seconds from when the RBT says "Check your schedule" to when the student turns head and looks at the icon. Tracking Duration: Timing how many unbroken minutes the student looks at reading materials.',
      examTrap: 'Exam Question Trap: Confusing Latency vs. Duration. Latency is the delay BEFORE the behavior begins. Duration is how long the behavior lasts once started.',
      boardChecklist: [
        'Frequency: Count discrete behaviors with distinct start and stop points',
        'Rate: Count ÷ Total observation time (essential when sessions vary in length)',
        'Duration: Total duration or duration per occurrence',
        'Latency: Elapsed time from antecedent SD / prompt to response onset',
        'IRT (Inter-Response Time): Time between termination of one response and onset of the next (Inverse with Rate: Rate UP ⬆ = IRT DOWN ⬇)'
      ]
    },
    {
      code: 'A-3',
      title: 'Implement Discontinuous Measurement Procedures',
      summary: 'Dividing an observation period into equal time intervals (e.g., 10s or 1 min) and recording whether the behavior occurred during specific portions of the interval.',
      rbtResponsibility: 'RBTs must understand the measurement biases of Whole Interval, Partial Interval, and Momentary Time Sampling.',
      visualTrackingExample: 'Whole Interval (WIR): Marking (+) only if Maya gazes at her worksheet for 100% of the 10-second interval. Partial Interval (PIR): Marking (+) if Ethan visually stims or glances away for even 0.5s.',
      examTrap: 'Exam Question Trap: "POW - U"! Partial Interval OVERESTIMATES behavior (use for behaviors to DECREASE). Whole Interval UNDERESTIMATES behavior (use for behaviors to INCREASE). Momentary Time Sampling has NO systematic bias.',
      boardChecklist: [
        'Whole Interval Recording (WIR): Underestimates behavior duration; conservative for increasing skills',
        'Partial Interval Recording (PIR): Overestimates behavior duration; conservative for decreasing problem behaviors',
        'Momentary Time Sampling (MTS): Record ONLY at the exact split-second the interval ends; practical when RBT is actively teaching',
        'PLACHECK: Planned Activity Check (group-level MTS)'
      ]
    },
    {
      code: 'A-4',
      title: 'Implement Permanent-Product Recording Procedures',
      summary: 'Measuring behavior AFTER it has occurred by assessing the durable physical effect or tangible product it left behind on the environment.',
      rbtResponsibility: 'The RBT does not need to observe the student during the behavior. The product can be scored later.',
      visualTrackingExample: 'Counting the number of correctly placed visual schedule icons moved to the "Finished" pocket, or counting completed worksheet math problems following independent visual scanning.',
      examTrap: 'Exam Question Trap: "A teacher wants to measure on-task reading without watching the student continuously. Can permanent product record visual eye contact?" Answer: NO! Visual eye gaze leaves no tangible physical product behind unless a written worksheet or video recording is produced.',
      boardChecklist: [
        'Does not require real-time direct observation',
        'Target behavior must produce a reliable, concrete physical artifact',
        'RBT must verify that the student actually produced the product independently',
        'Examples: Completed worksheets, assembled puzzles, tokens placed on board'
      ]
    },
    {
      code: 'A-5',
      title: 'Enter Data and Update Graphs',
      summary: 'Inputting collected session data into equal-interval line graphs and communicating trends to the supervising BCBA.',
      rbtResponsibility: 'RBTs plot data immediately after sessions. RBTs do not alter behavior plans or diagnostic labels, but must accurately identify trends, level shifts, and alert the BCBA when progress stalls.',
      visualTrackingExample: 'Plotting session latency on Liam’s equal-interval line graph. Drawing phase change lines when the BCBA introduces a high-contrast visual schedule.',
      examTrap: 'Exam Question Trap: Connecting data points across phase lines! RBTs must NEVER draw a line connecting baseline to intervention points. Cumulative record flat line = ZERO responding.',
      boardChecklist: [
        'Equal-interval line graph is the primary display in ABA',
        'Abscissa (X-axis) = Time/Sessions; Ordinate (Y-axis) = Behavioral dimension',
        'Solid vertical line = Major intervention change; Dashed vertical line = Minor tweak/fading',
        'NEVER connect data points across phase lines or holiday breaks',
        'Cumulative record slope = Rate of responding (never slopes down!)',
        '4-Point Rule Alert: Notify supervising BCBA when 4 consecutive points fall below the aim line'
      ]
    },
    {
      code: 'A-6',
      title: 'Describe Behavior and Environment in Observable and Measurable Terms',
      summary: 'Writing and communicating behavioral descriptions that are objective, clear, and complete without subjective emotional inferences.',
      rbtResponsibility: 'RBTs must avoid mentalistic terms like "frustrated", "stubborn", "hyperactive", or "respectful", replacing them with observable physical actions.',
      visualTrackingExample: 'Instead of saying "Jordan was defiant and refused to look at his schedule," the RBT records: "Jordan turned head 90 degrees away from the schedule board and closed eyes for 15 seconds following the verbal prompt."',
      examTrap: 'Exam Question Trap: The "Stranger Test" and "Dead Man\'s Test". If a dead man can do it (e.g. sitting still, not yelling), it is not an active behavior!',
      boardChecklist: [
        'Objective: Refers strictly to observable physical movement and anatomy',
        'Clear: An unfamiliar substitute RBT can read it and record identical data (Stranger Test)',
        'Complete: Includes explicit onset criteria, duration thresholds, and non-examples',
        'Dead Man\'s Test: Must require active engagement, not passive non-action'
      ]
    }
  ];

  const currentTask = taskItems.find(t => t.code === selectedCode) || taskItems[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wide">
              <span>BACB RBT Task List (2nd Ed.)</span>
              <span aria-hidden="true">·</span>
              <span>Tennessee State Board Standards</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              Section A: Measurement & Graphing for RBTs
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Master the exact 6 competencies evaluated on the RBT state board exam with clinical neurodivergent examples and high-yield board traps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Covers 100% of RBT Section A</span>
            </span>
          </div>
        </div>

        {/* Task List Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5 pt-4 border-t border-slate-100">
          {taskItems.map(item => (
            <button
              key={item.code}
              onClick={() => setSelectedCode(item.code)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedCode === item.code
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-mono font-bold text-xs">{item.code}</div>
              <div className="text-[11px] truncate mt-0.5 opacity-90">{item.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Task Deep-Dive Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 uppercase">
            <span>RBT Task Item: {currentTask.code}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {currentTask.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1 font-medium">
            {currentTask.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Scope & Examples */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <strong className="block font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                Exact Role of the RBT (Tennessee Board Scope):
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {currentTask.rbtResponsibility}
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1.5">
              <strong className="block font-bold text-indigo-950 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Neurodivergent Student Visual Tracking Application:</span>
              </strong>
              <p className="text-indigo-950 leading-relaxed">
                {currentTask.visualTrackingExample}
              </p>
            </div>
          </div>

          {/* Right Column: Board Traps & Checklist */}
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5">
              <strong className="block font-bold text-amber-950 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>RBT State Board Exam Trap:</span>
              </strong>
              <p className="text-amber-900 font-medium leading-relaxed">
                {currentTask.examTrap}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
              <strong className="block font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-slate-600" />
                <span>Must-Know Board Checklist for {currentTask.code}:</span>
              </strong>
              <ul className="space-y-1.5 text-slate-700">
                {currentTask.boardChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
