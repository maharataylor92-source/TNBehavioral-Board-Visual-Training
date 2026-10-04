import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  Bell,
  BellOff,
  BellRing,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cloud,
  ChevronRight,
  Flame,
  Check,
  Send,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveUserTargetExamDate, getUserProfile } from '../lib/firestoreService';

interface ExamCountdownReminderProps {
  onNavigateTab?: (tabId: string) => void;
}

// Preset upcoming Tennessee RBT Board Exam Pearson VUE testing windows
export interface TennesseeExamWindow {
  id: string;
  name: string;
  dateStr: string; // YYYY-MM-DD
  venue: string;
  notes: string;
}

export const TN_EXAM_PRESETS: TennesseeExamWindow[] = [
  {
    id: 'tn-fall-1',
    name: 'Fall Statewide Testing Cycle 1',
    dateStr: '2026-10-17',
    venue: 'Pearson VUE Tennessee Centers & OnVUE Remote',
    notes: 'Continuous statewide testing window (Nashville, Memphis, Knoxville, Chattanooga).'
  },
  {
    id: 'tn-fall-2',
    name: 'Late October Benchmark Window',
    dateStr: '2026-10-31',
    venue: 'Pearson VUE Statewide / Pearson OnVUE',
    notes: 'End-of-month testing appointment target.'
  },
  {
    id: 'tn-pre-holiday',
    name: 'Pre-Holiday Testing Window',
    dateStr: '2026-11-14',
    venue: 'Pearson VUE Tennessee Centers',
    notes: 'Optimal for candidates completing supervision hours before Thanksgiving.'
  },
  {
    id: 'tn-winter-cycle',
    name: 'Winter Certification Window',
    dateStr: '2026-12-05',
    venue: 'Pearson VUE / Remote OnVUE',
    notes: 'Final BACB Q4 credentialing window for 2026.'
  }
];

// High-yield study reminders & memory hooks tailored for the TN RBT exam
export const STUDY_REMINDER_PEGS = [
  {
    title: 'POW-U Measurement Bias Rule',
    text: 'Partial Interval Recording OVERESTIMATES behavior duration (best for reduction). Whole Interval UNDERESTIMATES (best for skills to increase)!',
    task: 'Task A-3 (Discontinuous)',
    tab: 'exam-simulator'
  },
  {
    title: 'The 4-Point Decision Rule',
    text: '4 consecutive data points below the Aim Line? You MUST alert your BCBA to modify the intervention immediately!',
    task: 'Task A-5 (Progress Monitoring)',
    tab: 'interactive-graph'
  },
  {
    title: 'Latency vs. Duration Distinction',
    text: 'Latency is the elapsed delay BEFORE behavior begins following a prompt. Duration is how long the behavior persists once started!',
    task: 'Task A-2 (Continuous)',
    tab: 'memory-hacks'
  },
  {
    title: 'The Seesaw Rule for Rate & IRT',
    text: 'As response Rate increases, Inter-Response Time (IRT) decreases! High-rate behaviors have very short IRTs.',
    task: 'Task A-2 (Continuous)',
    tab: 'rbt-glossary'
  },
  {
    title: 'Cumulative Record Flatline Rule',
    text: 'Cumulative records NEVER slope downward! A completely flat horizontal line indicates ZERO responses during that period.',
    task: 'Task A-5 (Cumulative Records)',
    tab: 'cumulative-recorder'
  },
  {
    title: 'Hawkins\' Stranger Test',
    text: 'Operational definitions must be Objective, Clear, and Complete without mentalisms like "frustrated" or "bad attitude".',
    task: 'Task A-6 (Definitions)',
    tab: 'study-guide'
  },
  {
    title: 'Inter-Observer Agreement (IOA) Standard',
    text: 'Total Count IOA = (Smaller ÷ Larger) × 100. Must maintain ≥ 80% agreement across 20% to 33% of clinical sessions.',
    task: 'Task A-1 (Prepare)',
    tab: 'study-guide'
  },
  {
    title: 'When NOT to Connect Data Points',
    text: 'NEVER connect data points across solid phase change lines, scale breaks (//), or prolonged student absences!',
    task: 'Task A-5 (Graphing Rules)',
    tab: 'memory-hacks'
  },
  {
    title: 'Momentary Time Sampling (MTS)',
    text: 'MTS only records behavior at the exact instant the interval timer chimes. Ideal for busy classroom teachers with multiple students.',
    task: 'Task A-3 (Discontinuous)',
    tab: 'interval-simulator'
  },
  {
    title: 'Permanent Product Recording',
    text: 'Measures concrete physical outcomes left on the environment (e.g. worksheets completed) without requiring live real-time observation.',
    task: 'Task A-4 (Permanent Product)',
    tab: 'study-guide'
  }
];

