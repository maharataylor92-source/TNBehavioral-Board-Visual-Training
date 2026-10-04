import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Mail,
  Smartphone,
  Share2,
  ExternalLink
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
  onOpenPreview?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, sharedUrl, onOpenPreview }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const emailSubject = encodeURIComponent('For You: TN RBT Board Exam Study Suite (Data Collection & Graphing)');
  const emailBody = encodeURIComponent(
    `Hey my love! I had this study guide and interactive simulation suite built specifically for you and your RBT state board exam in Tennessee:

${sharedUrl}

I know how hard you've worked with your neurodivergent students every day, and I know how frustrating it's been to miss passing by a few points. This app focuses directly on the exact areas that tripped you up: Measurement, Data Collection, and Graphing (BACB Task List Section A).

Here is what's in here for you:
• ★ Formula Memory Pegs: Unforgettable visual hooks so you never mix up Whole vs Partial Interval (POW-U) or Total Count IOA (The Pyramid rule).
• BACB Task List Section A Guide: Broken down item-by-item (A-1 through A-6) with RBT board traps.
• Interactive Graph Sandbox: Practice Level, Trend, Aim Lines, and the 4-Point Rule on real student cases (like Liam and Maya!).
• Interval Measurement Lab: See why Whole Interval underestimates and Partial Interval overestimates with a live timer.
• Cumulative Recorder Simulator: See how the pen steps and why flat horizontal lines mean zero responding.
• RBT Practice Exam & Flashcards: Real test-style scenario questions with instant explanations.
• Printable Data Collection Sheets & Test-Morning Cram Sheet!

iPhone Tip: Open this link in Safari on your iPhone, tap the Share button (square with arrow pointing up at the bottom), and tap "Add to Home Screen". It will save right on your phone like an app so you can study in bed or during breaks at school.

I believe in you so much. Third time is the charm—you've got this!`
  );

  const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share with Her (Email & iPhone Ready)
              </h3>
              <p className="text-xs text-slate-500">
                Send directly via email or copy the link for text messaging.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Direct Web App Link:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={sharedUrl}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Quick Email Launcher & Preview Buttons */}
        <div className="space-y-2">
          <a
            href={mailtoLink}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Mail className="w-4 h-4" />
            <span>Open Email to Send to Her</span>
          </a>

          {onOpenPreview && (
            <button
              onClick={() => {
                onClose();
                onOpenPreview();
              }}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview How It Looks on Her Screen First</span>
            </button>
          )}

          <p className="text-[11px] text-slate-500 text-center mt-1">
            Opens your default email client with a pre-written study guide note.
          </p>
        </div>

        {/* iPhone Instructions Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>How She Can Add It to Her iPhone Home Screen:</span>
          </div>
          <ol className="text-slate-600 list-decimal list-inside space-y-1 text-[11px]">
            <li>Open the emailed link in <strong>Safari</strong> on her iPhone.</li>
            <li>Tap the <strong>Share</strong> button at the bottom of the screen (square with an up-arrow).</li>
            <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
            <li>Tap <strong>Add</strong> in the top-right corner. It will now live on her iPhone like an app for quick studying at school!</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="text-right pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
