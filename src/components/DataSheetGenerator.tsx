import React, { useState, useEffect } from 'react';
import { Printer, FileText, Download, Check, Sparkles, Cloud, Save, FolderOpen, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveCustomDataSheet, getCustomDataSheets, deleteCustomDataSheet, SavedDataSheet } from '../lib/firestoreService';

export const DataSheetGenerator: React.FC = () => {
  const { currentUser, login } = useAuth();
  const [studentName, setStudentName] = useState<string>('Student A');
  const [observerName, setObserverName] = useState<string>('');
  const [templateType, setTemplateType] = useState<'latency' | 'interval' | 'duration' | 'frequency'>('latency');
  const [setting, setSetting] = useState<string>('Special Education Classroom / Academic Centers');
  const [operationalDef, setOperationalDef] = useState<string>(
    'Student initiates physical movement toward the target work station within 10 seconds of staff presenting the visual schedule icon strip without verbal prompting.'
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [savedSheets, setSavedSheets] = useState<SavedDataSheet[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      getCustomDataSheets(currentUser.uid)
        .then(sheets => setSavedSheets(sheets || []))
        .catch(err => console.warn('Could not load saved data sheets:', err));
    } else {
      setSavedSheets([]);
    }
  }, [currentUser, saveSuccess]);

  const handleSaveToCloud = async () => {
    if (!currentUser) {
      login();
      return;
    }
    setIsSaving(true);
    try {
      const dimensionMap: Record<string, any> = {
        latency: 'Latency',
        duration: 'Duration',
        frequency: 'Frequency',
        interval: 'Whole Interval'
      };
      await saveCustomDataSheet({
        userId: currentUser.uid,
        studentName: studentName.trim() || 'Student',
        observerName: observerName.trim() || undefined,
        targetBehavior: operationalDef.trim() || 'Target behavior',
        measurementType: dimensionMap[templateType] || 'Duration',
        setting: setting.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save data sheet:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSheet = (sheet: SavedDataSheet) => {
    setStudentName(sheet.studentName);
    if (sheet.observerName) setObserverName(sheet.observerName);
    if (sheet.setting) setSetting(sheet.setting);
    setOperationalDef(sheet.targetBehavior);
    if (sheet.measurementType === 'Latency') setTemplateType('latency');
    else if (sheet.measurementType === 'Duration') setTemplateType('duration');
    else if (sheet.measurementType === 'Frequency') setTemplateType('frequency');
    else if (sheet.measurementType.includes('Interval')) setTemplateType('interval');
    setShowSavedModal(false);
  };

  const handleDeleteSheet = async (sheetId: string) => {
    if (!currentUser) return;
    try {
      await deleteCustomDataSheet(currentUser.uid, sheetId);
      setSavedSheets(prev => prev.filter(s => s.id !== sheetId));
    } catch (err) {
      console.error('Failed to delete sheet:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyPreset = (type: 'latency' | 'interval' | 'duration' | 'frequency') => {
    setTemplateType(type);
    if (type === 'latency') {
      setOperationalDef(
        'Elapsed time in seconds from the presentation of the visual prompt/schedule strip until the student orients head and initiates movement toward the scheduled station.'
      );
    } else if (type === 'interval') {
      setOperationalDef(
        'Whole Interval: Student maintains continuous visual gaze toward instructional materials (book/worksheet/tablet) for the entire 10-second interval without gaze diversion exceeding 1 second.'
      );
    } else if (type === 'duration') {
      setOperationalDef(
        'Total duration in minutes and seconds from initial visual gaze engagement with task materials until student looks away for 3 or more consecutive seconds.'
      );
    } else if (type === 'frequency') {
      setOperationalDef(
        'Discrete count of triadic joint visual attention shifts (looking from instructional toy to educator face and back to toy) during 10-minute structured circle time.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Clinical Practice Tool</span>
              <span aria-hidden="true">·</span>
              <span>Printable Classroom Templates</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Visual Tracking Data Sheet Generator
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Generate standardized, board-compliant data collection sheets for classroom paraprofessionals, therapists, and IEP progress monitoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {savedSheets.length > 0 && (
              <button
                onClick={() => setShowSavedModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg transition-colors cursor-pointer border border-slate-200"
              >
                <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Saved Sheets ({savedSheets.length})</span>
              </button>
            )}

            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className={`inline-flex items-center gap-1.5 px-3 py-2 font-medium text-xs rounded-lg transition-colors cursor-pointer border ${
                saveSuccess
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved to Cloud!</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentUser ? 'Save to Cloud' : 'Sync to Cloud'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Student Identifier</label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Observer / Title</label>
            <input
              type="text"
              value={observerName}
              placeholder="e.g. Paraprofessional / BCBA"
              onChange={e => setObserverName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Measurement Dimension</label>
            <select
              value={templateType}
              onChange={e => handleApplyPreset(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="latency">Visual Prompt Latency (Sec)</option>
              <option value="interval">10-Second Interval Recording</option>
              <option value="duration">Continuous Gaze Duration</option>
              <option value="frequency">Joint Attention Frequency</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Observation Setting</label>
            <input
              type="text"
              value={setting}
              onChange={e => setSetting(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block font-medium text-slate-700 mb-1 text-xs">
            Operational Definition (Must pass the Stranger Test):
          </label>
          <textarea
            rows={2}
            value={operationalDef}
            onChange={e => setOperationalDef(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs"
          />
        </div>
      </div>

      {/* Printable Sheet Preview */}
      <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-sm print:border-none print:shadow-none print:p-0 text-slate-900 font-sans">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold uppercase tracking-tight">
                Behavioral Data Collection Record: Visual Tracking
              </h1>
              <div className="text-xs text-slate-600">
                Tennessee State Board Compliant Single-Case Progress Monitoring
              </div>
            </div>
            <div className="text-right text-xs">
              <div><strong>Date:</strong> ____________________</div>
              <div><strong>Time:</strong> _____ : _____ to _____ : _____</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3 text-xs pt-2 border-t border-slate-200">
            <div><strong>Student:</strong> {studentName}</div>
            <div><strong>Observer:</strong> {observerName || '________________________'}</div>
            <div><strong>Setting:</strong> {setting}</div>
          </div>

          <div className="mt-2 text-xs bg-slate-50 p-2 rounded border border-slate-200 print:bg-white print:border-slate-400">
            <strong>Target Behavior Operational Definition:</strong> {operationalDef}
          </div>
        </div>

        {/* Dynamic Grid based on templateType */}
        {templateType === 'latency' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Transition Latency Trials (Time from Visual Cue Presentation to Physical Movement)
            </div>
            <table className="w-full text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-200 font-bold text-center">
                  <th className="border border-slate-900 p-2 w-16">Trial #</th>
                  <th className="border border-slate-900 p-2">Visual Prompt Presented</th>
                  <th className="border border-slate-900 p-2">Time Prompt Delivered</th>
                  <th className="border border-slate-900 p-2">Time Movement Initiated</th>
                  <th className="border border-slate-900 p-2 w-28">Latency (Seconds)</th>
                  <th className="border border-slate-900 p-2">Prompt Level / Notes</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="h-9 text-center">
                    <td className="border border-slate-900 p-1 font-mono font-bold">Trial {i + 1}</td>
                    <td className="border border-slate-900 p-1 text-slate-500">Visual Schedule Strip</td>
                    <td className="border border-slate-900 p-1"></td>
                    <td className="border border-slate-900 p-1"></td>
                    <td className="border border-slate-900 p-1 font-mono"></td>
                    <td className="border border-slate-900 p-1 text-left px-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {templateType === 'interval' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide">
              10-Second Whole Interval Recording Matrix (60 Intervals = 10 Minutes)
            </div>
            <p className="text-[11px] text-slate-600 print:text-black">
              Code: <strong>[ + ]</strong> = Visually engaged entire 10 seconds | <strong>[ - ]</strong> = Gaze diverted 1+ sec | <strong>[ 0 ]</strong> = Blocked / transition
            </p>
            <div className="grid grid-cols-6 gap-2 text-xs">
              {Array.from({ length: 60 }, (_, i) => (
                <div key={i} className="border border-slate-900 p-2 rounded text-center">
                  <div className="text-[9px] font-mono font-bold text-slate-500">#{i + 1} ({(i * 10)}s)</div>
                  <div className="h-6 flex items-center justify-center font-bold text-sm text-slate-300">
                    + / -
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {templateType === 'duration' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Continuous Visual Gaze Duration Log
            </div>
            <table className="w-full text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-200 font-bold text-center">
                  <th className="border border-slate-900 p-2 w-16">Episode</th>
                  <th className="border border-slate-900 p-2">Activity / Material</th>
                  <th className="border border-slate-900 p-2">Gaze Start Time</th>
                  <th className="border border-slate-900 p-2">Gaze Divert Time</th>
                  <th className="border border-slate-900 p-2 w-32">Total Duration</th>
                  <th className="border border-slate-900 p-2">Antecedent / Glare Note</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }, (_, i) => (
                  <tr key={i} className="h-10 text-center">
                    <td className="border border-slate-900 p-1 font-mono font-bold">#{i + 1}</td>
                    <td className="border border-slate-900 p-1"></td>
                    <td className="border border-slate-900 p-1"></td>
                    <td className="border border-slate-900 p-1"></td>
                    <td className="border border-slate-900 p-1 font-mono"></td>
                    <td className="border border-slate-900 p-1"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {templateType === 'frequency' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Triadic Joint Visual Attention Frequency Tally
            </div>
            <table className="w-full text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-200 font-bold text-center">
                  <th className="border border-slate-900 p-2 w-32">Time Block</th>
                  <th className="border border-slate-900 p-2">Tally Marks (3-Point Gaze Alternation)</th>
                  <th className="border border-slate-900 p-2 w-28">Total Count</th>
                  <th className="border border-slate-900 p-2 w-28">Calculated Rate</th>
                </tr>
              </thead>
              <tbody>
                {['0 - 5 min', '5 - 10 min', '10 - 15 min', '15 - 20 min'].map((time, i) => (
                  <tr key={i} className="h-12 text-center">
                    <td className="border border-slate-900 p-1 font-mono font-bold">{time}</td>
                    <td className="border border-slate-900 p-1"></td>
                    <td className="border border-slate-900 p-1 font-mono"></td>
                    <td className="border border-slate-900 p-1 font-mono">____ / min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Printable Footer / Signoff */}
        <div className="mt-8 pt-4 border-t border-slate-400 grid grid-cols-2 gap-8 text-xs">
          <div>
            <strong>Observer Signature:</strong> ____________________________________
          </div>
          <div>
            <strong>BCBA / Supervisor Review:</strong> ____________________________________
          </div>
        </div>
      </div>

      {/* Saved Sheets Modal Dialog */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FolderOpen className="w-4 h-4 text-indigo-600" />
                <span>My Saved Cloud Data Sheets ({savedSheets.length})</span>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {savedSheets.map(sheet => (
                <div
                  key={sheet.id}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold truncate">{sheet.studentName}</strong>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-1.5 py-0.5 rounded">
                        {sheet.measurementType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{sheet.targetBehavior}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Saved: {new Date(sheet.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadSheet(sheet)}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteSheet(sheet.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
