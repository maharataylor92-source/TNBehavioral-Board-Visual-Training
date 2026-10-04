import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Cloud,
  Save,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
  Filter,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  ShieldAlert,
  FileText,
  Tag,
  Flame,
  Check,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  saveStudySession,
  getStudySessions,
  deleteStudySession,
  SavedStudySession
} from '../lib/firestoreService';
import { FocusSessionD3Chart } from './FocusSessionD3Chart';

interface StudyTimerProps {
  onSessionLogged?: () => void;
  compact?: boolean;
}

export type StudyAreaId =
  | 'Measurement'
  | 'Assessment'
  | 'Skill Acquisition'
  | 'Behavior Reduction'
  | 'Documentation & Reporting'
  | 'Ethics & Professional Conduct';

export interface StudyAreaConfig {
  id: StudyAreaId;
  name: string;
  sectionCode: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  topics: string[];
}

export const STUDY_AREAS: StudyAreaConfig[] = [
  {
    id: 'Measurement',
    name: 'Measurement',
    sectionCode: 'Section A',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    topics: [
      'A-2: Continuous Measurement (Duration, Latency, IRT, Rate)',
      'A-3: Discontinuous Measurement (Whole, Partial, MTS Bias)',
      'A-4: Permanent Product Recording',
      'A-5: Graphing (Equal-Interval Lines, Abscissa, Ordinate)',
      'A-5: Single-Case Visual Analysis (Trend, Level, 4-Point Rule)',
      'A-5: Cumulative Records & Slope Interpretations',
      'A-1 & A-6: Operational Definitions & IOA Standards'
    ]
  },
  {
    id: 'Assessment',
    name: 'Assessment',
    sectionCode: 'Section B',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    topics: [
      'B-1: Assisting with Functional Behavior Assessments (ABC Data)',
      'B-2: Preference Assessments (Free Operant, MSWO, MSW, Paired)',
      'B-3: Developmental & Milestone Probes',
      'B-4: Assisting with Individualized Curriculum Assessments'
    ]
  },
  {
    id: 'Skill Acquisition',
    name: 'Skill Acquisition',
    sectionCode: 'Section C',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    topics: [
      'C-1: Essential Components of a Written Skill Plan',
      'C-2: Discrete Trial Training (DTT) & Naturalistic Teaching (NET)',
      'C-3: Task Analysis & Chaining (Forward, Backward, Total)',
      'C-4: Prompting Hierarchies, Most-to-Least, & Fading',
      'C-5: Stimulus Control Transfer & Discrimination Training',
      'C-6: Generalization and Maintenance Strategies'
    ]
  },
  {
    id: 'Behavior Reduction',
    name: 'Behavior Reduction',
    sectionCode: 'Section D',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    topics: [
      'D-1: The 4 Common Functions of Behavior (SEAT)',
      'D-2: Differential Reinforcement (DRA, DRI, DRO, DRL)',
      'D-3: Extinction & Handling Extinction Bursts',
      'D-4: Antecedent Modifications (High-P Sequence, FCT)',
      'D-5: Crisis & Emergency De-escalation Protocols'
    ]
  },
  {
    id: 'Documentation & Reporting',
    name: 'Documentation & Reporting',
    sectionCode: 'Section E',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    topics: [
      'E-1: Objective Clinical Session Notes & Topography',
      'E-2: Mandatory Reporting Protocols (Abuse & Neglect)',
      'E-3: Incident Reports, Medication Changes, & Illness',
      'E-4: Professional Communication with Caregivers & Supervisors'
    ]
  },
  {
    id: 'Ethics & Professional Conduct',
    name: 'Ethics',
    sectionCode: 'Section F',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    topics: [
      'F-1: RBT Ethics Code & Maintaining Client Dignity',
      'F-2: Dual Relationships, Gift Acceptance Rules, & Boundaries',
      'F-3: Scope of Practice & Seeking Clinical Supervision (5% Rule)',
      'F-4: Social Media, Confidentiality, & HIPAA / FERPA'
    ]
  }
];

