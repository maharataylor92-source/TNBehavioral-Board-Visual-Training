import React, { useState, useMemo } from 'react';
import { RBT_GLOSSARY, GlossaryTerm } from '../data/rbtGlossary';
import {
  Search,
  BookOpen,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Filter,
  Eye,
  RotateCcw,
  Volume2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const RBTGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [selfTestMode, setSelfTestMode] = useState<boolean>(false);

  const categories = useMemo(() => {
    const set = new Set(RBT_GLOSSARY.map(t => t.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredTerms = useMemo(() => {
    return RBT_GLOSSARY.filter(t => {
      const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        t.term.toLowerCase().includes(q) ||
        (t.acronym && t.acronym.toLowerCase().includes(q)) ||
        t.simpleDefinition.toLowerCase().includes(q) ||
        t.memoryHook.toLowerCase().includes(q) ||
        t.rbtExamFocus.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wide">
              <span>Tennessee RBT Exam Terminology</span>
              <span aria-hidden="true">·</span>
              <span>Plain English Definitions</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              RBT Measurement & Graphing Glossary
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Crystal-clear, jargon-free explanations for IOA, Latency, IRT, Duration, Frequency, and graphing terms with memory hooks and neurodivergent examples.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelfTestMode(!selfTestMode);
                setRevealedIds({});
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                selfTestMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{selfTestMode ? 'Exit Self-Quiz Mode' : 'Turn on Self-Quiz Mode'}</span>
            </button>
          </div>
        </div>

        {/* Visual Comparison Anchor: The 3 Time Dimensions */}
        <div className="mt-5 p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Never Confuse the 3 Time Dimensions Again: Latency vs. Duration vs. IRT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
            <div className="p-3 bg-white/10 rounded-lg border border-white/10">
              <strong className="text-amber-300 block mb-0.5 text-sm">1. LATENCY</strong>
              <div className="text-indigo-200 font-medium mb-1">Delay BEFORE behavior begins</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Time from presenting the visual cue until the student initiates movement.
              </p>
              <span className="text-[10px] text-amber-200 font-mono mt-1 block">
                Prompt ➔ [LATENCY] ➔ Student starts
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-lg border border-white/10">
              <strong className="text-emerald-300 block mb-0.5 text-sm">2. DURATION</strong>
              <div className="text-indigo-200 font-medium mb-1">How LONG behavior lasts</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Time from when behavior starts until it stops. Continuous visual gaze.
              </p>
              <span className="text-[10px] text-emerald-200 font-mono mt-1 block">
                Start looking ➔ [DURATION] ➔ Looks away
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-lg border border-white/10">
              <strong className="text-blue-300 block mb-0.5 text-sm">3. IRT (Inter-Response)</strong>
              <div className="text-indigo-200 font-medium mb-1">Pause BETWEEN two behaviors</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Time between the end of response #1 and the start of response #2.
              </p>
              <span className="text-[10px] text-blue-200 font-mono mt-1 block">
                End Response 1 ➔ [IRT] ➔ Start Response 2
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search term, acronym, or concept (e.g. IOA, latency, X-axis)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map(item => {
          const isHidden = selfTestMode && !revealedIds[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 shadow-xs p-5 space-y-3.5 transition-all"
            >
              {/* Top Row: Term, Phonetics, Category */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.term}
                    </h3>
                    {item.acronym && item.acronym !== item.term && (
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded border border-indigo-100">
                        {item.acronym}
                      </span>
                    )}
                  </div>
                  {item.phonetic && (
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Phonetic: /{item.phonetic}/
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              {/* Body Content */}
              {isHidden ? (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-slate-400 italic">
                    Definition hidden in Self-Quiz mode.
                  </p>
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Reveal Definition & Exam Tip
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {/* Plain English Definition */}
                  <div>
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-0.5">
                      Plain English Definition:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {item.simpleDefinition}
                    </p>
                  </div>

                  {/* RBT Exam Focus / Common Trap */}
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950">
                    <strong className="block text-amber-900 font-bold mb-0.5 text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> How It Appears on the RBT Exam:
                    </strong>
                    <p className="leading-relaxed text-[11px]">
                      {item.rbtExamFocus}
                    </p>
                  </div>

                  {/* Everyday Clinical Example */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                    <strong className="block text-slate-900 font-bold mb-0.5 text-[11px] flex items-center gap-1">
                      <Eye className="w-3 h-3 text-indigo-600" /> Neurodivergent Student Example:
                    </strong>
                    <p className="leading-relaxed text-[11px]">
                      {item.clinicalExample}
                    </p>
                  </div>

                  {/* Memory Hook */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-900 font-semibold flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Memory Hook: {item.memoryHook}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          No glossary terms match your search query "{searchTerm}".
        </div>
      )}
    </div>
  );
};
