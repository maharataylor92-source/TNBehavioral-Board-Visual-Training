import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Heart
} from 'lucide-react';

export const UnforgettableFormulas: React.FC = () => {
  // Calculator Interactive States
  const [obsA, setObsA] = useState<number>(8);
  const [obsB, setObsB] = useState<number>(10);

  const [agreements, setAgreements] = useState<number>(8);
  const [disagreements, setDisagreements] = useState<number>(2);

  const [pndHighestBaseline, setPndHighestBaseline] = useState<number>(4);
  const [pndInterventionScores, setPndInterventionScores] = useState<string>('5, 6, 7, 6, 8, 9');

  const [rateCount, setRateCount] = useState<number>(12);
  const [rateMinutes, setRateMinutes] = useState<number>(6);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'mnemonics' | 'calculators' | 'drill'>('mnemonics');

  // Drill Quiz State
  const [drillAnswers, setDrillAnswers] = useState<Record<number, number>>({});
  const [drillRevealed, setDrillRevealed] = useState<Record<number, boolean>>({});

  // Calculate IOA Total Count
  const smaller = Math.min(obsA, obsB);
  const larger = Math.max(obsA, obsB);
  const totalCountIOA = larger > 0 ? Number(((smaller / larger) * 100).toFixed(1)) : 0;

  // Calculate Interval IOA
  const totalIntervals = agreements + disagreements;
  const intervalIOA = totalIntervals > 0 ? Number(((agreements / totalIntervals) * 100).toFixed(1)) : 0;

  // Calculate Rate & IRT
  const calculatedRate = rateMinutes > 0 ? Number((rateCount / rateMinutes).toFixed(2)) : 0;
  const calculatedIRTSeconds = rateCount > 0 ? Number(((rateMinutes * 60) / rateCount).toFixed(1)) : 0;

  // Calculate PND
  const parsedIntervention = pndInterventionScores
    .split(',')
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n));
  const pointsAboveRoof = parsedIntervention.filter(val => val > pndHighestBaseline).length;
  const calculatedPND = parsedIntervention.length > 0
    ? Number(((pointsAboveRoof / parsedIntervention.length) * 100).toFixed(1))
    : 0;

  // Quick Drill Questions
  const drillQuestions = [
    {
      q: 'Which interval method OVERESTIMATES behavior, and which one UNDERESTIMATES it?',
      options: [
        'Partial overestimates; Whole underestimates (POW - U)',
        'Whole overestimates; Partial underestimates',
        'Momentary Time Sampling always overestimates',
        'Both estimate behavior identically'
      ],
      correct: 0,
      memoryHook: 'Remember "POW - U"! Partial Overestimates; Whole Underestimates.'
    },
    {
      q: 'When calculating Total Count IOA, which number goes on TOP in the fraction?',
      options: [
        'The larger count',
        'The smaller count (Pyramid rule: small tip on top)',
        'The average of the two counts',
        'Observer A must always be on top'
      ],
      correct: 1,
      memoryHook: 'Think of the Egyptian Pyramid: Small number on top, big base on bottom! (Smaller ÷ Larger × 100).'
    },
    {
      q: 'If 4 consecutive data points fall BELOW the aim line during progress monitoring, what is the mandatory decision?',
      options: [
        'Wait 6 months for the next formal IEP evaluation',
        '4 below, time to go! Modify or revise the intervention immediately',
        'Discharge the student from services',
        'Connect the baseline and intervention points with a line'
      ],
      correct: 1,
      memoryHook: '"4 below, time to go! Change the plan, don\'t let it stand!" Never wait for failure.'
    },
    {
      q: 'What is the mathematical relationship between Rate and Inter-Response Time (IRT)?',
      options: [
        'They are identical',
        'They are inversely related: As Rate goes UP, IRT goes DOWN (The Seesaw)',
        'As Rate goes up, IRT goes up',
        'IRT only applies to discontinuous intervals'
      ],
      correct: 1,
      memoryHook: 'The Seesaw! Rapid fire (high rate) = tiny pauses between responses (low IRT).'
    },
    {
      q: 'What does a completely FLAT horizontal line mean on a Cumulative Record?',
      options: [
        'Steady, high rate of responding',
        'Negative or regressive responding',
        'ZERO responding (behavior stopped or paused; like a flatline)',
        'The student has reached mastery criterion'
      ],
      correct: 2,
      memoryHook: 'Flatline = No pulse, no responses! A cumulative record never slopes down.'
    },
    {
      q: 'Which axis is the "Abscissa", and which is the "Ordinate"?',
      options: [
        'Abscissa is Y (vertical); Ordinate is X (horizontal)',
        'Abscissa is X (horizontal / time); Ordinate is Y (vertical / behavior)',
        'Both refer to the phase change line',
        'Abscissa is only used on logarithmic charts'
      ],
      correct: 1,
      memoryHook: 'Ab-SCISS-a lies flat like scissors on a table (X). Ordinate reaches Overhead to the sky (Y)!'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Encouragement & Empathy Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
          <Brain className="w-4 h-4 text-amber-300" />
          <span>Panic-Proof Board Prep</span>
          <span aria-hidden="true">·</span>
          <span>Never Forget These Again</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Unforgettable Formulas & Visual Memory Pegs
        </h1>

        <p className="text-xs md:text-sm text-indigo-100 max-w-2xl leading-relaxed">
          State Board tests are designed to provoke anxiety with tricky wording. These 7 visual memory hooks and interactive step-by-step calculators make the formulas stick in your mind so you can recall them instantly without second-guessing yourself!
        </p>

        {/* Motivational pill */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 text-xs text-amber-200 font-medium mt-2">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>You already do the hard work with neurodivergent kids every day. You CAN master these 7 formulas!</span>
        </div>
      </div>

      {/* Segmented Sub-Nav */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('mnemonics')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'mnemonics'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          7 Unforgettable Memory Pegs
        </button>

        <button
          onClick={() => setActiveSubTab('calculators')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'calculators'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Interactive Step-by-Step Calculators
        </button>

        <button
          onClick={() => setActiveSubTab('drill')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'drill'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Confidence Builder Quiz
        </button>
      </div>

      {/* VIEW 1: THE 7 UNFORGETTABLE MNEMONICS */}
      {activeSubTab === 'mnemonics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mnemonic 1: POW - U */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #1 · The #1 Tested Trap
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-extrabold font-mono">
                P.O.W. - U
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Partial Overestimates · Whole Underestimates
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Mental Picture:</strong>
                Imagine eating pizza! To get a <strong>Whole</strong> interval, you must chew continuously for the entire 10 seconds without stopping. If you pause for 1 second, you get ZERO credit. That is why Whole <strong>UNDERESTIMATES</strong> how much the student worked.
                <br /><br />
                A <strong>Partial</strong> interval gives you 100% credit if you take even 1 tiny half-second nibble! That is why Partial <strong>OVERESTIMATES</strong> behavior.
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              <strong className="text-slate-900 block mb-1">Board Test Trigger:</strong>
              <div className="text-slate-600 bg-indigo-50/60 p-2 rounded border border-indigo-100">
                • Behavior to <strong>INCREASE</strong> (sustained visual focus) ➔ Pick <strong>Whole Interval</strong> (won't falsely show mastery).<br />
                • Behavior to <strong>DECREASE</strong> (visual stimming, gaze wander) ➔ Pick <strong>Partial Interval</strong> (catches every tiny offense).
              </div>
            </div>
          </div>

          {/* Mnemonic 2: PYRAMID IOA */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #2 · Agreement Math
              </span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-xs font-extrabold font-mono">
                THE PYRAMID
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Total Count IOA = (Smaller ÷ Larger) × 100%
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Mental Picture:</strong>
                Picture the great Pyramids in Egypt:
                The <strong>SMALL point</strong> is at the top. The <strong>BIG wide base</strong> is at the bottom.
                Always put the <strong>smaller number on top</strong> of the fraction!
              </div>
              <div className="font-mono bg-white p-2 rounded border border-slate-200 text-center font-bold text-slate-800">
                Smaller Count / Larger Count × 100%
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              <strong className="text-slate-900 block mb-1">Check Your Math:</strong>
              <p className="text-slate-600">
                If Observer A counted 8 and Observer B counted 10: <br />
                Put 8 over 10: <strong>(8 ÷ 10) × 100% = 80% IOA</strong>.<br />
                <em>(If you accidentally put the big number on top, you'd get 125%, and agreement can never exceed 100%!).</em>
              </p>
            </div>
          </div>

          {/* Mnemonic 3: 4 BELOW, TIME TO GO */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #3 · Progress Monitoring Rule
              </span>
              <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-md text-xs font-extrabold font-mono">
                4 BELOW? TIME TO GO!
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              The 4-Point Decision Rule
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Rhyme to Say in Your Head:</strong>
                <span className="text-rose-700 font-bold block text-sm">
                  "4 below, time to go! Change the plan, don't let it stand!"
                </span>
                <span className="text-emerald-700 font-bold block text-sm mt-1">
                  "4 above, show some love! Raise the bar, fade the glove!"
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              <strong>The State Board Question:</strong> They will give a graph with 4 consecutive sessions below the aim line and ask: <em>"What should the clinician do?"</em><br />
              <strong>Answer:</strong> Revise / modify the intervention immediately. Check prompt hierarchy or visual glare. Do NOT wait for annual IEP meeting!
            </div>
          </div>

          {/* Mnemonic 4: SCISSORS LIE FLAT */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #4 · Graph Anatomy
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-xs font-extrabold font-mono">
                SCISSORS LIE FLAT
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Abscissa (X-Axis) vs. Ordinate (Y-Axis)
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Mental Picture:</strong>
                • <strong>Ab-SCISS-a:</strong> Sounds like <em>scissors</em>! Scissors lie down flat horizontally on your desk. So Abscissa = <strong>X-axis (Horizontal / Time / Sessions)</strong>.<br /><br />
                • <strong>Ordinate:</strong> Sounds like <em>Overhead</em> or reaching up to Ordain! Ordinate = <strong>Y-axis (Vertical / Behavioral Dimension / Rate / %)</strong>.
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <strong>Board Rule:</strong> The Y-axis should be 2/3 to 3/4 the length of the X-axis (3:4 aspect ratio) to prevent optical slope distortion.
            </div>
          </div>

          {/* Mnemonic 5: THE SEESAW */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #5 · Rate & IRT
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-extrabold font-mono">
                THE SEESAW
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              As Rate Goes UP ⬆, IRT Goes DOWN ⬇
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Mental Picture:</strong>
                Imagine clapping rapidly! If you clap 10 times in 5 seconds (high rate), the pause between each clap (Inter-Response Time) is tiny! If you clap once every 2 minutes (low rate), the pause is huge!
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <strong>Board Formula:</strong> Rate = Count ÷ Time. (If Maya completes 15 visual gaze targets in 5 minutes, her Rate = 3.0 targets/minute).
            </div>
          </div>

          {/* Mnemonic 6: FLATLINE MEANS NO PULSE */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #6 · Cumulative Record
              </span>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-md text-xs font-extrabold font-mono">
                FLATLINE = ZERO
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Cumulative Record: Flat Line = ZERO Responding
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Mental Picture:</strong>
                A hospital heart monitor: When someone flatlines, there is zero heartbeat. On a cumulative record, a flat horizontal line means <strong>ZERO responses</strong> were made!
                <br /><br />
                <strong>Can it ever slope down?</strong> NEVER! Responses can never un-occur.
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              • <strong>Steep slope:</strong> Fast responses (High Rate).<br />
              • <strong>Shallow slope:</strong> Slow responses (Low Rate).<br />
              • <strong>Horizontal line:</strong> Pausing / Extinction (Zero Rate).
            </div>
          </div>

          {/* Mnemonic 7: PND ROOF */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xs p-6 space-y-4 md:col-span-2 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Mnemonic #7 · Effect Size
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-xs font-extrabold font-mono">
                JUMP OVER THE ROOF
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              PND: Percentage of Non-Overlapping Data
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-800">
                <strong className="text-indigo-900 block font-semibold mb-0.5">The Mental Picture:</strong>
                Look at the Baseline phase. Find the <strong>highest baseline number</strong> (for a behavior we want to grow). That number is the <em>ROOF</em>!
                Now look at the Intervention phase: Count how many points jumped <strong>strictly ABOVE that roof</strong>.
                Divide that count by the total number of intervention points × 100%!
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2 bg-emerald-100 text-emerald-900 font-bold rounded">&gt; 90% : Highly Effective</div>
                <div className="p-2 bg-blue-100 text-blue-900 font-bold rounded">70% - 90% : Moderate</div>
                <div className="p-2 bg-amber-100 text-amber-900 font-bold rounded">50% - 70% : Questionable</div>
                <div className="p-2 bg-rose-100 text-rose-900 font-bold rounded">&lt; 50% : Ineffective</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STEP-BY-STEP INTERACTIVE CALCULATORS */}
      {activeSubTab === 'calculators' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Live Formula Calculators & Arithmetic Explanations
              </h2>
              <p className="text-xs text-slate-600">
                Type in any numbers from your practice questions to see the exact step-by-step arithmetic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Count IOA Calculator */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">1. Total Count IOA</h3>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    (Smaller ÷ Larger) × 100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Observer A Count:</label>
                    <input
                      type="number"
                      value={obsA}
                      onChange={e => setObsA(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Observer B Count:</label>
                    <input
                      type="number"
                      value={obsB}
                      onChange={e => setObsB(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <div className="text-slate-500">Step 1: Identify smaller ({smaller}) and larger ({larger})</div>
                  <div className="text-slate-500">Step 2: Fraction = {smaller} ÷ {larger} = {(smaller / (larger || 1)).toFixed(3)}</div>
                  <div className="text-indigo-900 font-bold text-sm pt-1 border-t border-slate-100">
                    Result: {totalCountIOA}% IOA
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  {totalCountIOA >= 80 ? (
                    <span className="text-emerald-700 font-semibold">✓ Meets Tennessee Board standard (&gt;= 80%)</span>
                  ) : (
                    <span className="text-rose-700 font-semibold">✗ Below 80% threshold (Retraining needed)</span>
                  )}
                </div>
              </div>

              {/* Interval IOA Calculator */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">2. Interval-by-Interval IOA</h3>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Agreements ÷ Total
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Agreed Intervals:</label>
                    <input
                      type="number"
                      value={agreements}
                      onChange={e => setAgreements(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Disagreed Intervals:</label>
                    <input
                      type="number"
                      value={disagreements}
                      onChange={e => setDisagreements(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <div className="text-slate-500">Step 1: Total Intervals = {agreements} + {disagreements} = {totalIntervals}</div>
                  <div className="text-slate-500">Step 2: Fraction = {agreements} ÷ {totalIntervals}</div>
                  <div className="text-indigo-900 font-bold text-sm pt-1 border-t border-slate-100">
                    Result: {intervalIOA}% IOA
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  {intervalIOA >= 80 ? (
                    <span className="text-emerald-700 font-semibold">✓ Meets Tennessee Board standard (&gt;= 80%)</span>
                  ) : (
                    <span className="text-rose-700 font-semibold">✗ Below 80% threshold (Low reliability)</span>
                  )}
                </div>
              </div>

              {/* Rate & IRT Calculator */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">3. Rate & Average IRT</h3>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Rate = Count ÷ Time
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Target Count:</label>
                    <input
                      type="number"
                      value={rateCount}
                      onChange={e => setRateCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Observation (Minutes):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rateMinutes}
                      onChange={e => setRateMinutes(Math.max(0.1, parseFloat(e.target.value) || 1))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <div className="text-slate-500">Rate = {rateCount} responses ÷ {rateMinutes} min</div>
                  <div className="text-indigo-900 font-bold text-sm">Rate: {calculatedRate} responses / minute</div>
                  <div className="text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                    Average IRT (pause between responses): <strong>{calculatedIRTSeconds} seconds</strong>
                  </div>
                </div>
              </div>

              {/* PND Calculator */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">4. PND (Percentage Non-Overlap)</h3>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Over-the-Roof Rule
                  </span>
                </div>

                <div className="text-xs space-y-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Highest Baseline Score (The Roof):</label>
                    <input
                      type="number"
                      value={pndHighestBaseline}
                      onChange={e => setPndHighestBaseline(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Intervention Session Scores (comma-separated):</label>
                    <input
                      type="text"
                      value={pndInterventionScores}
                      onChange={e => setPndInterventionScores(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <div className="text-slate-500">Points &gt; {pndHighestBaseline}: {pointsAboveRoof} out of {parsedIntervention.length} points</div>
                  <div className="text-indigo-900 font-bold text-sm">PND: {calculatedPND}%</div>
                  <div className="text-[11px] text-emerald-700 font-sans font-semibold pt-1">
                    {calculatedPND >= 90 ? '★ Highly Effective Intervention' : calculatedPND >= 70 ? 'Moderately Effective' : 'Questionable / Low Effect'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CONFIDENCE BUILDER QUICK DRILL */}
      {activeSubTab === 'drill' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Formula Confidence Drill (Instant Feedback)
            </h2>
            <p className="text-xs text-slate-600">
              Tap each question to lock in your memory hooks. If you make a mistake, read the memory hook and try again!
            </p>
          </div>

          <div className="space-y-4">
            {drillQuestions.map((dq, qIdx) => {
              const selectedOpt = drillAnswers[qIdx];
              const isRevealed = drillRevealed[qIdx];
              const isCorrect = selectedOpt === dq.correct;

              return (
                <div key={qIdx} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-sm text-slate-900">
                    {qIdx + 1}. {dq.q}
                  </div>

                  <div className="space-y-2">
                    {dq.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (isRevealed) {
                        if (optIdx === dq.correct) {
                          btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
                        } else if (isThisSelected) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                        } else {
                          btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setDrillAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                            setDrillRevealed(prev => ({ ...prev, [qIdx]: true }));
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isRevealed && optIdx === dq.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isRevealed && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-950 text-xs">
                      <strong className="block mb-0.5 text-indigo-900 flex items-center gap-1 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Memory Hook:
                      </strong>
                      {dq.memoryHook}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
