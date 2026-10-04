import { Flashcard } from '../types';

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    category: 'Discontinuous Measurement',
    question: 'Whole Interval Recording (WIR): What is it and what is its primary measurement artifact?',
    answer: 'The observer records "+" ONLY if the target behavior occurs for the ENTIRE duration of the interval. Primary artifact: Systematically UNDERESTIMATES duration and rate.',
    boardTip: 'Exam favorite! Used for behaviors you want to INCREASE (e.g., continuous visual engagement on task).',
    clinicalExample: 'In a 10s interval, if Maya looks at her worksheet for 9 seconds but looks away for 1 second, the interval is scored as a non-occurrence (-).'
  },
  {
    id: 'f2',
    category: 'Discontinuous Measurement',
    question: 'Partial Interval Recording (PIR): What is it and what is its primary measurement artifact?',
    answer: 'The observer records "+" if the target behavior occurs at ANY point during the interval, even for a fraction of a second. Primary artifact: Systematically OVERESTIMATES duration and frequency.',
    boardTip: 'Used for behaviors you want to DECREASE (e.g., off-task visual scanning, visual stimming, aggression).',
    clinicalExample: 'If Ethan visually disengages and looks at the ceiling fan for 0.5 seconds during a 10s interval, the entire interval is scored as an occurrence (+).'
  },
  {
    id: 'f3',
    category: 'Discontinuous Measurement',
    question: 'Momentary Time Sampling (MTS): How does it work and why is it preferred in busy classrooms?',
    answer: 'The observer checks and records "+" ONLY if the behavior is occurring at the EXACT split-second the interval ends. Does not systematically over- or under-estimate duration.',
    boardTip: 'Teacher/clinician does NOT have to watch the student continuously, freeing them to teach during the interval.',
    clinicalExample: 'A vibrating cue buzzes every 2 minutes. The teacher looks up: if Jordan is gazing at his AAC device at that exact second, it is scored (+); otherwise (-).'
  },
  {
    id: 'f4',
    category: 'Continuous Measurement',
    question: 'Response Latency vs. Duration: What is the defining difference?',
    answer: 'Latency is the elapsed time from antecedent stimulus presentation to response onset. Duration is the elapsed time from response onset to response termination.',
    boardTip: 'Latency = delay BEFORE behavior begins; Duration = length of the behavior itself.',
    clinicalExample: 'Latency: 12 seconds from teacher showing the visual schedule card until Liam starts walking. Duration: 45 seconds spent walking to the station.'
  },
  {
    id: 'f5',
    category: 'Continuous Measurement',
    question: 'Inter-Response Time (IRT): How is it calculated and how does it relate to Rate?',
    answer: 'IRT is the time elapsed between the termination of one response and the onset of the next response. IRT is inversely proportional to Rate: as Rate increases, IRT decreases.',
    boardTip: 'If student is responding faster and faster, IRT is shrinking.',
    clinicalExample: 'Maya pauses 4 seconds between completing visual line 1 and looking down at line 2. IRT = 4 seconds.'
  },
  {
    id: 'f6',
    category: 'Graph Anatomy & Rules',
    question: 'What is the rule regarding connecting data points across condition change lines?',
    answer: 'NEVER connect data points across condition change lines (phases)!',
    boardTip: 'Connecting across lines falsely implies a continuous functional relationship spanning two distinct environmental conditions.',
    clinicalExample: 'Leave a clean visual break between the final Baseline data point and the first Visual Cue Intervention point.'
  },
  {
    id: 'f7',
    category: 'Graph Anatomy & Rules',
    question: 'What is the difference between a SOLID and DASHED phase change line?',
    answer: 'A SOLID line indicates a MAJOR change in the independent variable (e.g., Baseline to DRA). A DASHED line indicates a MINOR modification (e.g., fading prompt delay, changing cue size).',
    boardTip: 'Solid = Brand new intervention; Dashed = Fine-tuning parameter of the existing intervention.',
    clinicalExample: 'Solid line when introducing the high-contrast visual schedule; dashed line when fading teacher gestural prompt.'
  },
  {
    id: 'f8',
    category: 'Progress Monitoring',
    question: 'The 4-Point Decision Rule: What action is triggered when 4 consecutive points fall below the aim line?',
    answer: 'Modify or revise the intervention immediately! Check treatment integrity, prompt hierarchy, and sensory environment.',
    boardTip: 'Do NOT wait for the annual IEP meeting or next quarter review. 4 consecutive sub-aim points indicates the intervention is failing.',
    clinicalExample: 'Ethan’s joint attention points fall below the aim line for 4 straight sessions; the team adds tactile pop-up icons to boost salience.'
  },
  {
    id: 'f9',
    category: 'Progress Monitoring',
    question: 'What is an Aim Line (Goal Line) and how is it constructed?',
    answer: 'A straight trajectory line drawn from the baseline median value to the target IEP/behavioral goal criterion at the target session date.',
    boardTip: 'Serves as the expected rate of learning against which weekly progress is visually evaluated.',
    clinicalExample: 'Liam’s baseline median latency was 85s; target goal is 15s at Session 14. The Aim Line slopes downward from (Session 5, 85s) to (Session 14, 15s).'
  },
  {
    id: 'f10',
    category: 'Visual Analysis',
    question: 'How is Percentage of Non-Overlapping Data (PND) calculated for a behavior targeted to increase?',
    answer: 'PND = (Number of Intervention points exceeding the HIGHEST Baseline point ÷ Total Intervention points) × 100%.',
    boardTip: '> 90% = Highly effective; 70-90% = Moderately effective; 50-70% = Questionable; < 50% = Ineffective.',
    clinicalExample: 'If highest baseline gaze was 4 min, and 9 out of 10 intervention points are > 4 min, PND = (9/10) * 100% = 90%.'
  },
  {
    id: 'f11',
    category: 'Visual Analysis',
    question: 'What are the three core properties assessed during visual inspection of a graph?',
    answer: 'Level (mean/median position), Trend (direction/slope: ascending, descending, zero), and Variability (bounce/stability envelope).',
    boardTip: 'Remember the acronym LTV (Level, Trend, Variability). Always check baseline stability before intervention.',
    clinicalExample: 'Baseline had high variability (bounce from 2m to 20m); intervention showed immediate upward level shift and stable ascending trend.'
  },
  {
    id: 'f12',
    category: 'Cumulative Records',
    question: 'What does a completely flat horizontal line indicate on a cumulative record?',
    answer: 'ZERO responding. No responses occurred during that time interval.',
    boardTip: 'Cumulative records never slope downward! Steep = High rate, Shallow = Low rate, Flat = Pausing / Extinction.',
    clinicalExample: 'During a 15-minute independent work period, the cumulative pen did not step upward, revealing the student was completely off-task.'
  },
  {
    id: 'f13',
    category: 'Visual Tracking Metrics',
    question: 'What is Triadic Gaze Alternation in Joint Visual Attention?',
    answer: 'A 3-point visual shift where the learner alternates gaze between: (1) an object of interest, (2) a communication partner, and (3) back to the object.',
    boardTip: 'Crucial diagnostic and intervention milestone in early autism developmental profiles.',
    clinicalExample: 'Jordan looks at a wind-up toy, looks up at the therapist’s eyes with a smile, then looks back at the toy to request activation.'
  },
  {
    id: 'f14',
    category: 'Visual Tracking Metrics',
    question: 'What are Cortical Visual Impairment (CVI) environmental accommodations?',
    answer: 'High figure-ground contrast (e.g., yellow/red icons on black background), reduced visual clutter/complexity, increased lighting on targets, and allowing extra visual latency.',
    boardTip: 'Neurodivergent students with CVI or visual crowding require uncluttered arrays to demonstrate intentional visual gaze.',
    clinicalExample: 'Reducing an AAC communication screen from 32 crowded icons to 8 high-contrast bordered symbols increased fixation accuracy to 88%.'
  },
  {
    id: 'f15',
    category: 'TN Board Rules',
    question: 'What is the required standard for Inter-Observer Agreement (IOA) collection under TN Board guidelines?',
    answer: 'IOA must be collected for a minimum of 20% to 33% of sessions across all experimental phases, targeting an agreement coefficient of at least 80%.',
    boardTip: 'Board exams frequently ask for both the frequency (20-33%) and threshold (>= 80%).',
    clinicalExample: 'A second observer attends 3 out of 10 school sessions and achieves 88% interval-by-interval agreement with the primary therapist.'
  }
];
