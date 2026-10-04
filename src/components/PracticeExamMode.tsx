import React, { useState, useMemo } from 'react';
import { MOCK_EXAM_QUESTIONS } from '../data/mockExamQuestions';
import { ExamQuestion } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Award,
  Filter
} from 'lucide-react';

export const PracticeExamMode: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showRationale, setShowRationale] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'All') return MOCK_EXAM_QUESTIONS;
    return MOCK_EXAM_QUESTIONS.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  const currentQ: ExamQuestion | undefined = filteredQuestions[currentIdx];

  const categories = useMemo(() => {
    const set = new Set(MOCK_EXAM_QUESTIONS.map(q => q.category));
    return ['All', ...Array.from(set)];
  }, []);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isExamSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setShowRationale(prev => ({ ...prev, [qId]: true }));
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  // Score calculations
  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = useMemo(() => {
    return filteredQuestions.filter(q => selectedAnswers[q.id] === q.correctIndex).length;
  }, [filteredQuestions, selectedAnswers]);

  const scorePercent = filteredQuestions.length > 0
    ? Math.round((correctCount / filteredQuestions.length) * 100)
    : 0;

  const handleResetExam = () => {
    setSelectedAnswers({});
    setShowRationale({});
    setCurrentIdx(0);
    setIsExamSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Tennessee State Board Preparation</span>
              <span aria-hidden="true">·</span>
              <span>Interactive Mock Exam</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Data Collection & Graphing Board Practice
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Realistic clinical scenarios targeting visual tracking metrics, progress monitoring rules, and graphical interpretation.
            </p>
          </div>

          {/* Quick Score Capsule */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-700 flex items-center gap-2">
              <span className="font-semibold text-slate-900">Progress:</span>
              <span>{totalAnswered} / {filteredQuestions.length} answered</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-600 font-bold">{scorePercent}% Score</span>
            </div>

            <button
              onClick={handleResetExam}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset Test"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Domain:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIdx(0);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {currentQ ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Question Nav & Bookmark Bar */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
            <span className="font-semibold text-indigo-700">
              Question {currentIdx + 1} of {filteredQuestions.length} ({currentQ.category})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  bookmarkedIds.includes(currentQ.id)
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{bookmarkedIds.includes(currentQ.id) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          {/* Clinical Scenario */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs leading-relaxed text-slate-800">
            <span className="font-bold text-slate-900 block mb-1 text-sm">Clinical Scenario:</span>
            {currentQ.scenario}
          </div>

          {/* Optional SVG Question Graph */}
          {currentQ.hasGraph && currentQ.graphData && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-2">
                Referenced Graph Exhibit:
              </span>
              <div className="max-w-md mx-auto">
                <svg viewBox="0 0 400 180" className="w-full h-auto bg-slate-50 border border-slate-200 rounded font-sans">
                  {/* Axes */}
                  <line x1="50" y1="150" x2="380" y2="150" stroke="#475569" strokeWidth="1.5" />
                  <line x1="50" y1="20" x2="50" y2="150" stroke="#475569" strokeWidth="1.5" />

                  {/* Y Axis Label */}
                  <text x="-85" y="18" transform="rotate(-90)" textAnchor="middle" className="text-[9px] fill-slate-600">
                    {currentQ.graphData.yLabel}
                  </text>
                  <text x="215" y="172" textAnchor="middle" className="text-[9px] fill-slate-600">
                    Sessions
                  </text>

                  {/* Baseline points */}
                  {currentQ.graphData.baseline.map((val, i) => {
                    const x = 70 + i * 25;
                    const y = 150 - (val / 16) * 120;
                    return (
                      <g key={`b-${i}`}>
                        <circle cx={x} cy={y} r="3.5" fill="#475569" />
                        {i > 0 && (
                          <line
                            x1={70 + (i - 1) * 25}
                            y1={150 - (currentQ.graphData!.baseline[i - 1] / 16) * 120}
                            x2={x}
                            y2={y}
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Phase Line */}
                  {currentQ.graphData.intervention.length > 0 && (
                    <line x1="180" y1="20" x2="180" y2="150" stroke="#0f172a" strokeWidth="1.5" />
                  )}

                  {/* Intervention points */}
                  {currentQ.graphData.intervention.map((val, i) => {
                    const x = 195 + i * 25;
                    const y = 150 - (val / 16) * 120;
                    return (
                      <g key={`iv-${i}`}>
                        <circle cx={x} cy={y} r="3.5" fill="#2563eb" />
                        {i > 0 && (
                          <line
                            x1={195 + (i - 1) * 25}
                            y1={150 - (currentQ.graphData!.intervention[i - 1] / 16) * 120}
                            x2={x}
                            y2={y}
                            stroke="#2563eb"
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Aim Line if present */}
                  {currentQ.graphData.aimLine && (
                    <line
                      x1="170"
                      y1={150 - (currentQ.graphData.aimLine.start / 16) * 120}
                      x2="350"
                      y2={150 - (currentQ.graphData.aimLine.end / 16) * 120}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}
                </svg>
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="text-sm font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const isRevealed = showRationale[currentQ.id];
              const isCorrect = optIdx === currentQ.correctIndex;

              let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
              if (isRevealed) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium';
                } else if (isSelected) {
                  style = 'bg-rose-50 border-rose-300 text-rose-950';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-indigo-50 border-indigo-300 text-indigo-950';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${style}`}
                >
                  <span className="font-mono font-bold text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {isRevealed && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isRevealed && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Rationale & Board Reference Callout */}
          {showRationale[currentQ.id] && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Board Rationale & Clinical Analysis:</span>
              </div>
              <p className="text-slate-700">{currentQ.explanation}</p>
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="text-slate-600">
                  <strong className="text-slate-800">TN Board Authority:</strong> {currentQ.tnBoardReference}
                </div>
                <div className="text-indigo-700 font-medium">
                  <strong>Clinical Impact:</strong> {currentQ.clinicalRelevance}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Question Navigation Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Quick jump dots */}
            <div className="hidden sm:flex items-center gap-1">
              {filteredQuestions.map((q, idx) => {
                const ans = selectedAnswers[q.id];
                const isCorrect = ans === q.correctIndex;
                let dotClass = 'bg-slate-200 text-slate-600';
                if (ans !== undefined) {
                  dotClass = isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
                }
                if (idx === currentIdx) {
                  dotClass += ' ring-2 ring-indigo-500 ring-offset-1 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-6 h-6 rounded text-[10px] font-mono flex items-center justify-center transition-all ${dotClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentIdx(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
              disabled={currentIdx === filteredQuestions.length - 1}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          No questions in this category.
        </div>
      )}
    </div>
  );
};
