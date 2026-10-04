import React, { useState, useMemo, useEffect } from 'react';
import {
  RBT_EXAM_QUESTIONS,
  RBTQuestion,
  getSuggestedModuleForQuestion,
  SuggestedStudyGuideReview
} from '../data/rbtExamQuestions';
import { STUDY_MODULES } from '../data/studyModules';
import { useAuth } from '../context/AuthContext';
import {
  saveExamAttempt,
  getExamAttempts,
  SavedExamAttempt,
  saveAdaptiveMistake,
  getAdaptiveMistakes,
  resolveAdaptiveMistake,
  deleteAdaptiveMistake,
  SavedAdaptiveMistake
} from '../lib/firestoreService';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  AlertTriangle,
  Lightbulb,
  Award,
  Filter,
  Layers,
  Clock,
  ChevronLeft,
  ChevronRight,
  Target,
  RefreshCw,
  Heart,
  Cloud,
  Save,
  LogIn,
  BookOpen,
  Zap,
  CheckCheck,
  ExternalLink,
  X,
  Flame,
  Check,
  Info,
  ShieldCheck,
  BookMarked
} from 'lucide-react';

interface ExamSimulatorProps {
  onNavigateToStudyModule?: (moduleId: string) => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  onNavigateToStudyModule
}) => {
  const { currentUser, login } = useAuth();

  // Simulator modes: 'study' (instant feedback), 'timed' (timed simulation), 'adaptive' (adaptive weakness drill)
  const [simulatorMode, setSimulatorMode] = useState<'study' | 'timed' | 'adaptive'>('study');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyMissed, setOnlyMissed] = useState<boolean>(false);
  const [adaptiveDrillFilter, setAdaptiveDrillFilter] = useState<'all' | 'weak-spots-only'>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // User question response state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [feedbackRevealed, setFeedbackRevealed] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [hasSavedToCloud, setHasSavedToCloud] = useState<boolean>(false);
  const [pastAttempts, setPastAttempts] = useState<SavedExamAttempt[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState<boolean>(false);

  // Adaptive mistake tracking in Firebase & local cache
  const [adaptiveMistakes, setAdaptiveMistakes] = useState<SavedAdaptiveMistake[]>(() => {
    try {
      const cached = localStorage.getItem('rbt_adaptive_mistakes');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isAdaptiveSyncing, setIsAdaptiveSyncing] = useState<boolean>(false);
  const [justResolvedId, setJustResolvedId] = useState<string | null>(null);

  // Quick module preview modal state
  const [selectedQuickModuleId, setSelectedQuickModuleId] = useState<string | null>(null);

  // Timed exam timer (starts at 30 minutes)
  const [timeLeftSec, setTimeLeftSec] = useState<number>(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Load past attempts & adaptive mistakes from Firebase when user logs in
  useEffect(() => {
    if (currentUser) {
      setIsLoadingPast(true);
      getExamAttempts(currentUser.uid)
        .then(attempts => {
          setPastAttempts(attempts || []);
        })
        .catch(err => console.warn('Could not load past attempts:', err))
        .finally(() => setIsLoadingPast(false));

      // Fetch cloud adaptive mistakes
      setIsAdaptiveSyncing(true);
      getAdaptiveMistakes(currentUser.uid)
        .then(cloudMistakes => {
          if (cloudMistakes && cloudMistakes.length > 0) {
            setAdaptiveMistakes(cloudMistakes);
            try {
              localStorage.setItem('rbt_adaptive_mistakes', JSON.stringify(cloudMistakes));
            } catch (e) {
              console.warn('LocalStorage save error:', e);
            }
          }
        })
        .catch(err => console.warn('Could not load adaptive mistakes from Firebase:', err))
        .finally(() => setIsAdaptiveSyncing(false));
    } else {
      setPastAttempts([]);
    }
  }, [currentUser]);

  // Sync adaptive mistakes to local storage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('rbt_adaptive_mistakes', JSON.stringify(adaptiveMistakes));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [adaptiveMistakes]);

  // Unresolved mistake IDs (tracked deficits)
  const unresolvedMistakeQuestionIds = useMemo(() => {
    return new Set(
      adaptiveMistakes
        .filter(m => !m.resolved && (m.mistakeCount ?? 1) > 0)
        .map(m => m.questionId)
    );
  }, [adaptiveMistakes]);

  // Build filtered and sorted question list
  const filteredQuestions = useMemo(() => {
    // 1. Initial filter by category
    let list = RBT_EXAM_QUESTIONS.filter(q => {
      const matchCat =
        selectedCategory === 'All' ||
        q.category === selectedCategory ||
        q.taskListCode === selectedCategory;

      if (onlyMissed) {
        const ans = userAnswers[q.id];
        const isMissed = ans !== undefined && ans !== q.correctIndex;
        return matchCat && isMissed;
      }
      return matchCat;
    });

    // 2. In Adaptive Mode:
    if (simulatorMode === 'adaptive') {
      if (adaptiveDrillFilter === 'weak-spots-only') {
        // If weak-spots-only is enabled, filter to questions that have tracked mistakes
        const weakOnly = list.filter(q => unresolvedMistakeQuestionIds.has(q.id));
        if (weakOnly.length > 0) {
          list = weakOnly;
        }
      }

      // Sort questions so that identified weak spots (unresolved mistakes) appear FIRST!
      list = [...list].sort((a, b) => {
        const aIsDeficit = unresolvedMistakeQuestionIds.has(a.id) ? 1 : 0;
        const bIsDeficit = unresolvedMistakeQuestionIds.has(b.id) ? 1 : 0;
        if (bIsDeficit !== aIsDeficit) {
          return bIsDeficit - aIsDeficit; // Deficits first
        }
        // Then sort by difficulty (Tricky Distractor > High-Yield > Board Essential)
        const diffWeight: Record<string, number> = {
          'Tricky Distractor': 3,
          'High-Yield Scenario': 2,
          'Board Essential': 1
        };
        return (diffWeight[b.difficulty] || 0) - (diffWeight[a.difficulty] || 0);
      });
    }

    return list;
  }, [
    selectedCategory,
    onlyMissed,
    userAnswers,
    simulatorMode,
    adaptiveDrillFilter,
    unresolvedMistakeQuestionIds
  ]);

  // Keep currentIdx valid when filter changes
  useEffect(() => {
    if (currentIdx >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIdx(0);
    }
  }, [filteredQuestions.length, currentIdx]);

  // Timer logic for timed simulation mode
  useEffect(() => {
    let interval: any = null;
    if (simulatorMode === 'timed' && isTimerRunning && !isExamSubmitted && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec(prev => {
          if (prev <= 1) {
            setIsExamSubmitted(true);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulatorMode, isTimerRunning, isExamSubmitted, timeLeftSec]);

  const currentQ: RBTQuestion | undefined = filteredQuestions[currentIdx];

  // Calculate scores
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = useMemo(() => {
    return RBT_EXAM_QUESTIONS.filter(q => userAnswers[q.id] === q.correctIndex).length;
  }, [userAnswers]);

  const missedQuestionsCount = useMemo(() => {
    return RBT_EXAM_QUESTIONS.filter(q => {
      const ans = userAnswers[q.id];
      return ans !== undefined && ans !== q.correctIndex;
    }).length;
  }, [userAnswers]);

  const scorePercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Handle selecting an option
  const handleSelectOption = (q: RBTQuestion, optIdx: number) => {
    if (isExamSubmitted && simulatorMode === 'timed') return;

    setUserAnswers(prev => ({ ...prev, [q.id]: optIdx }));

    // In Study Mode and Adaptive Mode, immediately reveal feedback and study suggestions!
    if (simulatorMode === 'study' || simulatorMode === 'adaptive') {
      setFeedbackRevealed(prev => ({ ...prev, [q.id]: true }));
    }

    const isCorrect = optIdx === q.correctIndex;
    const reviewInfo = getSuggestedModuleForQuestion(q);

    if (!isCorrect) {
      // Record or increment mistake in adaptive tracking
      const existing = adaptiveMistakes.find(m => m.questionId === q.id);
      const newMistakeCount = (existing?.mistakeCount || 0) + 1;

      const mistakeRecord: Omit<SavedAdaptiveMistake, 'id'> = {
        userId: currentUser?.uid || 'guest_user',
        questionId: q.id,
        taskListCode: q.taskListCode,
        category: q.category,
        selectedAnswerIndex: optIdx,
        correctAnswerIndex: q.correctIndex,
        suggestedModuleId: reviewInfo.moduleId,
        suggestedModuleTitle: reviewInfo.moduleTitle,
        mistakeCount: newMistakeCount,
        resolved: false,
        lastAttemptAt: new Date().toISOString(),
        createdAt: existing?.createdAt || new Date().toISOString()
      };

      // Update local state immediately
      setAdaptiveMistakes(prev => {
        const filtered = prev.filter(m => m.questionId !== q.id);
        return [...filtered, { id: q.id, ...mistakeRecord }];
      });

      // If user is authenticated, sync with Firebase Firestore
      if (currentUser) {
        saveAdaptiveMistake(mistakeRecord).catch(err =>
          console.warn('Could not save adaptive mistake to Firebase:', err)
        );
      }
    } else {
      // If answered correctly, check if it was previously an unresolved deficit
      const wasUnresolved = adaptiveMistakes.some(
        m => m.questionId === q.id && !m.resolved
      );

      if (wasUnresolved) {
        setJustResolvedId(q.id);
        // Mark resolved locally
        setAdaptiveMistakes(prev =>
          prev.map(m =>
            m.questionId === q.id
              ? { ...m, resolved: true, lastAttemptAt: new Date().toISOString() }
              : m
          )
        );

        // Mark resolved in Firebase
        if (currentUser) {
          resolveAdaptiveMistake(currentUser.uid, q.id).catch(err =>
            console.warn('Could not resolve mistake in Firebase:', err)
          );
        }
      }
    }
  };

  const handleRetryQuestion = (qId: string) => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setFeedbackRevealed(prev => ({ ...prev, [qId]: false }));
    setJustResolvedId(null);
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  // Auto-save exam attempt to Firestore when completed
  useEffect(() => {
    if (isExamSubmitted && currentUser && !hasSavedToCloud && answeredCount > 0) {
      saveExamAttempt({
        userId: currentUser.uid,
        score: correctCount,
        totalQuestions: RBT_EXAM_QUESTIONS.length,
        percentage: scorePercent,
        passedBenchmark: scorePercent >= 80,
        mode: simulatorMode,
        createdAt: new Date().toISOString()
      })
        .then(() => setHasSavedToCloud(true))
        .catch(err => console.warn('Could not auto-save exam to Firestore:', err));
    }
  }, [
    isExamSubmitted,
    currentUser,
    hasSavedToCloud,
    answeredCount,
    correctCount,
    scorePercent,
    simulatorMode
  ]);

  const handleResetSimulator = () => {
    setUserAnswers({});
    setFeedbackRevealed({});
    setCurrentIdx(0);
    setIsExamSubmitted(false);
    setHasSavedToCloud(false);
    setTimeLeftSec(30 * 60);
    setIsTimerRunning(false);
    setOnlyMissed(false);
    setJustResolvedId(null);
  };

  const handleStartTimedExam = () => {
    setSimulatorMode('timed');
    setIsTimerRunning(true);
    setIsExamSubmitted(false);
  };

  const handleStartAdaptiveExam = (onlyWeakSpots: boolean = false) => {
    setSimulatorMode('adaptive');
    setIsTimerRunning(false);
    setIsExamSubmitted(false);
    setAdaptiveDrillFilter(onlyWeakSpots ? 'weak-spots-only' : 'all');
    setCurrentIdx(0);
  };

  const handleClearAdaptiveHistory = async () => {
    if (window.confirm('Reset your adaptive mistake history? This will clear all tracked weak-spot records.')) {
      setAdaptiveMistakes([]);
      try {
        localStorage.removeItem('rbt_adaptive_mistakes');
      } catch (e) {
        console.warn(e);
      }
      if (currentUser) {
        // Delete all in cloud
        for (const mistake of adaptiveMistakes) {
          await deleteAdaptiveMistake(currentUser.uid, mistake.questionId).catch(() => {});
        }
      }
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Category breakdown for final diagnostic report
  const taskListReport = useMemo(() => {
    const map: Record<string, { total: number; correct: number; missed: number; name: string }> = {
      'A-1': { total: 0, correct: 0, missed: 0, name: 'Prepare for Data Collection' },
      'A-2': { total: 0, correct: 0, missed: 0, name: 'Continuous Measurement (Duration/Latency/IRT/Rate)' },
      'A-3': { total: 0, correct: 0, missed: 0, name: 'Discontinuous Measurement (WIR/PIR/MTS)' },
      'A-4': { total: 0, correct: 0, missed: 0, name: 'Permanent Product Recording' },
      'A-5': { total: 0, correct: 0, missed: 0, name: 'Enter Data & Graphing (Lines, Cumulative, Rules)' },
      'A-6': { total: 0, correct: 0, missed: 0, name: 'Describe Behavior in Observable/Measurable Terms' },
    };

    RBT_EXAM_QUESTIONS.forEach(q => {
      if (map[q.taskListCode]) {
        map[q.taskListCode].total += 1;
        const ans = userAnswers[q.id];
        if (ans !== undefined) {
          if (ans === q.correctIndex) {
            map[q.taskListCode].correct += 1;
          } else {
            map[q.taskListCode].missed += 1;
          }
        }
      }
    });

    return map;
  }, [userAnswers]);

  // Aggregated study guide module prescription based on current session errors & historical mistakes
  const prescribedModules = useMemo(() => {
    const moduleMap: Record<
      string,
      {
        review: SuggestedStudyGuideReview;
        currentMissCount: number;
        historicalMissCount: number;
        missedQuestions: RBTQuestion[];
      }
    > = {};

    // 1. Current session misses
    RBT_EXAM_QUESTIONS.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined && ans !== q.correctIndex) {
        const review = getSuggestedModuleForQuestion(q);
        if (!moduleMap[review.moduleId]) {
          moduleMap[review.moduleId] = {
            review,
            currentMissCount: 0,
            historicalMissCount: 0,
            missedQuestions: []
          };
        }
        moduleMap[review.moduleId].currentMissCount += 1;
        moduleMap[review.moduleId].missedQuestions.push(q);
      }
    });

    // 2. Historical unresolved mistakes from adaptive tracking
    adaptiveMistakes.forEach(m => {
      if (!m.resolved && (m.mistakeCount ?? 1) > 0) {
        const q = RBT_EXAM_QUESTIONS.find(item => item.id === m.questionId);
        if (q) {
          const review = getSuggestedModuleForQuestion(q);
          if (!moduleMap[review.moduleId]) {
            moduleMap[review.moduleId] = {
              review,
              currentMissCount: 0,
              historicalMissCount: 0,
              missedQuestions: []
            };
          }
          moduleMap[review.moduleId].historicalMissCount += m.mistakeCount ?? 1;
          if (!moduleMap[review.moduleId].missedQuestions.some(item => item.id === q.id)) {
            moduleMap[review.moduleId].missedQuestions.push(q);
          }
        }
      }
    });

    return Object.values(moduleMap).sort(
      (a, b) =>
        b.currentMissCount * 2 +
        b.historicalMissCount -
        (a.currentMissCount * 2 + a.historicalMissCount)
    );
  }, [userAnswers, adaptiveMistakes]);

  // Current question review info
  const currentReviewInfo: SuggestedStudyGuideReview | null = currentQ
    ? getSuggestedModuleForQuestion(currentQ)
    : null;

  // Active module for quick preview modal
  const activeQuickModule = useMemo(() => {
    if (!selectedQuickModuleId) return null;
    return STUDY_MODULES.find(m => m.id === selectedQuickModuleId) || null;
  }, [selectedQuickModuleId]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wide">
              <span>RBT Board Exam Section A</span>
              <span aria-hidden="true">·</span>
              <span>Measurement & Graphing Simulator</span>
              {simulatorMode === 'adaptive' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500" />
                    Adaptive Mode Active
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              Interactive RBT Exam Simulator
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Tailored specifically to overcome previous test hurdles. Features instant, compassionate feedback, trap distractor breakdowns, Firebase-backed adaptive weakness tracking, and specific study guide prescriptions.
            </p>
          </div>

          {/* Mode Selector & Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setSimulatorMode('study');
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  simulatorMode === 'study'
                    ? 'bg-white text-indigo-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Instant Feedback
              </button>

              <button
                onClick={handleStartTimedExam}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  simulatorMode === 'timed'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timed Exam</span>
              </button>

              {/* NEW ADAPTIVE QUIZ MODE BUTTON */}
              <button
                onClick={() => handleStartAdaptiveExam(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  simulatorMode === 'adaptive'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold ring-1 ring-amber-600'
                    : 'text-amber-800 hover:text-amber-950 bg-amber-50/70 hover:bg-amber-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span>Adaptive Quiz</span>
                {unresolvedMistakeQuestionIds.size > 0 && (
                  <span className="text-[10px] bg-slate-950 text-amber-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                    {unresolvedMistakeQuestionIds.size}
                  </span>
                )}
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={handleResetSimulator}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Reset Simulator"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Adaptive Quiz Mode HUD Banner */}
        {simulatorMode === 'adaptive' && (
          <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-50 via-indigo-50/40 to-amber-50 rounded-xl border border-amber-200/90 text-xs text-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Brain className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Adaptive Algorithm Active: Targeting Your Personal Weak Spots</span>
                {isAdaptiveSyncing && (
                  <span className="text-[10px] text-indigo-600 font-normal animate-pulse flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> Syncing with Firebase...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unresolvedMistakeQuestionIds.size > 0 && (
                  <button
                    onClick={handleClearAdaptiveHistory}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Reset Deficit History
                  </button>
                )}
                <div className="text-[11px] bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                  <span>{unresolvedMistakeQuestionIds.size} Tracked Weak Spots</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Questions are dynamically prioritized based on your historical incorrect answers. As you answer incorrectly, Firebase records the mistake and provides direct links to specific study guide modules. Answering correctly marks the deficit as mastered!
            </p>

            {/* Sub-toggle: Weak spots drill vs full adaptive queue */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/50">
              <span className="text-[11px] font-semibold text-slate-600">Adaptive Drill Focus:</span>
              <button
                onClick={() => setAdaptiveDrillFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  adaptiveDrillFilter === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All 20 Questions (Weak Spots Prioritized First)
              </button>

              <button
                onClick={() => setAdaptiveDrillFilter('weak-spots-only')}
                disabled={unresolvedMistakeQuestionIds.size === 0}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  adaptiveDrillFilter === 'weak-spots-only'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40'
                }`}
              >
                <Target className="w-3 h-3" />
                <span>
                  Targeted Deficit Drill Only ({unresolvedMistakeQuestionIds.size} questions)
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Score & Timer Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">Exam Progress:</span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">
              {answeredCount} / {filteredQuestions.length} Questions Answered
            </span>
            <span className="font-mono bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              {correctCount} Correct ({scorePercent}%)
            </span>
            {missedQuestionsCount > 0 && (
              <button
                onClick={() => setOnlyMissed(!onlyMissed)}
                className={`font-mono text-xs px-2.5 py-0.5 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                  onlyMissed
                    ? 'bg-rose-600 text-white border-rose-600 font-bold'
                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>{onlyMissed ? 'Viewing Missed Only (Exit)' : `Filter ${missedQuestionsCount} Missed Questions`}</span>
              </button>
            )}
          </div>

          {simulatorMode === 'timed' && (
            <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 text-white px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Left: {formatTime(timeLeftSec)}</span>
            </div>
          )}

          {simulatorMode === 'adaptive' && (
            <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              <Cloud className="w-3.5 h-3.5" />
              <span>Firebase Adaptive Deficit Tracking Enabled</span>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Task Domain:
          </span>
          {[
            { id: 'All', label: 'All Tasks (A-1 to A-6)' },
            { id: 'A-2', label: 'A-2 Continuous (Latency/Duration/IRT/Rate)' },
            { id: 'A-3', label: 'A-3 Discontinuous (WIR/PIR/MTS)' },
            { id: 'A-5', label: 'A-5 Graphing & Visual Analysis' },
            { id: 'A-4', label: 'A-4 Permanent Product' },
            { id: 'A-1', label: 'A-1 Prepare & IOA' },
            { id: 'A-6', label: 'A-6 Observable Definitions' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIdx(0);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card or Final Diagnostic Report */}
      {isExamSubmitted ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Exam Simulation Completed!
            </h2>
            <p className="text-xs text-slate-600">
              {simulatorMode === 'adaptive'
                ? 'Your Adaptive Diagnostic Report Card has tracked your incorrect answers and generated a specific study guide review prescription.'
                : 'Here is your comprehensive Section A (Measurement & Graphing) Diagnostic Report Card.'}
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block font-mono text-lg font-bold text-slate-900 mt-2">
              Score: {correctCount} / {RBT_EXAM_QUESTIONS.length} ({scorePercent}%)
              <span className={`block text-xs font-sans font-bold mt-1 ${scorePercent >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {scorePercent >= 80 ? '✓ BOARD PASSING BENCHMARK (≥80%)' : '⚠ NEEDS REVIEW TO REACH 80% TARGET'}
              </span>
            </div>
          </div>

          {/* ADAPTIVE STUDY GUIDE PRESCRIPTION ROADMAP */}
          {prescribedModules.length > 0 && (
            <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/70 rounded-2xl border border-indigo-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Adaptive Study Guide Prescription & Module Recommendations
                    </h3>
                    <p className="text-xs text-slate-600">
                      Based on your tracked incorrect answers, review these targeted study guide chapters before retaking:
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Synced to Firebase Deficit Profile</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescribedModules.map(({ review, currentMissCount, historicalMissCount, missedQuestions }) => {
                  const isHighPriority = currentMissCount >= 2 || historicalMissCount >= 3;

                  return (
                    <div
                      key={review.moduleId}
                      className={`p-4 rounded-xl border transition-all space-y-3 bg-white shadow-xs ${
                        isHighPriority
                          ? 'border-rose-300 ring-1 ring-rose-300/50'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mb-1 ${
                              isHighPriority
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isHighPriority ? '🚨 High Priority Review' : '⚠️ Recommended Review'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {review.moduleTitle}
                          </h4>
                          <span className="text-[11px] text-indigo-700 font-medium block mt-0.5">
                            Focus: {review.sectionTitle}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-700">
                        <div>
                          <strong className="text-slate-900">Core Deficit:</strong> {review.focusConcept}
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          <strong>Takeaway:</strong> {review.summaryTakeaway}
                        </div>
                        <div className="text-amber-800 text-[11px] font-medium">
                          ★ <strong>Memory Peg:</strong> {review.memoryPeg}
                        </div>
                      </div>

                      {/* Missed questions within this module */}
                      <div className="text-[11px] text-slate-500">
                        <span>Missed Questions: </span>
                        {missedQuestions.map((mq, idx) => (
                          <span
                            key={mq.id}
                            className="inline-block font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded mr-1"
                          >
                            Task {mq.taskListCode} (Q{RBT_EXAM_QUESTIONS.findIndex(item => item.id === mq.id) + 1})
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        {onNavigateToStudyModule && (
                          <button
                            onClick={() => onNavigateToStudyModule(review.moduleId)}
                            className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Open Chapter in Study Guide</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedQuickModuleId(review.moduleId)}
                          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          title="Quick Preview Module Takeaways"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>Quick Review</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Diagnostic breakdown by Task List Item */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Diagnostic Breakdown by RBT Task List Category:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {Object.entries(taskListReport).map(([code, item]) => {
                const passRate = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                const isStrong = passRate >= 80;

                return (
                  <div
                    key={code}
                    className={`p-3.5 rounded-xl border ${
                      isStrong ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Task {code}: {item.name}</span>
                      <span className={isStrong ? 'text-emerald-700' : 'text-rose-700 font-bold'}>
                        {passRate}% ({item.correct}/{item.total})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-full ${isStrong ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2">
                      {isStrong ? '✓ Solid clinical grasp!' : 'Review this task section in the Glossary & Study Guide.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Firebase Cloud Sync Status & Past Exam History */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Cloud className="w-4 h-4 text-indigo-600" />
                <span>Firebase Cloud Synchronization</span>
              </div>
              {currentUser ? (
                <span className="text-[11px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Synced to {currentUser.email}
                </span>
              ) : (
                <button
                  onClick={() => login()}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer underline"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in with Google to sync adaptive mistakes</span>
                </button>
              )}
            </div>

            {currentUser && pastAttempts.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-2">
                  Your Past Board Exam Simulation History ({pastAttempts.length} recorded):
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                  {pastAttempts.slice(0, 5).map((att) => (
                    <div
                      key={att.id}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${att.passedBenchmark ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="font-mono font-bold text-slate-900">
                          {att.percentage}% ({att.score}/{att.totalQuestions})
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="capitalize text-slate-600">{att.mode} Mode</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(att.createdAt).toLocaleDateString()} {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200">
            {missedQuestionsCount > 0 && (
              <button
                onClick={() => {
                  setIsExamSubmitted(false);
                  setOnlyMissed(true);
                  setSimulatorMode('study');
                  setCurrentIdx(0);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Review & Retake Missed Questions ({missedQuestionsCount})</span>
              </button>
            )}

            <button
              onClick={() => handleStartAdaptiveExam(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Zap className="w-4 h-4 fill-amber-300" />
              <span>Launch Adaptive Weak-Spot Drill</span>
            </button>

            <button
              onClick={handleResetSimulator}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Start Full Practice Over
            </button>
          </div>
        </div>
      ) : currentQ ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          {/* Question Index & Metadata Header */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                Task {currentQ.taskListCode}
              </span>
              <span className="font-semibold text-slate-700">
                Question {currentIdx + 1} of {filteredQuestions.length}
              </span>
              <span className="hidden sm:inline text-slate-400">·</span>
              <span className="hidden sm:inline text-slate-500">{currentQ.taskListName}</span>

              {unresolvedMistakeQuestionIds.has(currentQ.id) && (
                <span className="ml-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-600" />
                  Identified Weak Spot
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                {currentQ.difficulty}
              </span>
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  bookmarkedIds.includes(currentQ.id)
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{bookmarkedIds.includes(currentQ.id) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          {/* Clinical Scenario Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs md:text-sm leading-relaxed text-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Clinical Scenario:</span>
            </div>
            {currentQ.scenario}
          </div>

          {/* Question Statement */}
          <div className="text-sm md:text-base font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const selectedOpt = userAnswers[currentQ.id];
              const isSelected = selectedOpt === optIdx;
              const isRevealed = feedbackRevealed[currentQ.id] || isExamSubmitted;
              const isCorrect = optIdx === currentQ.correctIndex;

              let style = 'bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
              if (isRevealed) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                } else if (isSelected) {
                  style = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-400';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                }
              } else if (isSelected) {
                style = 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold ring-1 ring-indigo-400';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ, optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${style}`}
                >
                  <span className="font-mono font-bold text-xs shrink-0 mt-0.5 w-6 h-6 rounded-full bg-white/80 border border-slate-300 flex items-center justify-center">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isRevealed && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isRevealed && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* IMMEDIATE FEEDBACK & ADAPTIVE STUDY GUIDE RECOMMENDATIONS */}
          {feedbackRevealed[currentQ.id] && (
            <div className="space-y-4 pt-2">
              {/* If incorrect, show immediate compassionate correction and trap breakdown */}
              {userAnswers[currentQ.id] !== currentQ.correctIndex ? (
                <div className="p-5 bg-rose-50/90 rounded-2xl border border-rose-300 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>Not quite, but here is exactly why (Let's learn it forever!):</span>
                    </div>
                    <button
                      onClick={() => handleRetryQuestion(currentQ.id)}
                      className="text-xs text-rose-700 hover:text-rose-950 font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try This Question Again</span>
                    </button>
                  </div>

                  {/* Why selected option was a trap */}
                  {userAnswers[currentQ.id] !== undefined && (
                    <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs text-slate-800 space-y-1">
                      <strong className="text-rose-700 block">
                        Why Your Selection ({String.fromCharCode(65 + userAnswers[currentQ.id])}) was a Board Trap:
                      </strong>
                      <p className="leading-relaxed">
                        {currentQ.optionFeedback[userAnswers[currentQ.id]]}
                      </p>
                    </div>
                  )}

                  {/* Why correct answer is right */}
                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1">
                    <strong className="text-emerald-700 block">
                      Why Option {String.fromCharCode(65 + currentQ.correctIndex)} is the Correct Board Answer:
                    </strong>
                    <p className="leading-relaxed">{currentQ.explanation}</p>
                  </div>

                  {/* Memory Hook callout */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-amber-900">Unforgettable Memory Hook:</strong>
                      <span className="leading-relaxed">{currentQ.memoryHook}</span>
                    </div>
                  </div>

                  {/* ADAPTIVE STUDY GUIDE RECOMMENDATION CARD */}
                  {currentReviewInfo && (
                    <div className="p-4 bg-white rounded-xl border-2 border-indigo-200/90 shadow-xs space-y-2.5 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>Adaptive Study Guide Recommendation</span>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                          Recorded in Firebase Deficits
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm">
                          Suggested Review: {currentReviewInfo.moduleTitle}
                        </h4>
                        <div className="text-xs text-indigo-700 font-medium">
                          Target Section: {currentReviewInfo.sectionTitle}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                          {currentReviewInfo.focusConcept}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        {onNavigateToStudyModule && (
                          <button
                            onClick={() => onNavigateToStudyModule(currentReviewInfo.moduleId)}
                            className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Open Module in Study Guide</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedQuickModuleId(currentReviewInfo.moduleId)}
                          className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>Quick Review Key Takeaways</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Task & Clinical Context */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rose-200 text-[11px] text-slate-600">
                    <div>
                      <strong className="text-slate-800">BACB Reference:</strong> {currentQ.rbtTaskReference}
                    </div>
                    <div className="text-indigo-800 font-medium">
                      💡 {currentQ.clinicalTip}
                    </div>
                  </div>
                </div>
              ) : (
                /* Celebratory Correct Feedback */
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Brilliant! You nailed the Board Exam logic!</span>
                    </div>

                    {justResolvedId === currentQ.id && (
                      <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Weak Spot Resolved in Firebase!
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-emerald-900">Key Takeaway & Rule:</strong>
                      <span>{currentQ.memoryHook}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-800 font-medium pt-1">
                    ✓ Task Alignment: {currentQ.rbtTaskReference}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Question Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            {/* Quick jump dot bar */}
            <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-md py-1">
              {filteredQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCorrect = ans === q.correctIndex;
                const isDeficit = unresolvedMistakeQuestionIds.has(q.id);

                let dotClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (ans !== undefined) {
                  dotClass = isCorrect ? 'bg-emerald-600 text-white font-bold' : 'bg-rose-600 text-white font-bold';
                } else if (isDeficit) {
                  dotClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
                }

                if (idx === currentIdx) {
                  dotClass += ' ring-2 ring-indigo-600 ring-offset-1 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-md text-[11px] font-mono flex items-center justify-center transition-all cursor-pointer ${dotClass}`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {currentIdx < filteredQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsExamSubmitted(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Exam Simulation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">
            {onlyMissed
              ? 'No Missed Questions in this category!'
              : adaptiveDrillFilter === 'weak-spots-only'
              ? 'No Unresolved Weak Spots!'
              : 'No questions matching this filter.'}
          </h3>
          <p className="text-xs text-slate-600">
            {onlyMissed || adaptiveDrillFilter === 'weak-spots-only'
              ? 'You have answered all available questions correctly or resolved your tracked mistakes! Great job!'
              : 'Try selecting "All Tasks" above.'}
          </p>
          <button
            onClick={() => {
              setOnlyMissed(false);
              setAdaptiveDrillFilter('all');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-indigo-700"
          >
            Show All Questions
          </button>
        </div>
      )}

      {/* QUICK STUDY MODULE PREVIEW MODAL */}
      {activeQuickModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Quick Study Guide Review
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeQuickModule.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeQuickModule.readTimeMinutes} min read</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuickModuleId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Essential Board Exam Takeaways:</span>
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 pl-2">
                {activeQuickModule.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">•</span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tennessee Board Rule */}
            {activeQuickModule.tnBoardNote && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong className="block text-amber-900 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Tennessee Board Standard:
                </strong>
                <p className="leading-relaxed">{activeQuickModule.tnBoardNote}</p>
              </div>
            )}

            {/* Neurodivergent Application */}
            {activeQuickModule.neurodivergentApplication && (
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <strong className="block text-indigo-900 font-bold flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  Clinical & Neurodivergent Consideration:
                </strong>
                <p className="leading-relaxed">
                  {activeQuickModule.neurodivergentApplication}
                </p>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedQuickModuleId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Close & Return to Exam
              </button>

              {onNavigateToStudyModule && (
                <button
                  onClick={() => {
                    const id = activeQuickModule.id;
                    setSelectedQuickModuleId(null);
                    onNavigateToStudyModule(id);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Full Chapter in Study Guide Reader</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
