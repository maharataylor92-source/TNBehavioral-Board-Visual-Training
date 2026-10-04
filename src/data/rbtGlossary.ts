export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  phonetic?: string;
  category: 'Continuous Measurement' | 'Discontinuous Measurement' | 'Graphing & Visual Analysis' | 'Assessment & Reliability' | 'Clinical Visual Tracking';
  simpleDefinition: string;
  rbtExamFocus: string;
  clinicalExample: string;
  memoryHook: string;
}

export const RBT_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'ioa',
    term: 'Inter-Observer Agreement',
    acronym: 'IOA',
    phonetic: 'I-O-A',
    category: 'Assessment & Reliability',
    simpleDefinition: 'A mathematical check comparing data taken by two independent observers watching the same student at the same time to see how closely their numbers match.',
    rbtExamFocus: 'TN Board & BACB Standard: Must be collected for 20% to 33% of sessions, and the agreement must be AT LEAST 80%. Protects against observer drift and biased data.',
    clinicalExample: 'An RBT and her supervising BCBA both time Maya’s visual gaze during reading. The RBT records 8 minutes and the BCBA records 10 minutes. Total Count IOA = (8 ÷ 10) × 100% = 80%.',
    memoryHook: 'The Egyptian Pyramid! Small count on top, big count on bottom (Smaller ÷ Larger × 100).'
  },
  {
    id: 'latency',
    term: 'Latency (Response Latency)',
    acronym: 'Latency',
    phonetic: 'LAY-ten-see',
    category: 'Continuous Measurement',
    simpleDefinition: 'The elapsed time between when an instruction or prompt is given and when the student actually BEGINS the behavior.',
    rbtExamFocus: 'Common Board Trap: Latency measures the delay BEFORE the behavior starts. It does NOT measure how long the behavior lasts (that is duration)!',
    clinicalExample: 'The RBT points to Liam’s visual schedule strip and says "Check schedule." Liam stands up and looks at the card 8 seconds later. Latency = 8 seconds.',
    memoryHook: 'Think "Late"! How LATE did the student start after you gave the direction?'
  },
  {
    id: 'irt',
    term: 'Inter-Response Time',
    acronym: 'IRT',
    phonetic: 'I-R-T',
    category: 'Continuous Measurement',
    simpleDefinition: 'The amount of time that passes between the END of one behavior and the START of the very next instance of that same behavior.',
    rbtExamFocus: 'Key Inverse Rule: As Rate increases (behavior happens faster), IRT DECREASES (the pause gets shorter). If Rate goes down, IRT goes up.',
    clinicalExample: 'Maya reads a sentence, looks away for 4 seconds, then looks back down at sentence two. The 4-second gap between reading episodes is the IRT.',
    memoryHook: 'The Seesaw! Clapping fast (High Rate) = Tiny pauses (Low IRT).'
  },
  {
    id: 'duration',
    term: 'Duration',
    phonetic: 'doo-RAY-shun',
    category: 'Continuous Measurement',
    simpleDefinition: 'The total length of time that a behavior persists from the moment it begins until the moment it stops.',
    rbtExamFocus: 'Used when the goal is how LONG a behavior lasts rather than how many times it happens. Two types: Total Duration (total time during the whole session) and Duration Per Occurrence.',
    clinicalExample: 'Maya visually fixates on her worksheet from 9:00 AM until 9:07 AM without looking away. Duration = 7 continuous minutes.',
    memoryHook: 'Duration = "During"! How long did the student stay engaged during the episode?'
  },
  {
    id: 'frequency',
    term: 'Frequency (Count)',
    phonetic: 'FREE-kwen-see',
    category: 'Continuous Measurement',
    simpleDefinition: 'A simple tally or count of the total number of times a behavior occurs.',
    rbtExamFocus: 'Only use Frequency if observation sessions are always the exact same length of time. If session lengths change, you must convert frequency to RATE (Count ÷ Time)!',
    clinicalExample: 'The RBT clicks the tally counter each time Jordan makes a 3-point joint visual attention shift. Total count = 6 times in 10 minutes.',
    memoryHook: 'Frequency is just counting on your fingers: 1, 2, 3!'
  },
  {
    id: 'rate',
    term: 'Rate',
    phonetic: 'RAYT',
    category: 'Continuous Measurement',
    simpleDefinition: 'The frequency count divided by the observation time (e.g., behaviors per minute or per hour).',
    rbtExamFocus: 'Required whenever session lengths vary (e.g., comparing a 15-minute center session on Monday with a 30-minute session on Tuesday). Formula: Rate = Count ÷ Time.',
    clinicalExample: 'Ethan looked away from his visual schedule 12 times in a 6-minute observation. Rate = 12 ÷ 6 = 2.0 gaze shifts per minute.',
    memoryHook: 'Rate = Ratio! Count over Time.'
  },
  {
    id: 'wir',
    term: 'Whole Interval Recording',
    acronym: 'WIR',
    phonetic: 'WIR',
    category: 'Discontinuous Measurement',
    simpleDefinition: 'A time-sampling method where the RBT only marks positive (+) if the behavior occurs continuously for 100% of the interval.',
    rbtExamFocus: 'Board Favorite: Systematically UNDERESTIMATES behavior duration. Best for behaviors you want to INCREASE (like sustained visual reading), because it won\'t falsely show mastery.',
    clinicalExample: 'In a 10-second interval, Maya looks at her book for 9 seconds but glances at the door for 1 second. The RBT must score it as a non-occurrence (-)!',
    memoryHook: 'POW - U! Whole Underestimates! It\'s tough to get credit for the WHOLE pizza.'
  },
  {
    id: 'pir',
    term: 'Partial Interval Recording',
    acronym: 'PIR',
    phonetic: 'PIR',
    category: 'Discontinuous Measurement',
    simpleDefinition: 'A time-sampling method where the RBT marks positive (+) if the behavior occurs at ANY point during the interval, even for half a second.',
    rbtExamFocus: 'Board Favorite: Systematically OVERESTIMATES behavior duration. Best for behaviors you want to DECREASE (like visual stimming or gaze wandering), because even a quick glance is caught.',
    clinicalExample: 'In a 10-second interval, Ethan looks away at the ceiling fan for 0.5 seconds. The entire 10-second interval is scored as positive (+).',
    memoryHook: 'POW - U! Partial Overestimates! Easy to get credit from just a partial bite.'
  },
  {
    id: 'mts',
    term: 'Momentary Time Sampling',
    acronym: 'MTS',
    phonetic: 'M-T-S',
    category: 'Discontinuous Measurement',
    simpleDefinition: 'A time-sampling method where the RBT looks up and records (+) ONLY if the behavior is happening at the EXACT split-second the interval timer rings.',
    rbtExamFocus: 'Has NO systematic bias (does not consistently over- or under-estimate). The RBT does not need to watch the student continuously, making it ideal for busy classrooms.',
    clinicalExample: 'The timer buzzes at the 2-minute mark. The RBT looks up at Jordan: he is looking at his AAC screen at that exact second, so the RBT marks (+).',
    memoryHook: 'Think of taking a photo snapshot at the exact "Moment" the timer beeps!'
  },
  {
    id: 'permanent-product',
    term: 'Permanent Product Recording',
    phonetic: 'PER-muh-nent PROD-ukt',
    category: 'Assessment & Reliability',
    simpleDefinition: 'Measuring behavior after it happens by looking at the tangible physical outcome or object left behind in the room.',
    rbtExamFocus: 'Does NOT require direct observation during the session. Exam Trap: Visual eye gaze cannot be measured by permanent product unless a video was recorded!',
    clinicalExample: 'Counting how many visual schedule icons Maya moved to the "Done" pocket after math center, or counting completed worksheet items.',
    memoryHook: 'The "Residue" rule: If the student walked away, is there physical proof left on the table?'
  },
  {
    id: 'abscissa',
    term: 'Abscissa (X-Axis)',
    phonetic: 'ab-SIS-uh',
    category: 'Graphing & Visual Analysis',
    simpleDefinition: 'The horizontal bottom axis on a line graph that represents the continuous passage of time, dates, or observation sessions.',
    rbtExamFocus: 'Horizontal = Abscissa (X). Standard ratio: the vertical Y-axis should be 2/3 to 3/4 the length of the horizontal X-axis (3:4 aspect ratio) to avoid slope distortion.',
    clinicalExample: 'Along the bottom of Liam’s graph, sessions are numbered 1 through 14 across the horizontal line.',
    memoryHook: 'Ab-SCISS-a lies flat on the table like a pair of scissors!'
  },
  {
    id: 'ordinate',
    term: 'Ordinate (Y-Axis)',
    phonetic: 'OR-di-nit',
    category: 'Graphing & Visual Analysis',
    simpleDefinition: 'The vertical left axis on a line graph that represents the behavioral dimension being measured (e.g., duration, latency, percentage, or count).',
    rbtExamFocus: 'Vertical = Ordinate (Y). Must start at 0 unless a scale break (//) is explicitly drawn.',
    clinicalExample: 'Up the left side of Maya’s graph, tick marks show visual tracking duration from 0 to 15 minutes.',
    memoryHook: 'Ordinate reaches Overhead to the sky!'
  },
  {
    id: 'condition-line',
    term: 'Condition Change Line (Phase Line)',
    phonetic: 'kuhn-DISH-un layn',
    category: 'Graphing & Visual Analysis',
    simpleDefinition: 'A vertical line drawn on a graph to indicate that a change was made to the environment, routine, or intervention.',
    rbtExamFocus: 'SOLID vertical line = Major new intervention (Baseline to Visual Schedule). DASHED vertical line = Minor tweak (prompt fading). Critical Rule: NEVER connect data points across phase lines!',
    clinicalExample: 'Between Session 5 (baseline) and Session 6 (high-contrast visual cue), the RBT draws a solid vertical line and leaves a clean gap in the data path.',
    memoryHook: 'Solid = Big shift! Dashed = Small tweak!'
  },
  {
    id: 'aim-line',
    term: 'Aim Line (Goal Line)',
    phonetic: 'AYM layn',
    category: 'Graphing & Visual Analysis',
    simpleDefinition: 'A straight trajectory line drawn from the baseline median value to the student’s target IEP or behavior mastery goal coordinate.',
    rbtExamFocus: 'Used to visually assess whether progress is fast enough. Governs the 4-Point Decision Rule for when to modify or accelerate interventions.',
    clinicalExample: 'Liam’s baseline median transition latency was 85s; target is 15s at Session 14. The dashed aim line slopes downward between those two points.',
    memoryHook: 'The student\'s flight path to graduation!'
  },
  {
    id: 'four-point-rule',
    term: '4-Point Decision Rule',
    phonetic: 'four-poynt rool',
    category: 'Graphing & Visual Analysis',
    simpleDefinition: 'A progress monitoring decision protocol: if 4 consecutive session points fall below the aim line, the intervention MUST be modified immediately.',
    rbtExamFocus: 'RBT Ethical Duty: When an RBT sees 4 points below the aim line, notify the supervising BCBA immediately. Do not wait for the annual IEP review!',
    clinicalExample: 'Ethan has 4 points in a row below the aim line; the RBT alerts the BCBA, who switches from verbal praise to high-contrast tactile visual cards.',
    memoryHook: '"4 below, time to go! Change the plan, don\'t let it stand!"'
  },
  {
    id: 'cumulative-record',
    term: 'Cumulative Record',
    phonetic: 'KYOO-myuh-luh-tiv',
    category: 'Graphing & Visual Analysis',
    simpleDefinition: 'A graph created by B.F. Skinner where every response causes the recording pen to step upward, accumulating responses over time.',
    rbtExamFocus: 'The slope equals the RATE of responding. Steep = High rate. Gentle = Low rate. Flat horizontal line = ZERO responding. The line can NEVER slope downward!',
    clinicalExample: 'During a 15-minute session, the cumulative line stays flat for 5 minutes, showing Jordan made zero visual selections on his AAC screen during that window.',
    memoryHook: 'Flatline = No pulse, no responses!'
  },
  {
    id: 'stranger-test',
    term: 'Stranger Test',
    phonetic: 'STRAYN-jer test',
    category: 'Assessment & Reliability',
    simpleDefinition: 'A quality check on an operational definition: could an unfamiliar substitute RBT read the definition and record identical data without asking for help?',
    rbtExamFocus: 'Eliminates vague words like "good eye contact" or "paying attention" in favor of exact head angles, minimum seconds, and physical actions.',
    clinicalExample: 'A compliant definition: "Head oriented within 45 degrees of worksheet for at least 3 continuous seconds."',
    memoryHook: 'If a stranger can\'t measure it identically, rewrite it!'
  },
  {
    id: 'dead-mans-test',
    term: 'Dead Man\'s Test',
    phonetic: 'ded manz test',
    category: 'Assessment & Reliability',
    simpleDefinition: 'Ogden Lindsley’s rule of thumb: If a dead man can do it, it is NOT an active behavior!',
    rbtExamFocus: 'Behaviors cannot be defined as non-actions (e.g. "not screaming", "sitting quietly", or "not looking away"). Behavior must require active ocular or motor movement.',
    clinicalExample: '"Sitting quietly" fails because a corpse can sit quietly. "Orienting eyes to visual schedule" passes because it requires living muscular movement.',
    memoryHook: 'If a dead man can do it, it doesn\'t count as behavior!'
  },
  {
    id: 'pnd',
    term: 'Percentage of Non-Overlapping Data',
    acronym: 'PND',
    phonetic: 'P-N-D',
    category: 'Assessment & Reliability',
    simpleDefinition: 'A simple mathematical effect size measuring how much better the intervention data is compared to the baseline phase.',
    rbtExamFocus: 'For behaviors to increase: (Intervention points greater than the HIGHEST baseline point ÷ Total intervention points) × 100%. >90% = Highly effective; <50% = Ineffective.',
    clinicalExample: 'Highest baseline gaze was 4 min. 9 out of 10 intervention points were greater than 4 min. PND = (9 ÷ 10) × 100% = 90% (Highly Effective).',
    memoryHook: 'The Roof Rule: How many points jumped over the baseline roof?'
  }
];
