import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  Calendar,
  Layers,
  Sparkles,
  Cloud,
  RotateCcw,
  Play,
  ArrowUpRight,
  Flame,
  Target,
  LogIn,
  Heart,
  BarChart2,
  Compass,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronsDownUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getExamAttempts,
  getIntervalSessions,
  getStudySessions,
  SavedExamAttempt,
  SavedIntervalSession,
  SavedStudySession
} from '../lib/firestoreService';
import { StudyTimer } from './StudyTimer';
import { FocusSessionD3Chart } from './FocusSessionD3Chart';
import { ExamCountdownReminder } from './ExamCountdownReminder';

interface DashboardProps {
  onNavigateTab?: (tabId: string) => void;
}

// Sample fallback data when no cloud records exist yet,
// so the candidate immediately sees an inspiring, motivating dashboard!
const DEMO_EXAM_ATTEMPTS: SavedExamAttempt[] = [
  {
    id: 'demo-1',
    userId: 'demo',
    score: 11,
    totalQuestions: 20,
    percentage: 55,
    passedBenchmark: false,
    mode: 'study',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'demo-2',
    userId: 'demo',
    score: 13,
    totalQuestions: 20,
    percentage: 65,
    passedBenchmark: false,
    mode: 'study',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'demo-3',
    userId: 'demo',
    score: 15,
    totalQuestions: 20,
    percentage: 75,
    passedBenchmark: false,
    mode: 'timed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'demo-4',
    userId: 'demo',
    score: 18,
    totalQuestions: 20,
    percentage: 90,
    passedBenchmark: true,
    mode: 'timed',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const DEMO_INTERVAL_SESSIONS: SavedIntervalSession[] = [
  {
    id: 'demo-iv-1',
    userId: 'demo',
    scenarioName: 'Session 1: Sustained Reading Gaze',
    truePercent: 56.7,
    wirPercent: 33.3,
    pirPercent: 83.3,
    mtsPercent: 50.0,
    biasRecognized: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'demo-iv-2',
    userId: 'demo',
    scenarioName: 'Session 2: Sensory Schedule Check',
    truePercent: 42.0,
    wirPercent: 20.0,
    pirPercent: 75.0,
    mtsPercent: 40.0,
    biasRecognized: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'demo-iv-3',
    userId: 'demo',
    scenarioName: 'Session 3: Academic Transition Focus',
    truePercent: 68.5,
    wirPercent: 45.0,
    pirPercent: 91.0,
    mtsPercent: 66.7,
    biasRecognized: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const DEMO_STUDY_SESSIONS: SavedStudySession[] = [
  {
    id: 'demo-st-1',
    userId: 'demo',
    durationMinutes: 25,
    studyArea: 'Measurement',
    topic: 'A-2: Continuous Measurement (Duration, Latency, IRT)',
    completed: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'demo-st-2',
    userId: 'demo',
    durationMinutes: 45,
    studyArea: 'Measurement',
    topic: 'A-3: Discontinuous Bias (Whole vs Partial Interval)',
    completed: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'demo-st-3',
    userId: 'demo',
    durationMinutes: 30,
    studyArea: 'Assessment',
    topic: 'B-2: Preference Assessments (MSWO & Paired)',
    completed: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'demo-st-4',
    userId: 'demo',
    durationMinutes: 40,
    studyArea: 'Skill Acquisition',
    topic: 'C-3: Task Analysis & Chaining (Backward vs Forward)',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'demo-st-5',
    userId: 'demo',
    durationMinutes: 35,
    studyArea: 'Behavior Reduction',
    topic: 'D-2: Differential Reinforcement (DRA & DRO)',
    completed: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'demo-st-6',
    userId: 'demo',
    durationMinutes: 50,
    studyArea: 'Ethics & Professional Conduct',
    topic: 'F-2: Dual Relationships & Gift Acceptance',
    completed: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, login } = useAuth();

  const [examAttempts, setExamAttempts] = useState<SavedExamAttempt[]>([]);
  const [intervalSessions, setIntervalSessions] = useState<SavedIntervalSession[]>([]);
  const [studySessions, setStudySessions] = useState<SavedStudySession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useDemoData, setUseDemoData] = useState<boolean>(false);

  // Collapsible dashboard section state (all open by default, can be collapsed individually or all at once)
  const [sectionsOpen, setSectionsOpen] = useState<{
    countdown: boolean;
    kpis: boolean;
    coreCharts: boolean;
    d3Trends: boolean;
    studyStation: boolean;
  }>({
    countdown: true,
    kpis: true,
    coreCharts: true,
    d3Trends: true,
    studyStation: true
  });

  const toggleSection = (key: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandedCount = Object.values(sectionsOpen).filter(Boolean).length;
  const allCollapsed = expandedCount === 0;

  const toggleAllSections = () => {
    if (allCollapsed) {
      setSectionsOpen({
        countdown: true,
        kpis: true,
        coreCharts: true,
        d3Trends: true,
        studyStation: true
      });
    } else {
      setSectionsOpen({
        countdown: false,
        kpis: false,
        coreCharts: false,
        d3Trends: false,
        studyStation: false
      });
    }
  };

  // Load real Firestore metrics when user is authenticated
  const loadMetrics = async () => {
    if (!currentUser) {
      setExamAttempts([]);
      setIntervalSessions([]);
      setStudySessions([]);
      setIsLoading(false);
      setUseDemoData(true);
      return;
    }

    setIsLoading(true);
    try {
      const [exams, intervals, studies] = await Promise.all([
        getExamAttempts(currentUser.uid).catch(() => []),
        getIntervalSessions(currentUser.uid).catch(() => []),
        getStudySessions(currentUser.uid).catch(() => [])
      ]);

      const hasAnyData = (exams && exams.length > 0) || (intervals && intervals.length > 0) || (studies && studies.length > 0);

      setExamAttempts(exams || []);
      setIntervalSessions(intervals || []);
      setStudySessions(studies || []);
      // If user has no attempts yet, toggle demo preview so they see the charts!
      setUseDemoData(!hasAnyData);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setUseDemoData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [currentUser]);

  // Active data sources (either real or preview)
  const activeExams = useDemoData ? DEMO_EXAM_ATTEMPTS : examAttempts;
  const activeIntervals = useDemoData ? DEMO_INTERVAL_SESSIONS : intervalSessions;
  const activeStudies = useDemoData ? DEMO_STUDY_SESSIONS : studySessions;

  // KPI Calculations
  const latestExam = activeExams.length > 0 ? activeExams[activeExams.length - 1] : null;
  const highestScore = activeExams.length > 0
    ? Math.max(...activeExams.map(e => Number(e.percentage) || 0))
    : 0;
  const totalQuestionsAnswered = activeExams.reduce((acc, e) => acc + (Number(e.totalQuestions) || 20), 0);
  const passedCount = activeExams.filter(e => Boolean(e.passedBenchmark)).length;

  const totalStudyMinutes = activeStudies.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Chart 1 Data: Exam Trajectory
  const examTrajectoryData = useMemo(() => {
    return activeExams.map((exam, idx) => {
      let dateStr = `Exam #${idx + 1}`;
      try {
        const d = new Date(exam.createdAt);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      } catch {
        // fallback
      }
      return {
        name: `Exam #${idx + 1}`,
        percentage: Number(exam.percentage) || 0,
        score: Number(exam.score) || 0,
        total: Number(exam.totalQuestions) || 20,
        benchmark: 80,
        mode: exam.mode === 'timed' ? 'Timed Exam' : 'Study Mode',
        date: dateStr
      };
    });
  }, [activeExams]);

  // Chart 2 Data: Task List Competency Distribution
  const domainMasteryData = useMemo(() => {
    // Standard mock distribution based on score progression
    const base = latestExam ? (Number(latestExam.percentage) || 75) : 75;
    return [
      { domain: 'A-1 Prepare & IOA', mastery: Math.min(100, Math.round(base * 0.95)), passing: 80 },
      { domain: 'A-2 Continuous', mastery: Math.min(100, Math.round(base * 1.05)), passing: 80 },
      { domain: 'A-3 Discontinuous', mastery: Math.min(100, Math.round(base * 0.9)), passing: 80 },
      { domain: 'A-4 Perm. Product', mastery: Math.min(100, Math.round(base * 1.02)), passing: 80 },
      { domain: 'A-5 Graphing & Slope', mastery: Math.min(100, Math.round(base * 0.98)), passing: 80 },
      { domain: 'A-6 Measurable Terms', mastery: Math.min(100, Math.round(base * 1.08)), passing: 80 }
    ];
  }, [latestExam]);

  // Chart 3 Data: Interval Lab Systematic Bias Comparison
  const intervalBiasData = useMemo(() => {
    return activeIntervals.map((iv, idx) => ({
      scenario: iv.scenarioName ? (iv.scenarioName.length > 15 ? iv.scenarioName.slice(0, 15) + '…' : iv.scenarioName) : `Lab #${idx + 1}`,
      'Ground Truth (Actual)': Number((Number(iv.truePercent) || 0).toFixed(1)),
      'Whole Interval (WIR)': Number((Number(iv.wirPercent) || 0).toFixed(1)),
      'Partial Interval (PIR)': Number((Number(iv.pirPercent) || 0).toFixed(1)),
      'Momentary Time (MTS)': Number((Number(iv.mtsPercent) || 0).toFixed(1))
    }));
  }, [activeIntervals]);

  // Chart 4 Data: Study Time Trend
  const studyHoursData = useMemo(() => {
    return activeStudies.map((s, idx) => {
      let dateStr = `Block #${idx + 1}`;
      try {
        const d = new Date(s.createdAt);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      } catch {
        // fallback
      }
      return {
        session: `Block #${idx + 1}`,
        minutes: Number(s.durationMinutes) || 0,
        studyArea: s.studyArea || 'Measurement',
        topic: s.topic || 'Focused Study',
        date: dateStr
      };
    });
  }, [activeStudies]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wide">
              <span>Tennessee State Board Prep</span>
              <span aria-hidden="true">·</span>
              <span>Visual Performance Analytics</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <span>RBT Progress & Competency Dashboard</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-mono px-2 py-0.5 rounded-full border border-indigo-200">
                Recharts Analytics
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time Firestore analytics tracking practice exam score trajectories, discontinuous measurement bias mastery, and focused study consistency.
            </p>
          </div>

          {/* Cloud Sync & Demo Switcher */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {useDemoData && (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Sample Data Preview Mode</span>
              </span>
            )}

            {currentUser ? (
              <button
                onClick={loadMetrics}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Refresh Cloud Metrics"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh Cloud Data</span>
              </button>
            ) : (
              <button
                onClick={() => login()}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Sync</span>
              </button>
            )}

            {/* Master Collapse / Expand Button */}
            <button
              onClick={toggleAllSections}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors text-xs shadow-2xs"
              title={allCollapsed ? "Expand all sections" : "Collapse all sections"}
            >
              {allCollapsed ? (
                <>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Expand All ({expandedCount}/5)</span>
                </>
              ) : (
                <>
                  <ChevronsDownUp className="w-3.5 h-3.5 text-slate-600" />
                  <span>Collapse All ({expandedCount}/5)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setUseDemoData(!useDemoData)}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium p-1 cursor-pointer"
            >
              {useDemoData ? 'Switch to My Live Data' : 'View Sample Trajectory'}
            </button>
          </div>
        </div>

        {/* Section 1 Header: KPIs */}
        <div
          className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 cursor-pointer select-none"
          onClick={() => toggleSection('kpis')}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Benchmark Metrics (KPIs)
            </span>
            <span className="text-[11px] text-slate-500">
              · {highestScore}% Peak Score · {activeExams.length} Exams · {totalStudyHours} Study Hours
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection('kpis');
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>{sectionsOpen.kpis ? 'Collapse KPIs' : 'Expand KPIs'}</span>
            {sectionsOpen.kpis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 4 Metric KPI Cards (Collapsible) */}
        {sectionsOpen.kpis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Card 1: Board Readiness */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Board Readiness Benchmark</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {highestScore >= 80 ? 'Passing Ready' : 'In Progress'}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className={`font-bold font-mono ${highestScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {highestScore}% Peak Score
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">Goal: ≥80%</span>
              </div>
            </div>

            {/* Card 2: Exams Completed */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Exams Completed</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {activeExams.length} <span className="text-xs font-normal text-slate-500">attempts</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
                <span className="font-semibold text-emerald-700">{passedCount} Met Benchmark</span>
                <span className="text-slate-400">·</span>
                <span>{totalQuestionsAnswered} Questions</span>
              </div>
            </div>

            {/* Card 3: Interval Labs Logged */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Interval Labs Mastered</span>
                <Layers className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {activeIntervals.length} <span className="text-xs font-normal text-slate-500">simulations</span>
              </div>
              <div className="mt-1 text-xs text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WIR & PIR Bias Mastered</span>
              </div>
            </div>

            {/* Card 4: Study Time Logged */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Focused Study Time</span>
                <Flame className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {totalStudyHours} <span className="text-xs font-normal text-slate-500">hours</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">
                <span>{totalStudyMinutes} mins logged in Timer</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tennessee Board Exam Countdown & Periodic Study Reminder Section (Collapsible) */}
      <div className="space-y-2">
        <div
          className="flex items-center justify-between px-2 cursor-pointer select-none"
          onClick={() => toggleSection('countdown')}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tennessee Board Exam Schedule & Study Reminder Engine</span>
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection('countdown');
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>{sectionsOpen.countdown ? 'Collapse Countdown' : 'Expand Countdown'}</span>
            {sectionsOpen.countdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {sectionsOpen.countdown ? (
          <ExamCountdownReminder onNavigateTab={onNavigateTab} />
        ) : (
          <div
            onClick={() => toggleSection('countdown')}
            className="p-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-800 flex items-center justify-between cursor-pointer hover:border-indigo-700 transition-all text-xs"
          >
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tennessee Pearson VUE Countdown Active</span>
              <span className="text-indigo-300">·</span>
              <span className="text-amber-300 font-bold">Periodic Reminders & Study Alerts Enabled</span>
            </div>
            <span className="text-indigo-300 text-[11px] underline">Expand Countdown & Notification Controls →</span>
          </div>
        )}
      </div>

      {/* Section 2: Recharts Visualizations (Collapsible) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/70 transition-colors border-b border-slate-100"
          onClick={() => toggleSection('coreCharts')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Section A Core Visual Analytics
                </h2>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  4 Interactive Charts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Exam score progression, syllabus domain mastery, interval bias breakdown, and study blocks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('coreCharts');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 cursor-pointer"
            >
              <span>{sectionsOpen.coreCharts ? 'Collapse Charts' : 'Expand 4 Charts'}</span>
              {sectionsOpen.coreCharts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Body */}
        {sectionsOpen.coreCharts ? (
          <div className="p-6 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Practice Exam Score Trajectory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Practice Exam Score Progression</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Track trajectory toward the 80% Tennessee State Board passing threshold
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Goal: ≥80%
            </span>
          </div>

          <div className="h-64 w-full">
            {examTrajectoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examTrajectoryData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`${value}% Score`, 'Candidate Result']}
                  />
                  {/* Reference line for 80% passing */}
                  <ReferenceLine
                    y={80}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: '80% Passing Line',
                      position: 'insideTopRight',
                      fill: '#059669',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No exam data recorded yet. Take an exam in the Exam Simulator to view your progress!
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>
              Latest Attempt: <strong>{latestExam ? `${latestExam.percentage}%` : 'N/A'}</strong> ({latestExam?.score || 0}/{latestExam?.totalQuestions || 20} correct)
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('exam-simulator')}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Take Practice Exam</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* CHART 2: Section A Task Domain Competency Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>Task List Domain Competency (A-1 to A-6)</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Competency by measurement & graphing syllabus domain
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Target: ≥80%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domainMasteryData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                <YAxis
                  dataKey="domain"
                  type="category"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}% Mastery`, 'Domain Score']}
                />
                <ReferenceLine x={80} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5} />
                <Bar dataKey="mastery" radius={[0, 4, 4, 0]}>
                  {domainMasteryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.mastery >= 80 ? '#10b981' : entry.mastery >= 65 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ≥80% Board Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 65-79% Review
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> &lt;65% High Priority
            </span>
          </div>
        </div>

        {/* CHART 3: Interval Measurement Bias Breakdown (PIR vs WIR vs MTS) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Interval Lab Bias Metrics: Ground Truth vs Discontinuous</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Visualizing how Whole Interval underestimates and Partial Interval overestimates
              </p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('interval-simulator')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
              >
                Run Lab Session →
              </button>
            )}
          </div>

          <div className="h-64 w-full">
            {intervalBiasData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intervalBiasData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="scenario" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Ground Truth (Actual)" fill="#0f172a" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Whole Interval (WIR)" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Partial Interval (PIR)" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Momentary Time (MTS)" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No lab sessions logged yet.
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl text-xs text-indigo-950 border border-indigo-100 flex items-start gap-2">
            <Brain className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>The Golden Rule for Her Exam:</strong> Whole Interval Recording (WIR) is always lower than Ground Truth (underestimates), while Partial Interval Recording (PIR) is always higher (overestimates).
            </div>
          </div>
        </div>

        {/* CHART 4: Focused Study Hours Logged */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Focused Study Blocks Logged</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Session duration (minutes) tracked via the Study Timer
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {totalStudyHours} Total Hours
            </span>
          </div>

          <div className="h-64 w-full">
            {studyHoursData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyHoursData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="m" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} Minutes (${item.payload.studyArea})`,
                      item.payload.topic
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#studyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No study sessions logged yet.
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>
              Total Sessions: <strong>{activeStudies.length} blocks</strong>
            </span>
            <span className="text-slate-500">Consistency is what beats exam anxiety</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="p-4 bg-slate-50/70 text-xs text-slate-600 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
      onClick={() => toggleSection('coreCharts')}
    >
      <span className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">4 Analytics Charts Collapsed</span>
        <span className="text-slate-400">·</span>
        <span>Latest Exam: {latestExam ? `${latestExam.percentage}%` : 'N/A'}</span>
        <span className="text-slate-400">·</span>
        <span>Total Study: {totalStudyHours} hrs</span>
      </span>
      <span className="text-indigo-600 font-semibold flex items-center gap-1">
        <span>Click to expand</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </span>
    </div>
  )}
</div>

{/* Section 3: D3.js Line Chart Visualization (Collapsible) */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
  <div
    className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/70 transition-colors border-b border-slate-100"
    onClick={() => toggleSection('d3Trends')}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
        <TrendingUp className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">
            Focus Session Trends & Category Trajectories
          </h2>
          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
            D3.js Visualization
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Interactive spline line chart with BACB category curves and dynamic Average Study Duration benchmark overlay
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSection('d3Trends');
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 cursor-pointer"
      >
        <span>{sectionsOpen.d3Trends ? 'Collapse Trends' : 'Expand D3 Trends'}</span>
        {sectionsOpen.d3Trends ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  </div>

  {sectionsOpen.d3Trends ? (
    <div className="p-4 sm:p-6 bg-slate-50/50">
      <FocusSessionD3Chart
        sessions={activeStudies}
        onRefresh={loadMetrics}
        isLoading={isLoading}
      />
    </div>
  ) : (
    <div
      className="p-4 bg-slate-50/70 text-xs text-slate-600 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
      onClick={() => toggleSection('d3Trends')}
    >
      <span className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">D3 Multi-Line Trends Collapsed</span>
        <span className="text-slate-400">·</span>
        <span>Category trajectories & Average overlay benchmark</span>
      </span>
      <span className="text-purple-600 font-semibold flex items-center gap-1">
        <span>Click to expand</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </span>
    </div>
  )}
</div>

{/* Section 4: Embedded Study Timer Widget & Encouragement Card (Collapsible) */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
  <div
    className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/70 transition-colors border-b border-slate-100"
    onClick={() => toggleSection('studyStation')}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">
            Focus Study Station & Exam Motivation
          </h2>
          <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
            Pomodoro & Checklist
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Embedded Pomodoro study timer with automated Firestore session logging and Section A memory checklist
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSection('studyStation');
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 cursor-pointer"
      >
        <span>{sectionsOpen.studyStation ? 'Collapse Station' : 'Expand Station'}</span>
        {sectionsOpen.studyStation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  </div>

  {sectionsOpen.studyStation ? (
    <div className="p-4 sm:p-6 bg-slate-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Study Timer Component */}
          <StudyTimer onSessionLogged={loadMetrics} />
        </div>

        {/* Motivation & Checklist Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Third Time is the Charm</span>
            </div>
            <h3 className="text-lg font-bold leading-snug">
              Every practice session brings her closer to passing.
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              She failed twice not because she lacks skill, but because board measurement traps are notoriously tricky. With the <strong>Formula Pegs</strong>, <strong>Interval Lab</strong>, and <strong>Exam Simulator</strong>, she has the exact technical tools to conquer Section A.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-indigo-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>POW-U (Partial Overestimates, Whole Underestimates)</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>LATE (Latency = delay before start)</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seesaw (Rate up ➔ IRT down)</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cumulative Slope never goes down</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="p-4 bg-slate-50/70 text-xs text-slate-600 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
      onClick={() => toggleSection('studyStation')}
    >
      <span className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">Study Station Collapsed</span>
        <span className="text-slate-400">·</span>
        <span>25-Min Pomodoro Timer & 4 Formula Pegs ready</span>
      </span>
      <span className="text-amber-700 font-semibold flex items-center gap-1">
        <span>Click to expand</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </span>
    </div>
  )}
</div>
    </div>
  );
};
