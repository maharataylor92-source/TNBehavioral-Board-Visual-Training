import React, { useState, useMemo } from 'react';
import { FLASHCARDS } from '../data/flashcards';
import { Flashcard } from '../types';
import {
  RotateCcw,
  Check,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Lightbulb
} from 'lucide-react';

export const FlashcardsMode: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [reviewIds, setReviewIds] = useState<string[]>([]);

  const categories = useMemo(() => {
    const set = new Set(FLASHCARDS.map(f => f.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'All') return FLASHCARDS;
    return FLASHCARDS.filter(f => f.category === selectedCategory);
  }, [selectedCategory]);

  const currentCard: Flashcard | undefined = filteredCards[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    setMasteredIds(prev => [...prev.filter(id => id !== currentCard.id), currentCard.id]);
    setReviewIds(prev => prev.filter(id => id !== currentCard.id));
    handleNext();
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    setReviewIds(prev => [...prev.filter(id => id !== currentCard.id), currentCard.id]);
    setMasteredIds(prev => prev.filter(id => id !== currentCard.id));
    handleNext();
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Spaced Repetition</span>
              <span aria-hidden="true">·</span>
              <span>High-Yield Board Flashcards</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Data & Graphing Flashcards
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Tap any card to flip. Test operational definitions, measurement biases, and graphing conventions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                ✓ {masteredIds.length} Mastered
              </span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                ↻ {reviewIds.length} Need Review
              </span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIdx(0);
                setIsFlipped(false);
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

      {/* Main Flashcard Stage */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] bg-white rounded-2xl border-2 border-slate-200 shadow-md hover:border-indigo-400 p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative select-none"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-indigo-700">{currentCard.category}</span>
              <span className="font-mono">
                Card {currentIdx + 1} of {filteredCards.length}
              </span>
            </div>

            {/* Card Body */}
            <div className="my-auto py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-3">
                  <div className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                    {currentCard.question}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Tap card to reveal answer & board tip</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="text-base font-semibold text-slate-900 leading-relaxed">
                    {currentCard.answer}
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <strong className="block mb-0.5 text-amber-950 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> TN Board Exam Tip:
                    </strong>
                    {currentCard.boardTip}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                    <strong className="block mb-0.5 text-slate-900">Clinical Case Example:</strong>
                    {currentCard.clinicalExample}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer prompt */}
            <div className="text-center text-[11px] text-slate-400 border-t border-slate-100 pt-3">
              {isFlipped ? 'Tap to flip back' : 'Card front'}
            </div>
          </div>

          {/* Action Buttons: Mastered vs Need Review */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors shadow-xs"
              title="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleMarkReview}
              className="flex-1 max-w-xs py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>Study Again (Still Learning)</span>
            </button>

            <button
              onClick={handleMarkMastered}
              className="flex-1 max-w-xs py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Know It (Mastered)</span>
            </button>

            <button
              onClick={handleNext}
              className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors shadow-xs"
              title="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
