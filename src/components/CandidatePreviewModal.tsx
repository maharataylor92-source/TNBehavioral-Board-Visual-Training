import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  ExternalLink,
  Share2,
  Heart,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  RotateCw,
  Compass,
  Bookmark,
  Check,
  ChevronRight
} from 'lucide-react';
import { TabMode } from '../types';
import { StudyGuideReader } from './StudyGuideReader';
import { Dashboard } from './Dashboard';
import { ExamSimulator } from './ExamSimulator';
import { StudyTimer } from './StudyTimer';
import { UnforgettableFormulas } from './UnforgettableFormulas';

interface CandidatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const CandidatePreviewModal: React.FC<CandidatePreviewModalProps> = ({
  isOpen,
  onClose,
  sharedUrl
}) => {
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'desktop'>('iphone');
  const [previewTab, setPreviewTab] = useState<TabMode>('study-guide');
  const [showSafariGuide, setShowSafariGuide] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar */}
        <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Her Experience: Live View Preview
                </h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 fill-rose-300" />
                  What she sees on her screen
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulating how the page renders when she taps the link from her text or email.
              </p>
            </div>
          </div>

          {/* Viewport switchers & actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setDeviceMode('iphone')}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  deviceMode === 'iphone'
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone View</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Laptop / Desktop</span>
              </button>
            </div>

            <a
              href={sharedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informational Callout Bar */}
        <div className="bg-indigo-950/60 border-b border-indigo-900/60 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              <strong>Zero Friction:</strong> No mandatory login or password required. She can read study modules, take practice tests, or log focus sessions immediately.
            </span>
          </div>
          <button
            onClick={() => setShowSafariGuide(!showSafariGuide)}
            className="text-[11px] text-indigo-300 hover:text-indigo-100 underline shrink-0 cursor-pointer"
          >
            {showSafariGuide ? 'Hide iPhone Tip' : 'Show iPhone Tip'}
          </button>
        </div>

        {/* Main Body with Device Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-start">
          {deviceMode === 'iphone' ? (
            /* iPhone 15 Pro Simulated Frame */
            <div className="w-[385px] max-w-full bg-slate-900 rounded-[50px] p-3 shadow-2xl border-[4px] border-slate-700 ring-1 ring-white/10 flex flex-col my-auto relative">
              {/* iPhone Hardware Outer Rim & Dynamic Island */}
              <div className="relative bg-white rounded-[38px] overflow-hidden flex flex-col h-[740px] shadow-inner text-slate-900">
                {/* iOS Status Bar */}
                <div className="bg-slate-900 text-white pt-2.5 px-6 pb-1.5 flex items-center justify-between text-[11px] font-semibold tracking-tight select-none">
                  <span>9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-24 h-4 bg-black rounded-full mx-auto" />
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-white rounded-xs p-0.5 flex items-center">
                      <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Mobile Safari Address Bar */}
                <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span className="font-mono text-[10px] text-slate-600 truncate">
                      ais-pre-diudb6rxcb3adlbs5qcefa...
                    </span>
                  </div>
                  <RotateCw className="w-3 h-3 text-slate-400 shrink-0" />
                </div>

                {/* Web App Viewport (Scrollable) */}
                <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
                  {/* Mobile Web Header */}
                  <div className="bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                    <div>
                      <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1">
                        <span>TN RBT Board Exam</span>
                      </div>
                      <div className="text-[9px] font-semibold text-indigo-600">
                        Section A: Measurement & Graphing
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                        Guest Mode
                      </span>
                    </div>
                  </div>

                  {/* Mobile Tab Scrollbar */}
                  <div className="bg-white border-b border-slate-100 px-2 py-1.5 overflow-x-auto flex items-center gap-1 no-scrollbar shrink-0">
                    {[
                      { id: 'study-guide', label: '📖 Study Guide' },
                      { id: 'dashboard', label: '📊 Dashboard' },
                      { id: 'study-timer', label: '⏱️ Study Timer' },
                      { id: 'exam-simulator', label: '🎯 Exam Simulator' },
                      { id: 'memory-hacks', label: '★ Memory Pegs' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPreviewTab(tab.id as TabMode)}
                        className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-colors cursor-pointer ${
                          previewTab === tab.id
                            ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Heartfelt Dedication Banner */}
                  <div className="mx-3 mt-3 p-2.5 bg-rose-50 rounded-xl border border-rose-200/80 text-[11px] text-rose-900 flex items-start gap-2 shadow-2xs">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-rose-950">
                        Prepared with love for your TN RBT Board Exam
                      </span>
                      <span className="text-[10px] text-rose-700 block mt-0.5">
                        Focused on Section A Measurement & Graphing traps so you ace it this time!
                      </span>
                    </div>
                  </div>

                  {/* Screen Content Preview */}
                  <div className="p-3 flex-1">
                    {previewTab === 'study-guide' && (
                      <div className="space-y-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                            Chapter 1 · 8 Min Read
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            Section A-1 to A-5: Continuous vs Discontinuous Measurement
                          </h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Master Rate, Frequency, Duration, Latency, and IRT on student IEP target behaviors.
                          </p>
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 space-y-1">
                            <strong className="block text-amber-950 font-bold">
                              TN State Board Exam Trap:
                            </strong>
                            "If the behavior has no clear beginning and end (e.g. continuous screaming or humming), NEVER use Event Recording / Frequency. Use Duration or Partial Interval."
                          </div>
                        </div>

                        <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-950 space-y-1.5">
                          <div className="font-bold flex items-center gap-1 text-[10px] uppercase text-indigo-900">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Quick Memory Hack:</span>
                          </div>
                          <p>
                            <strong>POW-U:</strong> <strong>P</strong>artial <strong>O</strong>verestimates · <strong>W</strong>hole <strong>U</strong>nderestimates.
                          </p>
                        </div>
                      </div>
                    )}

                    {previewTab === 'dashboard' && (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              Exam Readiness Score
                            </span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              88% Passing
                            </span>
                          </div>
                          <div className="text-xl font-extrabold text-slate-900">
                            Ready for Section A
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[88%]" />
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                            <span>D3 Focus Trends & Average Line</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Shows daily minutes per BACB area with the purple dashed benchmark line.
                          </p>
                          <div className="h-20 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                            [Interactive D3 Multi-Line Visualization Active]
                          </div>
                        </div>
                      </div>
                    )}

                    {previewTab === 'study-timer' && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Pomodoro Focus Block
                        </span>
                        <div className="text-3xl font-extrabold text-slate-900 font-mono">
                          25:00
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-2xs">
                            Start Focus
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Automatically logs BACB Task List study minutes to her profile.
                        </p>
                      </div>
                    )}

                    {previewTab === 'exam-simulator' && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                          <span>Question 1 of 40</span>
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                            High-Yield
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-900 leading-snug">
                          A student engages in hand-flapping for 12 seconds, stops, and flaps again 45 seconds later. Which measurement is 45 seconds?
                        </p>
                        <div className="space-y-1.5">
                          {['A. Latency', 'B. Duration', 'C. Interresponse Time (IRT)', 'D. Momentary Time Sampling'].map((opt, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded-lg text-[11px] border ${
                                i === 2
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              {opt} {i === 2 && '✓ Correct'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewTab === 'memory-hacks' && (
                      <div className="space-y-2.5">
                        <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1.5">
                          <div className="font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Total Count IOA Formula:</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-amber-200 font-mono text-[11px] text-center font-bold text-amber-900">
                            (Smaller Count ÷ Larger Count) × 100%
                          </div>
                          <p className="text-[10px] text-amber-800">
                            <strong>Memory Hook:</strong> Think of a pyramid—the smaller count ALWAYS sits on top of the larger base!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Safari Bottom Bar with "Add to Home Screen" Callout */}
                  <div className="bg-slate-100 border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-slate-600 shrink-0">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    {/* Share Button (Pulsing to show she can add to home screen) */}
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 animate-pulse shadow-xs">
                        <Share2 className="w-3.5 h-3.5" />
                      </div>
                      {showSafariGuide && (
                        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl text-center z-30 pointer-events-none">
                          <span className="font-bold text-indigo-300">iPhone Tip:</span> Tap Share → "Add to Home Screen" to install it as an app!
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      )}
                    </div>
                    <Bookmark className="w-4 h-4 text-slate-500" />
                    <div className="w-4 h-4 border border-slate-500 rounded-xs flex items-center justify-center text-[8px] font-bold">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop / Laptop Viewport Preview */
            <div className="w-full bg-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden text-slate-900 flex flex-col">
              {/* Browser Window Header */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2 text-xs text-slate-600 font-mono w-96 shadow-2xs">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span className="truncate">{sharedUrl}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Candidate Desktop View
                </div>
              </div>

              {/* Dedication Banner */}
              <div className="bg-rose-50 border-b border-rose-100 px-6 py-2 flex items-center justify-between text-xs text-rose-900">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span className="font-semibold">
                    Prepared with love for your Tennessee RBT State Board Exam · Section A Measurement & Graphing
                  </span>
                </div>
                <span className="text-[11px] text-rose-700">
                  Ready to study anytime
                </span>
              </div>

              {/* Navigation Preview */}
              <div className="border-b border-slate-200 px-6 py-2 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">TN RBT Board Exam</span>
                  <span className="text-xs text-indigo-600 font-semibold">/ Section A</span>
                </div>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'study-guide', label: 'Study Guide' },
                    { id: 'dashboard', label: '📊 Dashboard' },
                    { id: 'study-timer', label: '⏱️ Study Timer' },
                    { id: 'exam-simulator', label: '🎯 Exam Simulator' },
                    { id: 'memory-hacks', label: '★ Memory Pegs' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id as TabMode)}
                      className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
                        previewTab === tab.id
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500">
                  Guest Mode (No Sign-In Required)
                </div>
              </div>

              {/* Desktop Preview Content */}
              <div className="p-6 bg-slate-50 min-h-[420px]">
                {previewTab === 'study-guide' && <StudyGuideReader />}
                {previewTab === 'dashboard' && <Dashboard />}
                {previewTab === 'study-timer' && <StudyTimer />}
                {previewTab === 'exam-simulator' && <ExamSimulator />}
                {previewTab === 'memory-hacks' && <UnforgettableFormulas />}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Feature Highlights Bar */}
        <div className="bg-slate-800/90 border-t border-slate-700 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 shrink-0">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" /> No App Store install needed
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Check className="w-3.5 h-3.5" /> Direct instant link opening
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Check className="w-3.5 h-3.5" /> Works offline & on iPhone Safari
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Looks Great! Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