export interface SentReminder {
  id: string;
  title: string;
  text: string;
  task: string;
  tab: string;
  sentAt: string;
}

export const ExamCountdownReminder: React.FC<ExamCountdownReminderProps> = ({
  onNavigateTab
}) => {
  const { currentUser } = useAuth();

  // Settings state (initialized from localStorage with fallback)
  const [targetExamDate, setTargetExamDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rbt_target_exam_date');
      return saved || TN_EXAM_PRESETS[0].dateStr;
    } catch {
      return TN_EXAM_PRESETS[0].dateStr;
    }
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    return TN_EXAM_PRESETS[0].id;
  });

  const [reminderFrequency, setReminderFrequency] = useState<
    'every-30-mins' | 'every-2-hours' | 'every-4-hours' | 'daily'
  >(() => {
    try {
      const saved = localStorage.getItem('rbt_reminder_frequency');
      return (saved as any) || 'every-4-hours';
    } catch {
      return 'every-4-hours';
    }
  });

  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rbt_reminders_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rbt_reminder_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Browser notification permission state
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>('default');

  // Live countdown state
  const [timeRemaining, setTimeRemaining] = useState({
    totalSec: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Active in-app banner toast notification
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    text: string;
    task: string;
    tab: string;
  } | null>(null);

  // History of sent reminders
  const [reminderHistory, setReminderHistory] = useState<SentReminder[]>(() => {
    try {
      const saved = localStorage.getItem('rbt_reminder_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showHistoryTray, setShowHistoryTray] = useState<boolean>(false);

  const reminderTimerRef = useRef<any>(null);

  // Check browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPerm(Notification.permission);
    }
  }, []);

  // Sync target exam date from Firestore profile if logged in
  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.uid)
        .then(profile => {
          if (profile && profile.targetExamDate) {
            setTargetExamDate(profile.targetExamDate);
            const matched = TN_EXAM_PRESETS.find(p => p.dateStr === profile.targetExamDate);
            if (matched) setSelectedPresetId(matched.id);
            else setSelectedPresetId('custom');
          }
        })
        .catch(err => console.warn('Could not load user profile target date:', err));
    }
  }, [currentUser]);

  // Countdown timer tick effect (updates every second)
  useEffect(() => {
    const calculateCountdown = () => {
      // Calculate target at 9:00 AM on the target date
      const target = new Date(`${targetExamDate}T09:00:00`);
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeRemaining({
          totalSec: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        });
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeRemaining({
        totalSec,
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetExamDate]);

  // Web Audio chime generator
  const playNotificationChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: B5 (987.77 Hz)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch {
      // AudioContext fallback
    }
  };

  // Dispatches a study reminder notification
  const triggerStudyReminder = (isManualTest: boolean = false) => {
    // Pick a random study tip or rotate
    const randomTip = STUDY_REMINDER_PEGS[Math.floor(Math.random() * STUDY_REMINDER_PEGS.length)];

    const reminderItem: SentReminder = {
      id: `rem_${Date.now()}`,
      title: isManualTest ? `🔔 Test Reminder: ${randomTip.title}` : `⚡ Study Alert: ${randomTip.title}`,
      text: randomTip.text,
      task: randomTip.task,
      tab: randomTip.tab,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Play auditory chime
    playNotificationChime();

    // 2. Set active in-app toast banner
    setActiveToast(reminderItem);

    // 3. Record in reminder history
    setReminderHistory(prev => {
      const updated = [reminderItem, ...prev.slice(0, 9)];
      try {
        localStorage.setItem('rbt_reminder_history', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    // 4. Send native browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(reminderItem.title, {
          body: `${reminderItem.text}\n[${timeRemaining.days} days remaining until TN RBT Board Exam]`,
          icon: '/favicon.ico'
        });
      } catch (err) {
        console.warn('Browser notification error:', err);
      }
    }
  };

  // Request browser notification permission
  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPerm(perm);
        if (perm === 'granted') {
          triggerStudyReminder(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Periodic reminder scheduler
  useEffect(() => {
    if (!remindersEnabled) {
      if (reminderTimerRef.current) clearInterval(reminderTimerRef.current);
      return;
    }

    let intervalMs = 4 * 3600 * 1000; // default 4 hours
    if (reminderFrequency === 'every-30-mins') intervalMs = 30 * 60 * 1000;
    else if (reminderFrequency === 'every-2-hours') intervalMs = 2 * 3600 * 1000;
    else if (reminderFrequency === 'daily') intervalMs = 24 * 3600 * 1000;

    reminderTimerRef.current = setInterval(() => {
      triggerStudyReminder(false);
    }, intervalMs);

    return () => {
      if (reminderTimerRef.current) clearInterval(reminderTimerRef.current);
    };
  }, [remindersEnabled, reminderFrequency]);

  // Handle changing exam date
  const handleSelectExamDate = async (newDateStr: string, presetId?: string) => {
    setTargetExamDate(newDateStr);
    if (presetId) setSelectedPresetId(presetId);
    else setSelectedPresetId('custom');

    try {
      localStorage.setItem('rbt_target_exam_date', newDateStr);
    } catch (e) {
      console.warn(e);
    }

    // Save to Firebase profile if authenticated
    if (currentUser && currentUser.email) {
      setIsSyncingCloud(true);
      try {
        await saveUserTargetExamDate(currentUser.uid, currentUser.email, newDateStr);
      } catch (err) {
        console.warn('Could not save target date to Firebase profile:', err);
      } finally {
        setIsSyncingCloud(false);
      }
    }
  };

  // Save settings handler
  const handleSavePreferences = () => {
    try {
      localStorage.setItem('rbt_reminder_frequency', reminderFrequency);
      localStorage.setItem('rbt_reminders_enabled', String(remindersEnabled));
      localStorage.setItem('rbt_reminder_sound', String(soundEnabled));
    } catch (e) {
      console.warn(e);
    }
    setShowConfigModal(false);
  };

  // Format active preset information
  const activePreset = useMemo(() => {
    return TN_EXAM_PRESETS.find(p => p.dateStr === targetExamDate);
  }, [targetExamDate]);

  // Urgency styling based on days remaining
  const urgencyStatus = useMemo(() => {
    const days = timeRemaining.days;
    if (timeRemaining.isExpired) {
      return {
        badge: 'Exam Day Today / Date Passed',
        color: 'text-slate-800 bg-slate-200 border-slate-300',
        barColor: 'bg-slate-400',
        advice: 'Update your target exam date to calculate your next Tennessee testing window.'
      };
    }
    if (days <= 7) {
      return {
        badge: '🚨 Final Sprint Window (< 7 Days)',
        color: 'text-rose-900 bg-rose-100 border-rose-300',
        barColor: 'bg-rose-500',
        advice: 'Final sprint: Drill formula memory pegs, continuous vs discontinuous bias, and retake missed questions.'
      };
    }
    if (days <= 14) {
      return {
        badge: '⚡ Critical 2-Week Window',
        color: 'text-amber-900 bg-amber-100 border-amber-300',
        barColor: 'bg-amber-500',
        advice: 'Take daily 20-question timed exams and review the 4-Point Progress Monitoring Decision Rule.'
      };
    }
    if (days <= 30) {
      return {
        badge: '🎯 Active Preparation Window',
        color: 'text-indigo-900 bg-indigo-100 border-indigo-300',
        barColor: 'bg-indigo-600',
        advice: 'Work through RBT Task List items A-1 to A-6 and complete the Discontinuous Measurement interval lab.'
      };
    }
    return {
      badge: '🌱 Foundational Study Window',
      color: 'text-emerald-900 bg-emerald-100 border-emerald-300',
      barColor: 'bg-emerald-500',
      advice: 'Establish steady daily 25-minute Pomodoro study habits with the Focus Timer.'
    };
  }, [timeRemaining]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* IN-APP TOAST NOTIFICATION BANNER (Triggered on periodic reminder) */}
      {activeToast && (
        <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 text-white p-3.5 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <BellRing className="w-4 h-4 text-amber-200 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  {activeToast.title}
                </span>
                <span className="text-[10px] bg-white/20 font-mono px-1.5 py-0.2 rounded text-white">
                  {activeToast.task}
                </span>
              </div>
              <p className="text-xs text-white/95 mt-0.5 leading-snug max-w-2xl font-medium">
                {activeToast.text}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {onNavigateTab && (
              <button
                onClick={() => {
                  onNavigateTab(activeToast.tab);
                  setActiveToast(null);
                }}
                className="py-1 px-3 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Study Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setActiveToast(null)}
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-md cursor-pointer transition-colors"
              title="Dismiss notification"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Countdown & Notification Bar Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-indigo-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Tennessee State Board Exam Target Date</span>
              </span>
              <span>·</span>
              <span className="text-amber-300 font-semibold">Pearson VUE / BACB Certified</span>
              {isSyncingCloud && (
                <span className="text-[11px] text-indigo-300 animate-pulse flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> Syncing with Firebase...
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>RBT Board Exam Countdown</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${urgencyStatus.color}`}>
                {urgencyStatus.badge}
              </span>
            </h2>

            <p className="text-xs text-indigo-200/90 leading-relaxed max-w-xl">
              Target testing appointment: <strong className="text-white font-semibold">{new Date(`${targetExamDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              {activePreset ? ` (${activePreset.name})` : ' (Custom Target Appointment)'}
            </p>
          </div>

          {/* Quick Notification Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Send Instant Reminder Button */}
            <button
              onClick={() => triggerStudyReminder(true)}
              className="py-2 px-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Send a sample study reminder with audio chime"
            >
              <Bell className="w-3.5 h-3.5 fill-slate-950" />
              <span>Send Study Alert</span>
            </button>

            {/* Configure Date / Reminders */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Change Date & Reminders</span>
            </button>

            {/* Notification History Tray Toggle */}
            <button
              onClick={() => setShowHistoryTray(!showHistoryTray)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer relative ${
                showHistoryTray
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
              title="Recent reminders history"
            >
              <Clock className="w-4 h-4" />
              {reminderHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* 4 Large Numeric Countdown Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Days */}
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 text-center">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block">
              {String(timeRemaining.days).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mt-0.5">
              Days Remaining
            </span>
          </div>

          {/* Hours */}
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 text-center">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block">
              {String(timeRemaining.hours).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mt-0.5">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 text-center">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mt-0.5">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 text-center">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-300 block">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200/80 block mt-0.5">
              Seconds
            </span>
          </div>
        </div>

        {/* Preparation Advice Strip & Quick Status */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-white/10 text-indigo-200">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{urgencyStatus.advice}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${remindersEnabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span>Reminders: {remindersEnabled ? `Active (${reminderFrequency.replace(/-/g, ' ')})` : 'Muted'}</span>
            </span>

            {browserPerm !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
              >
                Enable Browser Notifications
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RECENT REMINDERS HISTORY TRAY (Expandable) */}
      {showHistoryTray && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Bell className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recent Periodic Study Reminders & Formula Prompts:</span>
            </div>
            {reminderHistory.length > 0 && (
              <button
                onClick={() => {
                  setReminderHistory([]);
                  try {
                    localStorage.removeItem('rbt_reminder_history');
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {reminderHistory.length === 0 ? (
            <p className="text-slate-500 text-[11px] italic">
              No reminders dispatched yet. Click "Send Study Alert" above to trigger an immediate mnemonic reminder!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {reminderHistory.map(rem => (
                <div
                  key={rem.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{rem.title}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{rem.sentAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{rem.text}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-indigo-600 font-medium">
                    <span>{rem.task}</span>
                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab(rem.tab)}
                        className="underline hover:text-indigo-800 font-bold cursor-pointer"
                      >
                        Review Module →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIGURATION & DATE PICKER MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Tennessee Pearson VUE Schedule
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Exam Countdown & Reminder Settings
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target Exam Date Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Select Available Tennessee Pearson VUE Testing Window:
              </label>

              <div className="space-y-2">
                {TN_EXAM_PRESETS.map(preset => {
                  const isSelected = targetExamDate === preset.dateStr;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectExamDate(preset.dateStr, preset.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{preset.name}</span>
                          <span className="font-mono text-indigo-700 bg-white px-2 py-0.2 rounded border border-slate-200 text-[11px]">
                            {preset.dateStr}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{preset.venue}</div>
                        <div className="text-[10px] text-slate-400 italic">{preset.notes}</div>
                      </div>

                      <div className="mt-1">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Or Custom Date */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Or Set Specific Custom Scheduled Date:
                </label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => handleSelectExamDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-mono"
                />
              </div>
            </div>

            {/* Periodic Reminders Settings */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                Periodic Study Reminders & Notifications:
              </label>

              {/* Toggle Enable */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Enable Periodic Reminders</span>
                  <span className="text-[11px] text-slate-500">
                    Sends rotating Tennessee Board study tips and memory hooks.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRemindersEnabled(!remindersEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    remindersEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Frequency Selector */}
              {remindersEnabled && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Reminder Frequency:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'every-30-mins', label: 'Every 30 Mins (Sprint)' },
                      { id: 'every-2-hours', label: 'Every 2 Hours' },
                      { id: 'every-4-hours', label: 'Every 4 Hours (Standard)' },
                      { id: 'daily', label: 'Daily (Morning)' },
                    ].map(freq => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setReminderFrequency(freq.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                          reminderFrequency === freq.id
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sound Effect Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">Reminder Auditory Chime</span>
                    <span className="text-[11px] text-slate-500">
                      Pleasant Web Audio bell when a reminder triggers.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {soundEnabled ? 'Chime ON' : 'Muted'}
                </button>
              </div>

              {/* Browser Push Permission */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-950 block">Browser Push Notifications</span>
                  <span className="text-[11px] text-indigo-800">
                    Status: <strong className="capitalize">{browserPerm}</strong>
                  </span>
                </div>
                {browserPerm !== 'granted' && (
                  <button
                    onClick={handleRequestPermission}
                    className="py-1 px-3 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 cursor-pointer"
                  >
                    Request Permission
                  </button>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