// Sample demo study sessions when candidate starts out
const DEMO_STUDY_LOGS: SavedStudySession[] = [
  {
    id: 'demo-st-1',
    userId: 'demo',
    durationMinutes: 25,
    studyArea: 'Measurement',
    topic: 'A-2: Continuous Measurement (Duration, Latency, IRT, Rate)',
    notes: 'Mastered the Seesaw rule: Rate increases ➔ IRT decreases. Latency is delay BEFORE behavior.',
    completed: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'demo-st-2',
    userId: 'demo',
    durationMinutes: 45,
    studyArea: 'Measurement',
    topic: 'A-3: Discontinuous Measurement (Whole, Partial, MTS Bias)',
    notes: 'Remembered POW-U! Whole underestimates sustained visual reading; Partial overestimates.',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'demo-st-3',
    userId: 'demo',
    durationMinutes: 30,
    studyArea: 'Measurement',
    topic: 'A-5: Graphing & Single-Case Trends',
    notes: 'Practiced 4-point decision rule: 4 below aim line requires immediate plan change.',
    completed: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'demo-st-4',
    userId: 'demo',
    durationMinutes: 35,
    studyArea: 'Ethics & Professional Conduct',
    topic: 'F-2: Dual Relationships, Gift Acceptance Rules, & Boundaries',
    notes: 'Never accept personal gifts over $10; maintain professional boundaries with caregivers.',
    completed: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'demo-st-5',
    userId: 'demo',
    durationMinutes: 40,
    studyArea: 'Skill Acquisition',
    topic: 'C-3: Task Analysis & Chaining (Forward, Backward, Total)',
    notes: 'Backward chaining reinforces the final step first for immediate natural reinforcement.',
    completed: true,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

export const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionLogged, compact = false }) => {
  const { currentUser, login } = useAuth();

  // Active view inside component
  const [activeTab, setActiveTab] = useState<'timer' | 'log' | 'breakdown' | 'trends'>('timer');

  const presets = [
    { label: '25m Pomodoro', minutes: 25 },
    { label: '45m Deep Exam Focus', minutes: 45 },
    { label: '15m Quick Drill', minutes: 15 },
    { label: '5m Short Break', minutes: 5 }
  ];

  // Selected study area & topic
  const [selectedAreaId, setSelectedAreaId] = useState<StudyAreaId>('Measurement');
  const currentAreaConfig = useMemo(() => {
    return STUDY_AREAS.find(a => a.id === selectedAreaId) || STUDY_AREAS[0];
  }, [selectedAreaId]);

  const [selectedTopic, setSelectedTopic] = useState<string>(currentAreaConfig.topics[0]);

  // Update selected topic if study area changes
  useEffect(() => {
    setSelectedTopic(currentAreaConfig.topics[0]);
  }, [selectedAreaId, currentAreaConfig]);

  // Timer states
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Firestore log states
  const [savedLogs, setSavedLogs] = useState<SavedStudySession[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [filterArea, setFilterArea] = useState<string>('All');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  // Load study sessions from Firestore
  const loadLogs = async () => {
    if (!currentUser) {
      setSavedLogs(DEMO_STUDY_LOGS);
      return;
    }
    setIsLoadingLogs(true);
    try {
      const logs = await getStudySessions(currentUser.uid);
      setSavedLogs(logs && logs.length > 0 ? logs : DEMO_STUDY_LOGS);
    } catch (err) {
      console.warn('Could not load study sessions:', err);
      setSavedLogs(DEMO_STUDY_LOGS);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentUser]);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      setIsActive(false);
      setIsCompleted(true);
      setShowLogModal(true);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSelectPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setIsActive(false);
    setIsCompleted(false);
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(selectedMinutes * 60);
    setIsCompleted(false);
    setSaveSuccess(false);
  };

  const handleSaveFocusSession = async () => {
    if (!currentUser) {
      login();
      return;
    }

    setIsSaving(true);
    try {
      const elapsedMinutes = Math.max(1, Math.round((selectedMinutes * 60 - secondsRemaining) / 60));
      const duration = isCompleted ? selectedMinutes : elapsedMinutes;

      await saveStudySession({
        userId: currentUser.uid,
        durationMinutes: duration,
        studyArea: selectedAreaId,
        topic: selectedTopic,
        notes: notes.trim() || undefined,
        completed: isCompleted,
        createdAt: new Date().toISOString()
      });

      setSaveSuccess(true);
      setShowLogModal(false);
      setNotes('');
      await loadLogs();

      if (onSessionLogged) {
        onSessionLogged();
      }

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to log study session:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteStudySession(currentUser.uid, id);
      setSavedLogs(prev => prev.filter(l => l.id !== id));
      if (onSessionLogged) {
        onSessionLogged();
      }
    } catch (err) {
      console.error('Failed to delete study log:', err);
    }
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return savedLogs.filter(log => {
      if (filterArea === 'All') return true;
      return log.studyArea === filterArea;
    });
  }, [savedLogs, filterArea]);

  // Aggregate stats by Study Area
  const areaBreakdown = useMemo(() => {
    const map: Record<string, number> = {
      Measurement: 0,
      Assessment: 0,
      'Skill Acquisition': 0,
      'Behavior Reduction': 0,
      'Documentation & Reporting': 0,
      'Ethics & Professional Conduct': 0
    };

    savedLogs.forEach(l => {
      const area = l.studyArea || 'Measurement';
      const duration = Number(l.durationMinutes) || 0;
      if (map[area] !== undefined) {
        map[area] += duration;
      } else {
        map['Measurement'] += duration;
      }
    });

    const total = Object.values(map).reduce((a, b) => a + b, 0);

    return {
      map,
      totalMinutes: total,
      totalHours: (total / 60).toFixed(1)
    };
  }, [savedLogs]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const progressPercent = ((selectedMinutes * 60 - secondsRemaining) / (selectedMinutes * 60)) * 100;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs ${compact ? 'p-4' : 'p-6'}`}>
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base text-slate-900 flex items-center gap-2">
              <span>RBT Focus Session & Study Timer</span>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 font-mono px-2 py-0.5 rounded-full border border-indigo-200 font-bold">
                Firestore Log
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Categorize focus blocks by RBT study area to ensure balanced board preparation
            </p>
          </div>
        </div>

        {/* Inner Tab Switcher: Timer vs Focus Log vs Area Breakdown */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'timer'
                ? 'bg-white text-indigo-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏱️ Focus Timer
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'log'
                ? 'bg-white text-indigo-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Focus Log ({savedLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'breakdown'
                ? 'bg-white text-indigo-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Distribution</span>
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-white text-indigo-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>D3 Trends</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE FOCUS TIMER */}
      {activeTab === 'timer' && (
        <div className="space-y-5">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {presets.map(p => (
                <button
                  key={p.minutes}
                  onClick={() => handleSelectPreset(p.minutes)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedMinutes === p.minutes && !isCompleted
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* Timer Display with Smooth Progress Ring/Bar */}
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200/80 relative overflow-hidden">
            <div
              className="absolute bottom-0 left-0 top-0 bg-indigo-100/50 transition-all duration-1000 -z-0"
              style={{ width: `${progressPercent}%` }}
            />

            <div className="relative z-10 space-y-1">
              <div className="text-4xl md:text-6xl font-mono font-extrabold text-slate-900 tracking-tight">
                {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {isCompleted ? (
                  <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Focus Block Complete! Log this session below.
                  </span>
                ) : isActive ? (
                  <span className="text-indigo-600 font-semibold animate-pulse">
                    • In the Zone · Focused on {selectedAreaId}
                  </span>
                ) : (
                  <span>Ready to start your next study block</span>
                )}
              </div>
            </div>
          </div>

          {/* RBT Study Area Selector (6 RBT Task List Categories) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select RBT Study Area (Task List Category):</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">
                {currentAreaConfig.sectionCode}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STUDY_AREAS.map(area => (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedAreaId === area.id
                      ? `${area.badgeBg} ${area.badgeBorder} ring-2 ring-indigo-500 font-bold`
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{area.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{area.sectionCode}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Study Topic Dropdown based on chosen Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Specific Concept / Topic Studied:
            </label>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {currentAreaConfig.topics.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Notes field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Session Breakthroughs / Formulas Learned:
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Mastered why Whole Interval underestimates reading gaze; reviewed 4-point rule."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleToggleTimer}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{secondsRemaining < selectedMinutes * 60 ? 'Resume Timer' : 'Start Focus Block'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Save Focus Block Button */}
            <button
              onClick={handleSaveFocusSession}
              disabled={isSaving}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                saveSuccess
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-xs'
              }`}
              title="Save this focus block to your Firestore Study Log"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Logged to Firestore!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Log Focus Block</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: FOCUS SESSION LOG HISTORY */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          {/* Filter Bar & Quick Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Area:
              </span>
              {['All', 'Measurement', 'Assessment', 'Skill Acquisition', 'Behavior Reduction', 'Documentation & Reporting', 'Ethics & Professional Conduct'].map(area => (
                <button
                  key={area}
                  onClick={() => setFilterArea(area)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filterArea === area
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {area === 'Ethics & Professional Conduct' ? 'Ethics' : area}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {filteredLogs.length} Sessions ({areaBreakdown.totalHours} Total Hours)
            </div>
          </div>

          {/* Session Cards List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => {
                const areaConfig = STUDY_AREAS.find(a => a.id === log.studyArea) || STUDY_AREAS[0];

                return (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-50/80 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition-colors flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${areaConfig.badgeBg} ${areaConfig.badgeText} ${areaConfig.badgeBorder}`}>
                          {log.studyArea || 'Measurement'}
                        </span>
                        <span className="font-bold text-slate-900 truncate">
                          {log.topic}
                        </span>
                        <span className="text-slate-400 font-mono">·</span>
                        <span className="font-mono text-indigo-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {log.durationMinutes} mins
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-[11px] text-slate-600 italic bg-white/70 p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                          "{log.notes}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                        <span>
                          {(() => {
                            try {
                              const d = new Date(log.createdAt);
                              return !isNaN(d.getTime())
                                ? `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                : 'Recorded session';
                            } catch {
                              return 'Recorded session';
                            }
                          })()}
                        </span>
                        {log.completed && <span className="text-emerald-600 font-semibold">✓ Full Block</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                No focus sessions logged in this study area yet. Start a timer and log your progress!
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: STUDY AREA DISTRIBUTION BREAKDOWN */}
      {activeTab === 'breakdown' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">Balanced Preparation Strategy:</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              The Tennessee RBT Board Exam assesses candidates across all 6 core BACB task list areas. Use this visual distribution to ensure she allocates time to Ethics and Skill Acquisition alongside Measurement.
            </p>
          </div>

          <div className="space-y-3">
            {STUDY_AREAS.map(area => {
              const minutes = areaBreakdown.map[area.id] || 0;
              const percent = areaBreakdown.totalMinutes > 0
                ? Math.round((minutes / areaBreakdown.totalMinutes) * 100)
                : 0;

              return (
                <div key={area.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${area.badgeBg} ${area.badgeText} ${area.badgeBorder}`}>
                        {area.sectionCode}
                      </span>
                      <strong className="text-slate-800">{area.name}</strong>
                    </div>
                    <span className="font-mono text-slate-700 font-bold">
                      {minutes} mins ({percent}%)
                    </span>
                  </div>

                  {/* Distribution bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Cumulative Focus: <strong>{areaBreakdown.totalMinutes} minutes ({areaBreakdown.totalHours} hrs)</strong></span>
            {currentUser ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Stored in Firestore
              </span>
            ) : (
              <button onClick={() => login()} className="text-indigo-600 font-bold underline">
                Sign in to sync your log
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: D3.JS FOCUS SESSION TRENDS */}
      {activeTab === 'trends' && (
        <div className="pt-1">
          <FocusSessionD3Chart
            sessions={savedLogs}
            onRefresh={loadLogs}
            isLoading={isLoadingLogs}
          />
        </div>
      )}

      {/* Completion Modal Prompt */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Focus Block Finished! Log to Your Permanent Record:</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><strong>Duration:</strong> {selectedMinutes} minutes</div>
              <div><strong>Study Area:</strong> {selectedAreaId}</div>
              <div><strong>Topic:</strong> {selectedTopic}</div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Key Breakthroughs / Memory Anchors:
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What did you learn? (e.g. Mastered difference between Latency and IRT)"
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Skip Logging
              </button>

              <button
                onClick={handleSaveFocusSession}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Focus Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
