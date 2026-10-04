import React, { useState } from 'react';
import { STUDY_MODULES } from '../data/studyModules';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Bookmark
} from 'lucide-react';

interface StudyGuideReaderProps {
  selectedModuleId?: string;
  onSelectModule?: (moduleId: string) => void;
}

export const StudyGuideReader: React.FC<StudyGuideReaderProps> = ({
  selectedModuleId,
  onSelectModule
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(selectedModuleId || STUDY_MODULES[0].id);

  const activeModuleId = selectedModuleId || internalActiveId;

  const handleSelect = (id: string) => {
    setInternalActiveId(id);
    if (onSelectModule) {
      onSelectModule(id);
    }
  };

  const activeModule = STUDY_MODULES.find(m => m.id === activeModuleId) || STUDY_MODULES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 sticky top-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
          Study Guide Chapters
        </div>

        <nav className="space-y-1">
          {STUDY_MODULES.map((mod, idx) => {
            const isActive = mod.id === activeModuleId;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelect(mod.id)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-950 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div>
                  <div className="line-clamp-1">{mod.title}</div>
                  <div className="text-[11px] font-normal text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{mod.readTimeMinutes} min read</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </nav>

        {/* Tennessee Quick Reference Note */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 mt-4">
          <strong className="block text-slate-900 font-semibold mb-1">State Exam Scope:</strong>
          TN Applied Behavior Analysis Rule 1180, DIDD Behavior Support Guidelines, and IDEA Part B IEP progress monitoring criteria.
        </div>
      </div>

      {/* Main Chapter Content Body */}
      <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Chapter Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            <span>Tennessee State Board Study Suite</span>
            <span aria-hidden="true">·</span>
            <span>{activeModule.readTimeMinutes} min read</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {activeModule.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            {activeModule.subtitle}
          </p>
        </div>

        {/* Key Takeaways Card */}
        <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs space-y-2">
          <div className="font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>High-Yield Board Takeaways:</span>
          </div>
          <ul className="space-y-1.5 text-indigo-950">
            {activeModule.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* State Board Regulatory Alert */}
        {activeModule.tnBoardNote && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-900 mb-0.5">Tennessee Board Regulatory Focus:</strong>
              {activeModule.tnBoardNote}
            </div>
          </div>
        )}

        {/* HTML Article Body */}
        <div
          className="prose prose-slate max-w-none text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: activeModule.contentHtml }}
        />

        {/* Neurodivergent Clinical Application Note */}
        {activeModule.neurodivergentApplication && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
            <strong className="block font-bold text-emerald-900 mb-1">
              Neurodivergent Student Clinical Application:
            </strong>
            <p className="text-emerald-900 leading-relaxed">
              {activeModule.neurodivergentApplication}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
