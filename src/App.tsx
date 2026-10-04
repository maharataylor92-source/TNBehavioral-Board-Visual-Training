import React, { useState } from 'react';
import { TabMode } from './types';
import { useAuth } from './context/AuthContext';
import { StudyGuideReader } from './components/StudyGuideReader';
import { InteractiveGraphSandbox } from './components/InteractiveGraphSandbox';
import { IntervalSimulator } from './components/IntervalSimulator';
import { CumulativeRecordSimulator } from './components/CumulativeRecordSimulator';
import { PracticeExamMode } from './components/PracticeExamMode';
import { FlashcardsMode } from './components/FlashcardsMode';
import { DataSheetGenerator } from './components/DataSheetGenerator';
import { QuickCheatSheet } from './components/QuickCheatSheet';
import { UnforgettableFormulas } from './components/UnforgettableFormulas';
import { RBTTaskListGuide } from './components/RBTTaskListGuide';
import { RBTGlossary } from './components/RBTGlossary';
import { ExamSimulator } from './components/ExamSimulator';
import { Dashboard } from './components/Dashboard';
import { StudyTimer } from './components/StudyTimer';
import { ShareModal } from './components/ShareModal';
import { CandidatePreviewModal } from './components/CandidatePreviewModal';
import {
  BookOpen,
  LineChart,
  Clock,
  BarChart2,
  FileCheck2,
  Layers,
  FileSpreadsheet,
  Zap,
  Share2,
  Smartphone,
  Heart,
  Cloud,
  CheckCircle2,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabMode>('study-guide');
  const [selectedStudyModuleId, setSelectedStudyModuleId] = useState<string>('module-1-measurement');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPhonePreviewOpen, setIsPhonePreviewOpen] = useState<boolean>(false);
  const { currentUser, login, logout, loading } = useAuth();

  // Fallback to shared URL or current origin
  const sharedUrl = typeof window !== 'undefined'
    ? (window.location.origin.includes('localhost')
        ? 'https://ais-pre-diudb6rxcb3adlbs5qcefa-49174860290.us-east1.run.app'
        : window.location.origin)
    : 'https://ais-pre-diudb6rxcb3adlbs5qcefa-49174860290.us-east1.run.app';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract (3 Zones) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              TN RBT Board Exam
            </span>
            <span className="hidden sm:inline text-xs text-indigo-600 font-semibold">
              / Section A Measurement & Graphing
            </span>
          </div>

          {/* Zone 2: Navigation Links / Segmented Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-indigo-700 hover:text-indigo-900 font-bold bg-indigo-50/70 hover:bg-indigo-100'
              }`}
            >
              📊 Progress Dashboard
            </button>

            <button
              onClick={() => setActiveTab('study-timer')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'study-timer'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-slate-900 font-medium'
              }`}
            >
              ⏱️ Study Timer
            </button>

            <button
              onClick={() => setActiveTab('rbt-task-list')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'rbt-task-list'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              RBT Task List (A-1 to A-6)
            </button>

            <button
              onClick={() => setActiveTab('rbt-glossary')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'rbt-glossary'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-indigo-700 hover:text-indigo-900 font-semibold'
              }`}
            >
              📖 RBT Glossary (A-Z)
            </button>

            <button
              onClick={() => setActiveTab('exam-simulator')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'exam-simulator'
                  ? 'bg-rose-600 text-white shadow-xs font-bold ring-1 ring-rose-700'
                  : 'text-rose-700 hover:text-rose-900 font-bold bg-rose-50/70 hover:bg-rose-100'
              }`}
            >
              🎯 Exam Simulator & Adaptive Quiz
            </button>

            <button
              onClick={() => setActiveTab('memory-hacks')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'memory-hacks'
                  ? 'bg-amber-100 text-amber-950 shadow-xs font-bold'
                  : 'text-amber-800 hover:text-amber-950 font-medium'
              }`}
            >
              ★ Formula Memory Pegs
            </button>

            <button
              onClick={() => setActiveTab('study-guide')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'study-guide'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Study Guide
            </button>

            <button
              onClick={() => setActiveTab('interactive-graph')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'interactive-graph'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Graph Sandbox & 4-Point Rule
            </button>

            <button
              onClick={() => setActiveTab('interval-simulator')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'interval-simulator'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interval Lab
            </button>

            <button
              onClick={() => setActiveTab('cumulative-recorder')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'cumulative-recorder'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Slope
            </button>

            <button
              onClick={() => setActiveTab('practice-exam')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'practice-exam'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Exam
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flashcards
            </button>

            <button
              onClick={() => setActiveTab('datasheet-generator')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'datasheet-generator'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Sheets
            </button>

            <button
              onClick={() => setActiveTab('cheat-sheet')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'cheat-sheet'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cram Sheet
            </button>
          </nav>

          {/* Zone 3: Primary Action (Share with Her / Email & Cloud Sync) */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Candidate'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.displayName?.[0] || 'R'}
                  </div>
                )}
                <span className="hidden sm:inline font-medium text-slate-800 max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-1.5 py-0.5 rounded">
                  <Cloud className="w-3 h-3" />
                  Synced
                </span>
                <button
                  onClick={() => logout()}
                  className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                title="Sign in with Google to sync study progress to Firebase Firestore"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sync with Google</span>
              </button>
            )}

            <button
              onClick={() => setIsPhonePreviewOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
              title="See how the page looks and interacts on her phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview Her Screen</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Share this study suite via email or copy link for iPhone"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share with Her</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium no-scrollbar">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'study-timer', label: '⏱️ Study Timer' },
            { id: 'rbt-task-list', label: 'RBT Task List' },
            { id: 'rbt-glossary', label: '📖 Glossary (A-Z)' },
            { id: 'exam-simulator', label: '🎯 Exam Simulator' },
            { id: 'memory-hacks', label: '★ Memory Pegs' },
            { id: 'study-guide', label: 'Study Guide' },
            { id: 'interactive-graph', label: 'Graph Sandbox' },
            { id: 'interval-simulator', label: 'Interval Lab' },
            { id: 'cumulative-recorder', label: 'Cumulative' },
            { id: 'practice-exam', label: 'Practice Exam' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'datasheet-generator', label: 'Data Sheets' },
            { id: 'cheat-sheet', label: 'Cram Sheet' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabMode)}
              className={`px-3 py-1.5 rounded-md shrink-0 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Subtle dedication banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200/70 no-print">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 fill-rose-500" />
            <span>
              Prepared with love for your Tennessee RBT State Board Exam · Section A Measurement & Graphing
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPhonePreviewOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Preview Her Screen</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Email Link to Her iPhone</span>
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && <Dashboard onNavigateTab={(t) => setActiveTab(t as TabMode)} />}
        {activeTab === 'study-timer' && <StudyTimer />}
        {activeTab === 'rbt-task-list' && <RBTTaskListGuide />}
        {activeTab === 'rbt-glossary' && <RBTGlossary />}
        {activeTab === 'exam-simulator' && (
          <ExamSimulator
            onNavigateToStudyModule={(modId) => {
              setSelectedStudyModuleId(modId);
              setActiveTab('study-guide');
            }}
          />
        )}
        {activeTab === 'study-guide' && (
          <StudyGuideReader
            selectedModuleId={selectedStudyModuleId}
            onSelectModule={(modId) => setSelectedStudyModuleId(modId)}
          />
        )}
        {activeTab === 'memory-hacks' && <UnforgettableFormulas />}
        {activeTab === 'interactive-graph' && <InteractiveGraphSandbox />}
        {activeTab === 'interval-simulator' && <IntervalSimulator />}
        {activeTab === 'cumulative-recorder' && <CumulativeRecordSimulator />}
        {activeTab === 'practice-exam' && <PracticeExamMode />}
        {activeTab === 'flashcards' && <FlashcardsMode />}
        {activeTab === 'datasheet-generator' && <DataSheetGenerator />}
        {activeTab === 'cheat-sheet' && <QuickCheatSheet />}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div className="flex items-center justify-center gap-3">
            <span>TN Board of Applied Behavior Analysis</span>
            <span aria-hidden="true">·</span>
            <span>IDEA Part B Progress Monitoring</span>
            <span aria-hidden="true">·</span>
            <span>Single-Case Visual Analysis</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Designed for special educators, behavior analysts, and therapists supporting neurodivergent students.
          </p>
        </div>
      </footer>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        sharedUrl={sharedUrl}
        onOpenPreview={() => setIsPhonePreviewOpen(true)}
      />

      {/* Candidate Live Preview Modal */}
      <CandidatePreviewModal
        isOpen={isPhonePreviewOpen}
        onClose={() => setIsPhonePreviewOpen(false)}
        sharedUrl={sharedUrl}
      />
    </div>
  );
}
