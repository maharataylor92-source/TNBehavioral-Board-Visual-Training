import { StudentCase } from '../types';

export const STUDENT_CASES: StudentCase[] = [
  {
    id: 'liam-visual-latency',
    studentName: 'Liam (Grade 2)',
    age: '7 years old',
    diagnosis: 'Autism Spectrum Condition (Sensory Processing sensitivities)',
    targetBehavior: 'Transition Latency following Visual Schedule Prompt',
    behaviorType: 'decrease',
    dimension: 'Latency',
    unit: 'seconds',
    yAxisLabel: 'Latency to Initiate Transition (Seconds)',
    targetGoal: 15,
    aimLineTargetSession: 14,
    clinicalContext: 'During academic center rotations, Liam exhibited significant delay initiating transitions. Baseline recorded time in seconds from staff presenting his personal visual icon strip until Liam stood and oriented toward the target station.',
    neurodivergentConsiderations: 'Neurodivergent students often require processing time for visual-to-motor planning. Rather than verbal prompting (which increases auditory overload), intervention introduced high-contrast symbol cards with an amber countdown visual timer.',
    phaseChanges: [
      { sessionBefore: 5, type: 'solid', label: 'Intervention: High-Contrast Visual Strip + Sand Timer' },
      { sessionBefore: 10, type: 'dashed', label: 'Prompt Fading: Independent Visual Check' }
    ],
    initialData: [
      { id: 'l1', session: 1, value: 85, phase: 'Baseline', notes: 'Needed repeated verbal prompts' },
      { id: 'l2', session: 2, value: 92, phase: 'Baseline', notes: 'Auditory distraction in room' },
      { id: 'l3', session: 3, value: 78, phase: 'Baseline', notes: 'Paced near sensory corner' },
      { id: 'l4', session: 4, value: 88, phase: 'Baseline', notes: 'Engaged with tactile fidget' },
      { id: 'l5', session: 5, value: 82, phase: 'Baseline', notes: 'Baseline stable (Level ~85s)' },
      // Intervention Phase
      { id: 'l6', session: 6, value: 45, phase: 'Intervention', notes: 'Immediate drop in latency' },
      { id: 'l7', session: 7, value: 38, phase: 'Intervention', notes: 'Pointed to symbol card first' },
      { id: 'l8', session: 8, value: 32, phase: 'Intervention', notes: 'Checked sand timer visually' },
      { id: 'l9', session: 9, value: 26, phase: 'Intervention', notes: 'Smooth transition' },
      { id: 'l10', session: 10, value: 24, phase: 'Intervention', notes: 'Consistently under 30s' },
      // Fading Phase
      { id: 'l11', session: 11, value: 18, phase: 'Fading', notes: 'Self-initiated visual check' },
      { id: 'l12', session: 12, value: 16, phase: 'Fading', notes: 'Smooth center switch' },
      { id: 'l13', session: 13, value: 14, phase: 'Fading', notes: 'Met target goal (<15s)' },
      { id: 'l14', session: 14, value: 12, phase: 'Fading', notes: 'Met target criterion' },
    ]
  },
  {
    id: 'maya-visual-engagement',
    studentName: 'Maya (Grade 4)',
    age: '9 years old',
    diagnosis: 'ADHD (Combined Type) & Visual Processing Delays',
    targetBehavior: 'Sustained Visual Fixation on Instructional Worksheet',
    behaviorType: 'increase',
    dimension: 'Duration',
    unit: 'minutes',
    yAxisLabel: 'Continuous Visual Engagement (Minutes)',
    targetGoal: 12,
    aimLineTargetSession: 15,
    clinicalContext: 'Maya frequently shifted gaze away from academic reading tasks every 45-60 seconds. Measurement tracked total unbroken duration of visual gaze directed toward instructional materials before a 5+ second gaze aversion.',
    neurodivergentConsiderations: 'Fluorescent glare and busy page layouts provoked visual fatigue. Intervention utilized a colored reading tracking overlay (Typoscope window) and a silent vibrating visual cue prompt every 3 minutes.',
    phaseChanges: [
      { sessionBefore: 5, type: 'solid', label: 'Intervention: Typoscope Window + Vibrating Cue' }
    ],
    initialData: [
      { id: 'm1', session: 1, value: 2.5, phase: 'Baseline', notes: 'Frequent scanning of windows' },
      { id: 'm2', session: 2, value: 3.0, phase: 'Baseline', notes: 'Shifted gaze to classroom door' },
      { id: 'm3', session: 3, value: 2.0, phase: 'Baseline', notes: 'Visual fatigue observed' },
      { id: 'm4', session: 4, value: 2.8, phase: 'Baseline', notes: 'Brief tracking on line 2' },
      { id: 'm5', session: 5, value: 3.2, phase: 'Baseline', notes: 'Baseline stable at ~2.7 min' },
      // Intervention
      { id: 'm6', session: 6, value: 6.5, phase: 'Intervention', notes: 'Immediate upward level shift' },
      { id: 'm7', session: 7, value: 7.2, phase: 'Intervention', notes: 'Followed green overlay border' },
      { id: 'm8', session: 8, value: 8.0, phase: 'Intervention', notes: 'Finished paragraph 1' },
      { id: 'm9', session: 9, value: 9.5, phase: 'Intervention', notes: 'Tracking steady across lines' },
      { id: 'm10', session: 10, value: 9.0, phase: 'Intervention', notes: 'Consistent engagement' },
      { id: 'm11', session: 11, value: 10.5, phase: 'Intervention', notes: 'Vibrating cue prompted re-focus' },
      { id: 'm12', session: 12, value: 11.2, phase: 'Intervention', notes: 'Minimal gaze deviation' },
      { id: 'm13', session: 13, value: 12.0, phase: 'Intervention', notes: 'Met IEP benchmark' }
    ]
  },
  {
    id: 'jordan-aac-tracking',
    studentName: 'Jordan (Middle School)',
    age: '12 years old',
    diagnosis: 'Autism (Non-speaking) & Cortical Visual Processing',
    targetBehavior: 'Independent Visual Scanning & Target Icon Fixation',
    behaviorType: 'increase',
    dimension: 'Percent Intervals',
    unit: '%',
    yAxisLabel: '% Accurate Visual Fixations (>2 sec)',
    targetGoal: 85,
    aimLineTargetSession: 14,
    clinicalContext: 'During communicative opportunities with a high-tech speech-generating device (SGD), Jordan demonstrated fleeting eye contact with the 24-icon array. Data reflects percentage of discrete trials where Jordan visually fixed on the target communication symbol for >=2 seconds prior to selection.',
    neurodivergentConsiderations: 'Complex visual grids cause visual crowding. Intervention reduced array to 8 high-contrast symbols on black background with yellow border highlighting (CVI visual accommodations).',
    phaseChanges: [
      { sessionBefore: 6, type: 'solid', label: 'Intervention: High-Contrast Border + Reduced Grid' }
    ],
    initialData: [
      { id: 'j1', session: 1, value: 20, phase: 'Baseline', notes: 'Random tapping without scanning' },
      { id: 'j2', session: 2, value: 25, phase: 'Baseline', notes: 'Fleeting glance, incorrect tap' },
      { id: 'j3', session: 3, value: 18, phase: 'Baseline', notes: 'Looked away from screen' },
      { id: 'j4', session: 4, value: 22, phase: 'Baseline', notes: 'Visual search abandoned' },
      { id: 'j5', session: 5, value: 25, phase: 'Baseline', notes: 'Low stable baseline' },
      { id: 'j6', session: 6, value: 20, phase: 'Baseline', notes: 'Baseline verified' },
      // Intervention
      { id: 'j7', session: 7, value: 50, phase: 'Intervention', notes: 'Clear gaze fixation on yellow icon' },
      { id: 'j8', session: 8, value: 58, phase: 'Intervention', notes: 'Accurate saccade across row 1' },
      { id: 'j9', session: 9, value: 65, phase: 'Intervention', notes: '2-second dwell confirmed' },
      { id: 'j10', session: 10, value: 72, phase: 'Intervention', notes: 'Strong ascending trend' },
      { id: 'j11', session: 11, value: 78, phase: 'Intervention', notes: 'Smooth visual pursuit' },
      { id: 'j12', session: 12, value: 82, phase: 'Intervention', notes: 'Consistent tracking' },
      { id: 'j13', session: 13, value: 88, phase: 'Intervention', notes: 'Exceeded 85% goal criterion' }
    ]
  },
  {
    id: 'ethan-four-point-alert',
    studentName: 'Ethan (Kindergarten Case - 4-Point Rule Alert)',
    age: '6 years old',
    diagnosis: 'Autism & Attention Disruption',
    targetBehavior: 'Visual Joint Attention during Shared Storybook Reading',
    behaviorType: 'increase',
    dimension: 'Rate/Frequency',
    unit: 'episodes/10 min',
    yAxisLabel: 'Joint Attention Gaze Shifts / 10 min',
    targetGoal: 10,
    aimLineTargetSession: 14,
    clinicalContext: 'Ethan rarely alternated visual gaze between teacher and picture book illustrations. Aim line established from baseline median (2 episodes) to IEP target (10 episodes). During intervention, 4 consecutive data points fell below the aim line, triggering the Tennessee progress monitoring decision rule!',
    neurodivergentConsiderations: 'Demonstrates a clinical scenario where the intervention (verbal prompts + stickers) was ineffective because verbal cues caused prompt dependency. Under TN guidelines, clinicians must modify the intervention when 4 consecutive points fall below the aim line.',
    phaseChanges: [
      { sessionBefore: 4, type: 'solid', label: 'Intervention: Verbal Praise + Token Board' },
      { sessionBefore: 9, type: 'solid', label: 'Intervention Revision: Tactile Pop-Up + Visual Cue' }
    ],
    initialData: [
      { id: 'e1', session: 1, value: 2, phase: 'Baseline', notes: 'Gazed at ceiling fan' },
      { id: 'e2', session: 2, value: 1, phase: 'Baseline', notes: 'Turned away from reader' },
      { id: 'e3', session: 3, value: 3, phase: 'Baseline', notes: 'Brief glance at cover' },
      { id: 'e4', session: 4, value: 2, phase: 'Baseline', notes: 'Baseline median = 2' },
      // Ineffective Intervention (4 points below aimline)
      { id: 'e5', session: 5, value: 3, phase: 'Intervention', notes: 'Below aim line' },
      { id: 'e6', session: 6, value: 3, phase: 'Intervention', notes: 'Below aim line (Point 2)' },
      { id: 'e7', session: 7, value: 2, phase: 'Intervention', notes: 'Below aim line (Point 3)' },
      { id: 'e8', session: 8, value: 3, phase: 'Intervention', notes: 'Below aim line (Point 4 -> RULE TRIGGERED!)' },
      // Intervention Revision
      { id: 'e9', session: 9, value: 6, phase: 'Intervention', notes: 'Tactile pop-up captured gaze' },
      { id: 'e10', session: 10, value: 7, phase: 'Intervention', notes: 'Looked at book then reader' },
      { id: 'e11', session: 11, value: 9, phase: 'Intervention', notes: 'Ascending trend above aim line' },
      { id: 'e12', session: 12, value: 10, phase: 'Intervention', notes: 'Met target goal' }
    ]
  }
];
