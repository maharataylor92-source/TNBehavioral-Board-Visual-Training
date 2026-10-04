export interface RBTQuestion {
  id: string;
  taskListCode: 'A-1' | 'A-2' | 'A-3' | 'A-4' | 'A-5' | 'A-6';
  taskListName: string;
  category: 'Continuous Measurement' | 'Discontinuous Measurement' | 'Graphing & Visual Analysis' | 'Permanent Product' | 'Data Prep & Operational Definitions';
  difficulty: 'Board Essential' | 'High-Yield Scenario' | 'Tricky Distractor';
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  // Specific feedback for every single option so when she clicks an incorrect option,
  // she gets an instant, tailored explanation of why that specific choice was a trap!
  optionFeedback: string[];
  explanation: string;
  memoryHook: string;
  rbtTaskReference: string;
  clinicalTip: string;
  hasExhibit?: boolean;
  exhibitType?: 'line-graph' | 'cumulative-record' | 'interval-grid' | 'scatterplot';
  exhibitData?: any;
}

export const RBT_EXAM_QUESTIONS: RBTQuestion[] = [
  {
    id: 'rbt-q1',
    taskListCode: 'A-2',
    taskListName: 'Continuous Measurement',
    category: 'Continuous Measurement',
    difficulty: 'Board Essential',
    scenario: 'An RBT in a Tennessee autism clinic delivers the verbal instruction "Maya, point to the yellow square" while presenting a visual array. Maya sits still for 7 seconds, then reaches out and touches the yellow square. Her touch lasts for 2 seconds.',
    question: 'The 7 seconds between the end of the RBT\'s instruction and the start of Maya touching the yellow square is an example of which measurement dimension?',
    options: [
      'Duration',
      'Latency',
      'Inter-Response Time (IRT)',
      'Rate'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A (Duration) is incorrect: Duration measures how long the behavior lasts once it has started (which was the 2 seconds of touching), NOT the waiting time before it begins.',
      'Option B (Latency) is CORRECT! Latency is the elapsed time from the onset of the discriminative stimulus (SD / prompt) to the initiation of the target response.',
      'Option C (IRT) is incorrect: IRT is the time elapsed between TWO consecutive responses (from the end of one response to the start of the next response), not between the prompt and the response.',
      'Option D (Rate) is incorrect: Rate is frequency count divided by observation time (e.g., 5 responses per minute). It is not a duration or latency timer.'
    ],
    explanation: 'Latency measures the delay before a behavior begins following a stimulus or instruction. Here, the prompt was delivered at time 0, and Maya initiated the reach at 7 seconds. Thus, the latency is 7 seconds.',
    memoryHook: 'Think "LATE": How LATE did the student start after the instruction was given?',
    rbtTaskReference: 'BACB RBT Task List (2nd ed.) A-2: Implement continuous measurement procedures (Latency).',
    clinicalTip: 'For neurodivergent students with sensory processing delays, tracking latency allows you to observe whether wait-time interventions are successfully speeding up response initiation.'
  },
  {
    id: 'rbt-q2',
    taskListCode: 'A-3',
    taskListName: 'Discontinuous Measurement',
    category: 'Discontinuous Measurement',
    difficulty: 'High-Yield Scenario',
    scenario: 'A behavior plan targets INCREASING independent visual attention to a task schedule for an 8-year-old student. The observation period is divided into 10-second intervals. In interval 1, the student looks at the task schedule for seconds 1 through 9, but looks away at the clock during second 10.',
    question: 'If the RBT is using WHOLE INTERVAL RECORDING, how should interval 1 be scored, and why?',
    options: [
      'Scored as a occurrence (+) because the student engaged for 90% of the interval.',
      'Scored as a non-occurrence (-) because the behavior did not persist continuously for 100% of the entire interval.',
      'Scored as an occurrence (+) because Whole Interval Recording captures behavior occurring at any point.',
      'Estimated as a half-occurrence (0.5) because the student almost completed the interval.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Whole Interval Recording is strictly all-or-nothing. Even 9.9 seconds out of 10 does not earn a (+) if the student stopped before the final second.',
      'Option B is CORRECT! In Whole Interval Recording, the target behavior must occur uninterrupted for the entire duration of the interval. Because the student looked away in second 10, it must be marked as a non-occurrence (-).',
      'Option C is incorrect: Marking an occurrence for behavior at ANY point is Partial Interval Recording (PIR), not Whole Interval Recording.',
      'Option D is incorrect: In discontinuous interval recording, there are no partial credit or fractional scores; intervals are scored binary as (+) or (-).'
    ],
    explanation: 'Whole Interval Recording requires the behavior to be present for the full 100% duration of the interval. Because of this strict requirement, WIR systematically UNDERESTIMATES the true occurrence of the behavior. That is why it is the gold standard for behaviors targeted for INCREASE—if a student shows progress on WIR, you can be 100% confident their sustained focus has truly mastered the goal.',
    memoryHook: 'POW - U: Partial Overestimates, Whole Underestimates! You must eat the WHOLE pizza to get credit in WIR.',
    rbtTaskReference: 'BACB RBT Task List A-3: Implement discontinuous measurement procedures (Whole Interval Recording).',
    clinicalTip: 'Never give "benefit of the doubt" during WIR. If the student breaks focus for even 1 second, mark (-).'
  },
  {
    id: 'rbt-q3',
    taskListCode: 'A-2',
    taskListName: 'Continuous Measurement',
    category: 'Continuous Measurement',
    difficulty: 'Board Essential',
    scenario: 'A student engages in high-frequency vocal stereotypy during classroom centers. The RBT records that the student stops a vocalization at 10:04:15 AM and begins the next vocalization at 10:04:22 AM.',
    question: 'The 7-second time window between the end of the first vocalization and the start of the next vocalization is called:',
    options: [
      'Response Latency',
      'Inter-Response Time (IRT)',
      'Total Duration',
      'Momentary Time Sample'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Latency is the time from an external prompt/SD to the first response. Here, there was no prompt; we are measuring the gap between two self-initiated responses.',
      'Option B is CORRECT! Inter-Response Time (IRT) is the elapsed time between the termination of one response and the onset of the very next instance of the same behavior.',
      'Option C is incorrect: Duration measures how long one vocal episode lasted, not the silence between episodes.',
      'Option D is incorrect: Momentary Time Sampling is a discontinuous recording procedure where behavior is noted only at the exact second an interval ends.'
    ],
    explanation: 'Inter-Response Time (IRT) measures the amount of time that elapses between two consecutive instances of a response. When behavior occurs rapidly in succession, IRT is very short. When behavior is spaced far apart, IRT is long.',
    memoryHook: 'IRT = In-Between Responses Time! End of Response 1 ➔ [IRT] ➔ Start of Response 2.',
    rbtTaskReference: 'BACB RBT Task List A-2: Implement continuous measurement procedures (IRT).',
    clinicalTip: 'Remember the Seesaw rule on the board exam: As rate increases, IRT decreases! As rate decreases, IRT increases!'
  },
  {
    id: 'rbt-q4',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'High-Yield Scenario',
    scenario: 'An RBT is inspecting a cumulative record generated during a discrete trial training session. Over a 15-minute period during which the student was taking a sensory break, the line on the cumulative graph is completely flat and horizontal.',
    question: 'How should the RBT interpret a flat, horizontal line on a cumulative record?',
    options: [
      'The student was responding at a steady, high rate.',
      'Zero responses occurred during that time interval.',
      'The student unlearned the skill or made multiple errors.',
      'The rate of responding decreased below zero.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: A steep, upward-pointing slope indicates a high rate of responding. A flat line means the count did not increase at all.',
      'Option B is CORRECT! On a cumulative record, every response moves the pen upward. When no responses occur, the paper feeds horizontally without any upward steps, producing a completely flat line (rate = 0).',
      'Option C is incorrect: Cumulative records never subtract points; errors or unlearning do not make the line go flat or down.',
      'Option D is incorrect: Rate cannot be negative, and cumulative lines can NEVER slope downward.'
    ],
    explanation: 'On a cumulative graph, data points accumulate over time. The slope of the line equals the rate of responding: steep slope = rapid responding, moderate slope = steady responding, flat horizontal line = zero responding. The line can NEVER have a downward slope because total accumulated counts cannot decrease.',
    memoryHook: 'FLATLINE = NO HEARTBEAT = ZERO RESPONSES! Cumulative records NEVER go down.',
    rbtTaskReference: 'BACB RBT Task List A-5: Enter data and update graphs (Cumulative Records).',
    clinicalTip: 'If an exam question asks "What does a negative/downward slope on a cumulative record indicate?", the answer is that a downward slope is impossible!'
  },
  {
    id: 'rbt-q5',
    taskListCode: 'A-3',
    taskListName: 'Discontinuous Measurement',
    category: 'Discontinuous Measurement',
    difficulty: 'Board Essential',
    scenario: 'A BCBA instructs an RBT to track hand-flapping targeted for REDUCTION. The observation is set up in 15-second intervals. If the student flaps their hands for just 1 second at the very start of the interval, the RBT marks the whole 15 seconds as a (+).',
    question: 'Which measurement procedure is the RBT implementing, and what measurement artifact does it produce?',
    options: [
      'Whole Interval Recording; it underestimates behavior.',
      'Partial Interval Recording; it systematically overestimates behavior duration.',
      'Momentary Time Sampling; it produces zero measurement error.',
      'Permanent Product Recording; it only measures tangible outcomes.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: In Whole Interval Recording, 1 second of flapping would be marked as a (-) non-occurrence because it did not last all 15 seconds.',
      'Option B is CORRECT! Partial Interval Recording (PIR) scores an interval as positive if the behavior happens at ANY time, even for a split second. Because 1 second of behavior gives credit for the full 15-second interval, PIR systematically OVERESTIMATES duration.',
      'Option C is incorrect: Momentary Time Sampling only looks at the exact instant the timer chimes, and it can either over- or underestimate behavior depending on interval length.',
      'Option D is incorrect: Permanent product recording does not divide continuous time into interval blocks.'
    ],
    explanation: 'Partial Interval Recording records an occurrence if the target behavior occurs at ANY point during the interval. Because a 1-second occurrence turns the entire interval into a (+), PIR inflates the apparent duration of the behavior. Therefore, it is ideal for behaviors we want to DECREASE (you catch every instance).',
    memoryHook: 'POW-U: Partial Overestimates! Just a tiny "PART" of the interval triggers a (+).',
    rbtTaskReference: 'BACB RBT Task List A-3: Implement discontinuous measurement procedures (Partial Interval).',
    clinicalTip: 'Board trap: Partial interval recording can also underestimate the frequency of high-rate behaviors (because 10 claps in 1 interval still only counts as one (+)), but it overestimates total duration.'
  },
  {
    id: 'rbt-q6',
    taskListCode: 'A-2',
    taskListName: 'Continuous Measurement',
    category: 'Continuous Measurement',
    difficulty: 'Board Essential',
    scenario: 'On Monday, an RBT observes Liam for 15 minutes and counts 6 instances of task refusal. On Tuesday, the RBT observes Liam for 30 minutes and counts 6 instances of task refusal. The RBT reports that Liam\'s behavior was "identical" on both days.',
    question: 'Why is the RBT\'s report clinically inaccurate according to Tennessee Board and BACB measurement standards?',
    options: [
      'The RBT should have used Duration instead of Count.',
      'The observation sessions had different durations, so the RBT should have calculated RATE (count divided by time) rather than comparing raw frequency.',
      'The RBT should have used Momentary Time Sampling instead.',
      'Frequency can never be compared across days even if sessions are the same length.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: While duration could be useful, count can be validly analyzed if converted to rate.',
      'Option B is CORRECT! Frequency (raw count) is only meaningful when observation durations are identical. Because session length differed (15 min vs 30 min), calculating Rate shows: Monday = 6/15 = 0.4 refusals/min; Tuesday = 6/30 = 0.2 refusals/min. The rate actually dropped by 50% on Tuesday!',
      'Option C is incorrect: Discontinuous sampling would introduce unnecessary estimation error when direct continuous count was already taken.',
      'Option D is incorrect: Frequency can indeed be compared across days if observation periods are standardized to the exact same time.'
    ],
    explanation: 'Rate = Count ÷ Observation Time. When observation session lengths vary (e.g. 15 minutes vs 30 minutes), raw frequency counts are misleading. On Monday Liam engaged in 0.4 behaviors per minute, whereas on Tuesday he engaged in 0.2 behaviors per minute. Rate must always be used when observation times are unequal.',
    memoryHook: 'RATE = RATIO! Count OVER Time. Whenever time changes, convert to Rate!',
    rbtTaskReference: 'BACB RBT Task List A-2: Implement continuous measurement procedures (Rate).',
    clinicalTip: 'Always check if the test scenario mentions unequal observation times. If session times are unequal, raw count is WRONG; RATE is the required answer.'
  },
  {
    id: 'rbt-q7',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'High-Yield Scenario',
    scenario: 'An RBT is updating a line graph for a student\'s transition data. On Friday, the BCBA introduces a major new independent variable: a full picture-exchange visual schedule. The previous 5 sessions were baseline.',
    question: 'According to single-case graphing conventions, how should the RBT separate the Baseline phase from the Intervention phase on the line graph?',
    options: [
      'With a dashed vertical line, and connect the last baseline point to the first intervention point.',
      'With a solid vertical line, and DO NOT connect the data points across the line.',
      'With a horizontal dotted line spanning the entire width of the page.',
      'By starting an entirely new graph on a new piece of paper.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Dashed lines are for minor condition changes (e.g., parameter shifts like changing token prices), and data points must NEVER be connected across condition lines.',
      'Option B is CORRECT! A major phase change (independent variable introduction) is represented by a SOLID vertical line. Furthermore, data paths must NEVER connect points across a phase change line.',
      'Option C is incorrect: Horizontal lines are goal lines, aim lines, or mean level lines; phase changes are strictly vertical.',
      'Option D is incorrect: In single-case design, baseline and intervention phases are displayed on the SAME graph so visual analysis can compare level, trend, and variability.'
    ],
    explanation: 'On equal-interval line graphs: (1) Major condition/phase changes are indicated by a solid vertical line. (2) Minor condition modifications are indicated by a dashed vertical line. (3) Data points are NEVER connected across phase change lines, because doing so would falsely imply behavioral continuity between different conditions.',
    memoryHook: 'SOLID FOR SURGERY (Major Change), DASHED FOR DIAL TWEAK (Minor Change). Never cross the line with your pen!',
    rbtTaskReference: 'BACB RBT Task List A-5: Enter data and update graphs (Phase Change Lines).',
    clinicalTip: 'Remember the four times you NEVER connect data points: across phase lines, across breaks in time (holidays), across scale breaks, and between discontinuous data.'
  },
  {
    id: 'rbt-q8',
    taskListCode: 'A-4',
    taskListName: 'Permanent Product Recording',
    category: 'Permanent Product',
    difficulty: 'Board Essential',
    scenario: 'An RBT needs to collect data on whether a neurodivergent student completes math worksheets during independent study time. The RBT has multiple students to support in the classroom and cannot watch the student during the entire 20-minute period.',
    question: 'Which measurement method allows the RBT to measure the student\'s behavior AFTER it has occurred by examining the concrete environmental outcome?',
    options: [
      'Permanent Product Recording',
      'Whole Interval Recording',
      'Inter-Response Time',
      'Momentary Time Sampling'
    ],
    correctIndex: 0,
    optionFeedback: [
      'Option A is CORRECT! Permanent product recording measures behavior after it has occurred by evaluating the tangible product or effect the behavior left on the environment (e.g., completed worksheets, assembled widgets, toys put in bins).',
      'Option B is incorrect: Whole Interval Recording requires the RBT\'s continuous undivided visual attention for every single second of the interval.',
      'Option C is incorrect: IRT requires live timing between successive responses using a stopwatch.',
      'Option D is incorrect: Momentary Time Sampling still requires the RBT to look up at specific scheduled intervals (e.g., every 2 minutes).'
    ],
    explanation: 'Permanent Product Recording is an indirect measurement method where the observer does not need to be present when the behavior occurs. Instead, they inspect the durable physical outcome left behind (e.g. number of math problems completed, trash picked up, visual cards sorted).',
    memoryHook: 'PERMANENT = It leaves a trace you can hold in your hand later!',
    rbtTaskReference: 'BACB RBT Task List A-4: Implement permanent-product recording procedures.',
    clinicalTip: 'A big advantage of permanent product recording on the RBT exam is that the RBT is free to perform other instructional duties while the student works.'
  },
  {
    id: 'rbt-q9',
    taskListCode: 'A-6',
    taskListName: 'Describe Behavior in Observable and Measurable Terms',
    category: 'Data Prep & Operational Definitions',
    difficulty: 'Board Essential',
    scenario: 'An RBT is asked to write an operational definition for "off-task visual behavior" during classroom instruction for a child on the autism spectrum.',
    question: 'Which of the following definitions meets the criteria for being objective, clear, and complete (passing the Stranger Test)?',
    options: [
      '"Student acts rude and does not care about what the teacher is saying."',
      '"Student looks away from the assigned instructional worksheet or teacher for more than 3 consecutive seconds."',
      '"Student feels anxious and has a bad attitude during reading."',
      '"Student is visually distracted by internal thoughts and daydreaming."'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: "Acts rude" and "does not care" are subjective judgments and mentalistic labels, not observable physical actions.',
      'Option B is CORRECT! "Looks away from worksheet or teacher for > 3 consecutive seconds" specifies an observable action (gaze direction) and a precise measurable threshold (3 seconds) that any independent observer could record identically.',
      'Option C is incorrect: "Feels anxious" and "bad attitude" are internal emotional inferences that cannot be directly seen or measured.',
      'Option D is incorrect: "Internal thoughts" and "daydreaming" cannot be observed by an outside clinician.'
    ],
    explanation: 'An operational definition must be: (1) Objective (refers only to observable characteristics), (2) Clear (unambiguous, passes the "Stranger Test" so a stranger could record it reliably), and (3) Complete (specifies boundaries of what counts and what does not count).',
    memoryHook: 'THE STRANGER TEST: Could a total stranger walk off the street and count this behavior with 100% agreement?',
    rbtTaskReference: 'BACB RBT Task List A-6: Describe behavior and environment in observable and measurable terms.',
    clinicalTip: 'Never pick answer choices on the RBT exam that contain mentalisms like "frustrated", "knows", "wants", "intends", or "felt angry". Always look for physical actions.'
  },
  {
    id: 'rbt-q10',
    taskListCode: 'A-1',
    taskListName: 'Prepare for Data Collection',
    category: 'Data Prep & Operational Definitions',
    difficulty: 'Board Essential',
    scenario: 'Before starting a 1:1 session with a neurodivergent learner, an RBT reviews the behavior intervention plan, ensures data sheets and pencils are ready, and checks that the interval timer app is charged and working.',
    question: 'According to BACB Task A-1, what is the VERY FIRST step in preparing for data collection before session begins?',
    options: [
      'Immediately start prompting the student with high-demand trials.',
      'Read the target behavior definitions, measurement procedures, and previous session data in the client\'s plan.',
      'Notify the parents about what mastery criteria you expect today.',
      'Decide on your own measurement system during the first five minutes of the session.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Starting trials without knowing the operational definition or setting up data tools results in lost, unrecorded data.',
      'Option B is CORRECT! To prepare for data collection, the RBT must read the target definitions, review recent session data/trends, gather necessary materials (timers, clickers, data sheets), and eliminate environmental distractions before greeting the client.',
      'Option C is incorrect: Setting mastery criteria is the BCBA\'s role, not the RBT\'s, and discussing it with parents is not the preparation step.',
      'Option D is incorrect: RBTs must NEVER invent or modify measurement systems on the fly; they strictly follow the BCBA\'s written plan.'
    ],
    explanation: 'Preparation for data collection (Task A-1) involves reviewing the operational definition, knowing what dimension is being measured (duration vs rate vs interval), gathering materials (datasheet, clicker, visual schedule, timer), and reviewing the previous session\'s notes and data path.',
    memoryHook: 'PREPARE: Plan read, Resources ready, Environment checked!',
    rbtTaskReference: 'BACB RBT Task List A-1: Prepare for data collection.',
    clinicalTip: 'If your timer battery dies mid-session, that data is compromised. Proper preparation prevents data loss.'
  },
  {
    id: 'rbt-q11',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'High-Yield Scenario',
    scenario: 'An RBT is analyzing a line graph tracking a student\'s social initiations. Looking at the data points, the RBT notices that data is consistently moving in an upward direction from 2 initiations to 4, 6, 7, and 9 initiations across 5 consecutive sessions.',
    question: 'In visual analysis of single-case graphs, what fundamental dimension of the data does this upward trajectory describe?',
    options: [
      'Level',
      'Trend',
      'Variability',
      'Latency'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Level refers to the average or central tendency position of the data points along the Y-axis (e.g. mean or median value).',
      'Option B is CORRECT! Trend refers to the overall direction in which the data path is moving over time (ascending, descending, or zero/neutral trend). Here, the upward slope is an ascending trend.',
      'Option C is incorrect: Variability refers to how much the data bounces around or fluctuates (bounce vs stability).',
      'Option D is incorrect: Latency is a measurement dimension of time before a response begins, not a graph analysis feature.'
    ],
    explanation: 'Visual analysis in behavior analysis inspects three core visual dimensions: (1) Level (the position of data on the y-axis, high/moderate/low), (2) Trend (the overall slope or direction: ascending, descending, or flat), and (3) Variability (the bounce or spread of data around the trendline).',
    memoryHook: 'THE THREE VISUAL PILLARS: Level (Height), Trend (Direction/Angle), Variability (Bounce)!',
    rbtTaskReference: 'BACB RBT Task List A-5: Enter data and update graphs (Visual Analysis: Level, Trend, Variability).',
    clinicalTip: 'Board questions frequently ask you to distinguish between Trend (slope direction) and Level (mean value).'
  },
  {
    id: 'rbt-q12',
    taskListCode: 'A-3',
    taskListName: 'Discontinuous Measurement',
    category: 'Discontinuous Measurement',
    difficulty: 'High-Yield Scenario',
    scenario: 'A classroom assistant is observing an autistic student during 30-minute circle time. The assistant sets an audio timer to beep once every 5 minutes. When the beep sounds at minute 5, 10, 15, 20, 25, and 30, the assistant looks up and records whether the student is visually attending to the teacher at that exact second.',
    question: 'Which discontinuous measurement system is the assistant utilizing?',
    options: [
      'Whole Interval Recording',
      'Partial Interval Recording',
      'Momentary Time Sampling',
      'Duration Recording'
    ],
    correctIndex: 2,
    optionFeedback: [
      'Option A is incorrect: Whole Interval Recording requires continuous observation for the entire 5 minutes.',
      'Option B is incorrect: Partial Interval Recording requires continuous monitoring to catch behavior occurring at ANY moment during the 5 minutes.',
      'Option C is CORRECT! Momentary Time Sampling (MTS) measures whether the target behavior is occurring at the EXACT moment the interval ends (at the chime). The observer does NOT need to watch during the rest of the interval.',
      'Option D is incorrect: Duration recording requires timing the start and stop of each attending episode with a stopwatch.'
    ],
    explanation: 'Momentary Time Sampling (MTS) records whether the behavior is occurring at the specific moment the interval terminates. It is the least burdensome measurement system for teachers and group-care providers because they only look up at the beep.',
    memoryHook: 'MOMENTARY = At the exact MOMENT the beep goes off!',
    rbtTaskReference: 'BACB RBT Task List A-3: Implement discontinuous measurement procedures (Momentary Time Sampling).',
    clinicalTip: 'On the board exam, MTS is the best answer when an educator has multiple children and CANNOT observe continuously.'
  },
  {
    id: 'rbt-q13',
    taskListCode: 'A-1',
    taskListName: 'Prepare for Data Collection',
    category: 'Data Prep & Operational Definitions',
    difficulty: 'Board Essential',
    scenario: 'Two RBTs independently observe a 10-minute session of visual tracking during an inter-observer agreement (IOA) check. Observer A counts 8 instances. Observer B counts 10 instances.',
    question: 'Using Total Count IOA, what is the calculated agreement percentage, and does it meet Tennessee Board and BACB standards?',
    options: [
      '80%; Yes, it meets the standard of at least 80% agreement.',
      '125%; Yes, because any score over 100% is acceptable.',
      '20%; No, it is far below the passing threshold.',
      '80%; No, the board requires 100% agreement on all IOA checks.'
    ],
    correctIndex: 0,
    optionFeedback: [
      'Option A is CORRECT! Total Count IOA formula = (Smaller Count ÷ Larger Count) × 100 = (8 ÷ 10) × 100 = 80%. BACB and research standards require IOA to be at least 80% across 20% to 33% of sessions.',
      'Option B is incorrect: Agreement percentages can never exceed 100% because smaller count is always divided by larger count.',
      'Option C is incorrect: 20% is the difference (100 - 80), not the agreement quotient.',
      'Option D is incorrect: While 100% is nice, the professional board standard is at least 80% agreement.'
    ],
    explanation: 'Total Count IOA = (Smaller Count ÷ Larger Count) × 100. (8 / 10) * 100 = 80%. The BACB and Tennessee Board require IOA to be collected in a minimum of 20% to 33% of sessions with an agreement benchmark of at least 80%.',
    memoryHook: 'THE PYRAMID: Smaller count on TOP, larger count on the BOTTOM! Small ÷ Large × 100.',
    rbtTaskReference: 'BACB RBT Task List A-1 & BACB Guidelines: Inter-Observer Agreement (IOA) calculation.',
    clinicalTip: 'IOA proves that our data is reliable and that the operational definition is objective and unambiguous.'
  },
  {
    id: 'rbt-q14',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'Board Essential',
    scenario: 'An RBT is constructing an equal-interval line graph for a student\'s daily communication program. The horizontal line running along the bottom of the graph and the vertical line running along the left side need to be labeled correctly.',
    question: 'What are the standard technical names and typical label conventions for the X-axis and Y-axis in Applied Behavior Analysis?',
    options: [
      'X-axis is the Ordinate (target behavior count); Y-axis is the Abscissa (time/sessions).',
      'X-axis is the Abscissa (time periods / sessions); Y-axis is the Ordinate (behavior dimension / dependent variable).',
      'X-axis is the Condition line; Y-axis is the Trend line.',
      'Both axes represent session numbers in ABA.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: The axes are inverted! The X-axis is the horizontal abscissa, and the Y-axis is the vertical ordinate.',
      'Option B is CORRECT! The horizontal X-axis is called the ABSCISSA and represents the passage of time (sessions, days, trials). The vertical Y-axis is called the ORDINATE and represents the dependent variable (count, percentage, duration, rate).',
      'Option C is incorrect: Condition lines and trendlines are lines drawn inside the graph area, not the axes themselves.',
      'Option D is incorrect: The Y-axis represents the behavior metric, not session numbers.'
    ],
    explanation: 'Graph conventions: Horizontal axis = X-axis = Abscissa = Time / Sessions. Vertical axis = Y-axis = Ordinate = Target Behavior / Dependent Variable.',
    memoryHook: 'COGNITIVE TRICK: The letter \'Y\' is tall and vertical like the Y-axis (Ordinate)! "X" lies flat on the ground (Abscissa).',
    rbtTaskReference: 'BACB RBT Task List A-5: Enter data and update graphs (Graph Anatomy).',
    clinicalTip: 'An easy way to remember: Ordinate sounds like "Y" (skyward). Abscissa sounds like "horizontal" baseline.'
  },
  {
    id: 'rbt-q15',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'High-Yield Scenario',
    scenario: 'An RBT plots daily data for a reading engagement goal. An Aim Line connects baseline performance to the IEP target. Over the last 4 consecutive intervention sessions, every single data point has landed below the Aim Line for this behavior targeted for increase.',
    question: 'According to the standard 4-Point Decision Rule in progress monitoring, what should the RBT immediately do?',
    options: [
      'Keep collecting data without changes for another 6 months until the annual IEP meeting.',
      'Notify the supervising BCBA immediately so the team can modify the intervention, evaluate fidelity, or adjust supports.',
      'Erase the 4 data points and regraph them above the Aim Line.',
      'Tell the student that they have lost access to all reinforcers.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Waiting 6 months ignores student failure and violates Tennessee progress monitoring standards.',
      'Option B is CORRECT! The 4-Point Decision Rule dictates that when 4 consecutive points fall below the Aim Line (for a skill being taught), the intervention is not working as planned. The RBT must alert the BCBA so the intervention can be modified without delay.',
      'Option C is incorrect: Falsifying or altering clinical data is an ethical violation (BACB Ethics Code 2.06).',
      'Option D is incorrect: Punishment or removing reinforcers is not an instructional progress monitoring adjustment.'
    ],
    explanation: 'The 4-Point Progress Monitoring Decision Rule is a fundamental standard: 4 consecutive data points BELOW the Aim Line means progress is insufficient, requiring an immediate plan modification. 4 consecutive data points ABOVE the Aim Line indicates faster-than-expected progress, allowing the team to accelerate the goal.',
    memoryHook: '4 IN A ROW? CHANGE THE SHOW! 4 below the line means the plan needs redesigning right now.',
    rbtTaskReference: 'BACB RBT Task List A-5 & TN Progress Monitoring Framework (IDEA Part B).',
    clinicalTip: 'Data-based decision making ensures students don\'t waste months in ineffective behavioral interventions.'
  },
  {
    id: 'rbt-q16',
    taskListCode: 'A-2',
    taskListName: 'Continuous Measurement',
    category: 'Continuous Measurement',
    difficulty: 'Board Essential',
    scenario: 'A student engages in sensory visual gazing at classroom fluorescent lighting. The RBT wants to track how much total time of the 60-minute class period the student spends engaged in this behavior.',
    question: 'Which measurement procedure is MOST appropriate for measuring the continuous duration of this sensory behavior?',
    options: [
      'Duration recording using a stopwatch to measure the total cumulative time spent gazing.',
      'Frequency counting of how many lights are in the ceiling.',
      'Whole Interval Recording with 10-minute intervals.',
      'Latency recording from when the student arrives at school.'
    ],
    correctIndex: 0,
    optionFeedback: [
      'Option A is CORRECT! When a behavior occurs for variable, extended periods of time, Duration recording (total duration or duration per occurrence) accurately captures the total amount of time consumed by the behavior.',
      'Option B is incorrect: Counting lights is an environmental count, not a behavioral metric.',
      'Option C is incorrect: 10-minute WIR intervals are far too long and would mask virtually all instances.',
      'Option D is incorrect: Latency only measures the delay before the first instance, not how long the gazing lasts throughout the class.'
    ],
    explanation: 'Duration recording is the continuous measurement system of choice when the primary clinical concern is how LONG a behavior persists, such as tantrum duration, visual fixation, or on-task academic engagement.',
    memoryHook: 'DURATION = HOW LONG DOES IT PERSIST? Stopwatch starts when behavior starts, stops when behavior stops.',
    rbtTaskReference: 'BACB RBT Task List A-2: Implement continuous measurement procedures (Duration).',
    clinicalTip: 'Total duration gives you total time in session. Duration-per-occurrence gives you the average length of each episode.'
  },
  {
    id: 'rbt-q17',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'Board Essential',
    scenario: 'An RBT needs to choose a graph type to display how many times a student engages in elopement across various 30-minute time blocks throughout the school day (e.g., 9:00-9:30, 9:30-10:00, 10:00-10:30) to see if behaviors cluster around specific periods.',
    question: 'Which visual display is specifically designed to reveal temporal patterns and time-of-day clusters of behavior?',
    options: [
      'Scatterplot',
      'Bar Graph (Histogram)',
      'Cumulative Record',
      'Pie Chart'
    ],
    correctIndex: 0,
    optionFeedback: [
      'Option A is CORRECT! A Scatterplot plots data points across time intervals (Y-axis = time of day, X-axis = days/dates) to uncover environmental patterns, such as behaviors clustering right before lunch or during transitions.',
      'Option B is incorrect: Bar graphs are used for comparing discrete sets of data that are not related along a continuous time dimension.',
      'Option C is incorrect: Cumulative records show total cumulative response rate, not temporal cluster grids.',
      'Option D is incorrect: Pie charts are rarely used in ABA because they do not display behavior changes over time.'
    ],
    explanation: 'Scatterplots plot occurrences across time grids (e.g., hours of the day on one axis vs days on the other axis). Shading or clustering of data cells immediately reveals when during the day a behavior is most likely to occur.',
    memoryHook: 'SCATTERPLOT = SCATTERED ACROSS THE DAY! Tells you WHEN during the day behavior strikes.',
    rbtTaskReference: 'BACB RBT Task List A-5: Enter data and update graphs (Scatterplots).',
    clinicalTip: 'Scatterplots are often used during functional behavior assessments (FBA) to find trigger times.'
  },
  {
    id: 'rbt-q18',
    taskListCode: 'A-6',
    taskListName: 'Describe Behavior in Observable and Measurable Terms',
    category: 'Data Prep & Operational Definitions',
    difficulty: 'High-Yield Scenario',
    scenario: 'A classroom paraprofessional tells the RBT: "Jordan was having a meltdown because he was feeling jealous of his classmate." The RBT needs to record this event in behavioral notes.',
    question: 'How should the RBT rewrite this note using professional, observable, and measurable terminology?',
    options: [
      '"Jordan showed severe jealousy and emotional instability toward his peer."',
      '"Jordan fell to the floor, screamed at high volume for 4 minutes, and swept 3 books off the desk following peer reinforcement."',
      '"Jordan threw a tantrum due to sensory overload and low self-esteem."',
      '"Jordan refused to behave nicely because he wanted negative attention."'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: "Jealousy" and "emotional instability" are unobservable mentalistic explanations.',
      'Option B is CORRECT! "Fell to the floor, screamed for 4 minutes, swept 3 books off the desk" describes exact motor actions, measurable duration, count, and antecedent conditions without mentalisms.',
      'Option C is incorrect: "Sensory overload" and "low self-esteem" are subjective assumptions about internal cognitive states.',
      'Option D is incorrect: "Wanted negative attention" assumes client intent instead of objectively describing what occurred.'
    ],
    explanation: 'Behavior analysts do not use circular or mentalistic terms like "jealousy", "stubborn", or "in a bad mood". We describe the exact motor topography (fell to floor, swept books), physical intensity (high volume), and duration (4 minutes).',
    memoryHook: 'VIDEO CAMERA TEST: Can a video camera record it? A camera records screaming and book throwing; it cannot record "jealousy"!',
    rbtTaskReference: 'BACB RBT Task List A-6: Describe behavior and environment in observable and measurable terms.',
    clinicalTip: 'Writing clean, observable notes protects you legally and provides your BCBA with accurate clinical data.'
  },
  {
    id: 'rbt-q19',
    taskListCode: 'A-2',
    taskListName: 'Continuous Measurement',
    category: 'Continuous Measurement',
    difficulty: 'Board Essential',
    scenario: 'An RBT is recording trials for a student learning receptive identification with picture cards. Across 10 opportunities, the student points to the correct picture independently on 8 trials.',
    question: 'How should the RBT calculate and report this trial-by-trial measurement metric?',
    options: [
      '80% Percentage of Opportunities / Trials to Criterion',
      'Rate of 8 pictures per hour',
      'Latency of 8 seconds',
      'Whole Interval score of 80 seconds'
    ],
    correctIndex: 0,
    optionFeedback: [
      'Option A is CORRECT! Percentage of opportunities = (Number of correct responses ÷ Total opportunities) × 100 = (8 ÷ 10) × 100 = 80%. This is the standard continuous metric for discrete trial training.',
      'Option B is incorrect: Rate requires dividing by actual observation time, which was not specified; discrete opportunities are expressed as percentage correct.',
      'Option C is incorrect: Latency is a time duration before starting, not a score of correct responses.',
      'Option D is incorrect: Discrete trials are not continuous interval time samples.'
    ],
    explanation: 'Percentage of opportunities (trials) is calculated by dividing the number of responses matching the target criteria by the total number of opportunities provided, then multiplying by 100. (8 / 10) * 100 = 80%.',
    memoryHook: 'PERCENTAGE: Part ÷ Whole × 100! 8 correct out of 10 = 80%.',
    rbtTaskReference: 'BACB RBT Task List A-2: Implement continuous measurement procedures (Percentage of Opportunities).',
    clinicalTip: 'Mastery criteria in discrete trial programs are often written as "80% or higher across 3 consecutive sessions".'
  },
  {
    id: 'rbt-q20',
    taskListCode: 'A-5',
    taskListName: 'Enter Data and Update Graphs',
    category: 'Graphing & Visual Analysis',
    difficulty: 'Board Essential',
    scenario: 'An RBT has completed a 2-hour home session. The BCBA\'s protocol states that all raw data collected on paper datasheets must be entered into the electronic graphing system.',
    question: 'When should the RBT enter data and update graphs, according to standard BACB and Tennessee ethical guidelines?',
    options: [
      'At the end of the month before billing statements go out.',
      'Same day, as soon as possible following the session, before the next clinical session occurs.',
      'Only when the supervising BCBA comes for a supervision visit.',
      'Data entry is the client\'s family responsibility, not the RBT\'s.'
    ],
    correctIndex: 1,
    optionFeedback: [
      'Option A is incorrect: Waiting a month prevents timely clinical decisions and violates data collection protocols.',
      'Option B is CORRECT! Timely data entry (same-day or before the subsequent session) is critical because clinical decisions, trend analysis, and intervention modifications rely on up-to-date visual data paths.',
      'Option C is incorrect: BCBAs supervise 5-10% of hours; waiting for supervision creates massive data backlogs and blinds the team to regressions.',
      'Option D is incorrect: Data collection and graphing is explicitly an RBT core task (Task A-5).'
    ],
    explanation: 'Data must be entered and graphed promptly (typically daily or before the next session). Delayed data entry prevents the BCBA from noticing adverse trends, lack of progress, or rapid skill mastery.',
    memoryHook: 'SAME DAY DATA! Behavior moves fast; if you wait a week, the student is stuck.',
    rbtTaskReference: 'BACB RBT Task List A-5: Enter data and update graphs (Timeliness and Fidelity).',
    clinicalTip: 'Never leave raw paper datasheets unentered in your bag for days. Same-day entry ensures accurate progress monitoring.'
  }
];

export interface SuggestedStudyGuideReview {
  moduleId: string;
  moduleTitle: string;
  chapterNumber: number;
  sectionTitle: string;
  focusConcept: string;
  summaryTakeaway: string;
  memoryPeg: string;
}

export const QUESTION_MODULE_MAPPING: Record<string, SuggestedStudyGuideReview> = {
  'rbt-q1': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Continuous Measurement Systems: Latency vs. Duration',
    focusConcept: 'Latency measures prompt-to-response initiation delay; Duration measures elapsed persistence.',
    summaryTakeaway: 'Latency is elapsed time from stimulus onset (SD/prompt) to the first movement of the response.',
    memoryPeg: 'Think "LATE": How late did she start after the prompt was delivered?'
  },
  'rbt-q2': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Discontinuous Measurement: Whole Interval Recording (WIR)',
    focusConcept: 'WIR requires 100% continuous engagement for entire interval; systematically underestimates duration.',
    summaryTakeaway: 'Looking away for even 1 second turns a whole interval into a non-occurrence (-). Best for increasing behaviors.',
    memoryPeg: 'POW-U: Partial Overestimates, Whole Underestimates!'
  },
  'rbt-q3': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Continuous Measurement: Inter-Response Time (IRT)',
    focusConcept: 'IRT is the elapsed time between the termination of one response and the onset of the next.',
    summaryTakeaway: 'As response rate increases, IRT decreases. IRT measures the rest interval between consecutive responses.',
    memoryPeg: 'IRT = In-Between Responses Time! End of R1 ➔ [IRT] ➔ Start of R2.'
  },
  'rbt-q4': {
    moduleId: 'module-6-other-graphs',
    moduleTitle: '6. Cumulative Records, Scatterplots, & Precision Charts',
    chapterNumber: 6,
    sectionTitle: 'Cumulative Records (Skinner): Interpreting Slope and Zero-Responding',
    focusConcept: 'Slope equals response rate; a flat horizontal line represents zero responding; line can never decrease.',
    summaryTakeaway: 'Responses accumulate continuously; when behavior pauses, the pen moves horizontally without stepping up.',
    memoryPeg: 'FLATLINE = ZERO RESPONSES! Cumulative records never go down.'
  },
  'rbt-q5': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Discontinuous Measurement: Partial Interval Recording (PIR)',
    focusConcept: 'PIR scores (+) if behavior occurs at ANY point; systematically overestimates duration.',
    summaryTakeaway: 'A single 1-second burst turns the entire 15-second interval into a (+). Used for behaviors targeted for reduction.',
    memoryPeg: 'POW-U: Partial Overestimates! Just a tiny PART triggers a (+).'
  },
  'rbt-q6': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Continuous Measurement: Rate vs. Raw Frequency',
    focusConcept: 'When observation session durations vary, raw count is misleading; Rate (count ÷ time) must be calculated.',
    summaryTakeaway: '6 instances in 15 min is 0.4/min; 6 instances in 30 min is 0.2/min. Rate dropped by 50% despite equal counts.',
    memoryPeg: 'RATE = RATIO! Count OVER Time. Whenever time changes, convert to Rate!'
  },
  'rbt-q7': {
    moduleId: 'module-3-graphing-rules',
    moduleTitle: '3. Graphing Techniques for Progress Monitoring: Line Graphs, Bar Charts, & Scatterplots',
    chapterNumber: 3,
    sectionTitle: 'Equal-Interval Line Graphs: Phase Change Lines & Non-Connecting Data Points',
    focusConcept: 'Solid vertical lines denote major phase changes; data points must NEVER be connected across condition lines.',
    summaryTakeaway: 'Connecting points across phase lines falsely implies behavioral continuity between different treatments.',
    memoryPeg: 'SOLID FOR SURGERY, DASHED FOR DIAL TWEAK. Never cross the line with your pen!'
  },
  'rbt-q8': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Permanent Product Recording: Concrete Environmental Outcomes',
    focusConcept: 'Measures behavior after occurrence by evaluating tangible physical residue left on environment.',
    summaryTakeaway: 'Frees observer to perform other instructional duties while student completes math sheets or tasks.',
    memoryPeg: 'PERMANENT = Leaves a physical trace you can inspect later!'
  },
  'rbt-q9': {
    moduleId: 'module-2-visual-tracking',
    moduleTitle: '2. Core Data Collection Methods for Visual Tracking Metrics',
    chapterNumber: 2,
    sectionTitle: 'Operational Definitions: The Stranger Test & Objective Terminology',
    focusConcept: 'Operational definitions must be Objective, Clear, and Complete, avoiding subjective mentalisms.',
    summaryTakeaway: 'Refers strictly to observable physical movement and anatomy with clear onset, offset, and non-examples.',
    memoryPeg: 'THE STRANGER TEST: Could a stranger off the street record it with 100% agreement?'
  },
  'rbt-q10': {
    moduleId: 'module-2-visual-tracking',
    moduleTitle: '2. Core Data Collection Methods for Visual Tracking Metrics',
    chapterNumber: 2,
    sectionTitle: 'Task A-1 Preparation for Data Collection',
    focusConcept: 'First step is reading operational definitions, reviewing prior data trends, and prepping materials.',
    summaryTakeaway: 'Always review written BCBA protocols and verify battery/timer function before greeting the client.',
    memoryPeg: 'PREPARE: Plan read, Resources ready, Environment checked!'
  },
  'rbt-q11': {
    moduleId: 'module-4-visual-analysis',
    moduleTitle: '4. Visual Analysis: Level, Trend, & Variability',
    chapterNumber: 4,
    sectionTitle: 'The Visual Analysis Triad: Trend Direction & Slope',
    focusConcept: 'Trend describes the directional trajectory (ascending, descending, zero/flat) of the data path.',
    summaryTakeaway: 'Level is central tendency height on Y-axis; Trend is angle/direction; Variability is bounce.',
    memoryPeg: 'THREE PILLARS: Level (Height), Trend (Angle), Variability (Bounce)!'
  },
  'rbt-q12': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Discontinuous Measurement: Momentary Time Sampling (MTS)',
    focusConcept: 'MTS only records behavior at the exact instant the interval terminates (at the beep).',
    summaryTakeaway: 'Best for busy teachers managing multiple students; does not systematically over- or under-estimate.',
    memoryPeg: 'MOMENTARY = At the exact MOMENT the beep sounds!'
  },
  'rbt-q13': {
    moduleId: 'module-2-visual-tracking',
    moduleTitle: '2. Core Data Collection Methods for Visual Tracking Metrics',
    chapterNumber: 2,
    sectionTitle: 'Inter-Observer Agreement (IOA): Total Count Formula & Standards',
    focusConcept: 'Total Count IOA = (Smaller Count ÷ Larger Count) × 100. Standard benchmark is ≥ 80% on 20-33% of sessions.',
    summaryTakeaway: '8 ÷ 10 × 100 = 80%. Validates measurement reliability and guards against observer drift.',
    memoryPeg: 'THE PYRAMID: Smaller count on TOP, larger count on the BOTTOM!'
  },
  'rbt-q14': {
    moduleId: 'module-3-graphing-rules',
    moduleTitle: '3. Graphing Techniques for Progress Monitoring: Line Graphs, Bar Charts, & Scatterplots',
    chapterNumber: 3,
    sectionTitle: 'Graph Anatomy: Abscissa (X-Axis) vs. Ordinate (Y-Axis)',
    focusConcept: 'Horizontal X-axis is the Abscissa (Time/Sessions); Vertical Y-axis is the Ordinate (Behavior Dimension).',
    summaryTakeaway: 'The Y-axis represents the dependent variable (count, duration, percent) and must begin at zero.',
    memoryPeg: 'COGNITIVE TRICK: The letter \'Y\' is tall and vertical (Ordinate)! \'X\' lies flat (Abscissa).'
  },
  'rbt-q15': {
    moduleId: 'module-5-progress-monitoring',
    moduleTitle: '5. Progress Monitoring Tools & Clinical Decision Rules',
    chapterNumber: 5,
    sectionTitle: 'Progress Monitoring: The 4-Point Decision Rule & Aim Lines',
    focusConcept: '4 consecutive points below Aim Line requires immediate intervention modification.',
    summaryTakeaway: 'Never wait 6 months for an annual IEP review; data-based rules trigger timely clinical adaptations.',
    memoryPeg: '4 IN A ROW? CHANGE THE SHOW! 4 below the line = redesign intervention now.'
  },
  'rbt-q16': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Continuous Measurement: Total Duration vs. Duration per Occurrence',
    focusConcept: 'Duration measures total elapsed time from behavior onset to termination using a stopwatch.',
    summaryTakeaway: 'Ideal for continuous sensory behaviors, tantrums, or academic engagement where persistence matters.',
    memoryPeg: 'DURATION = HOW LONG? Stopwatch starts on onset, clicks stop on offset.'
  },
  'rbt-q17': {
    moduleId: 'module-6-other-graphs',
    moduleTitle: '6. Cumulative Records, Scatterplots, & Precision Charts',
    chapterNumber: 6,
    sectionTitle: 'Behavioral Scatterplots: Detecting Time-of-Day Clusters',
    focusConcept: 'Scatterplots organize data across time-of-day blocks and calendar days to reveal temporal patterns.',
    summaryTakeaway: 'Uncovers circadian, hunger, and environmental glare triggers clustering at specific times.',
    memoryPeg: 'SCATTERPLOT = SCATTERED ACROSS THE DAY! Tells you WHEN behavior strikes.'
  },
  'rbt-q18': {
    moduleId: 'module-2-visual-tracking',
    moduleTitle: '2. Core Data Collection Methods for Visual Tracking Metrics',
    chapterNumber: 2,
    sectionTitle: 'Operational Definitions: The Video Camera Test vs. Mentalisms',
    focusConcept: 'Notes must describe observable motor topography and count/duration, rejecting circular mentalistic terms.',
    summaryTakeaway: '"Fell to floor and screamed for 4 minutes" passes; "jealous" and "bad attitude" are prohibited.',
    memoryPeg: 'VIDEO CAMERA TEST: A video camera records motor actions, not internal feelings!'
  },
  'rbt-q19': {
    moduleId: 'module-1-measurement',
    moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
    chapterNumber: 1,
    sectionTitle: 'Continuous Measurement: Percentage of Opportunities & Trials to Criterion',
    focusConcept: 'Percentage = (Number of correct responses ÷ Total opportunities) × 100. Standard in discrete trials.',
    summaryTakeaway: '8 correct out of 10 trials = 80% accuracy. Used to establish 3-session mastery criteria.',
    memoryPeg: 'PERCENTAGE: Part ÷ Whole × 100! 8 out of 10 = 80%.'
  },
  'rbt-q20': {
    moduleId: 'module-3-graphing-rules',
    moduleTitle: '3. Graphing Techniques for Progress Monitoring: Line Graphs, Bar Charts, & Scatterplots',
    chapterNumber: 3,
    sectionTitle: 'Data Entry Fidelity: Same-Day Updating & Progress Monitoring',
    focusConcept: 'Data must be entered same-day before subsequent clinical sessions occur to support timely analysis.',
    summaryTakeaway: 'Delayed data entry blinds the clinical team to regressions or rapid skill mastery.',
    memoryPeg: 'SAME DAY DATA! Behavior moves fast; if you wait a week, the student is stuck.'
  }
};

export function getSuggestedModuleForQuestion(q: RBTQuestion): SuggestedStudyGuideReview {
  if (QUESTION_MODULE_MAPPING[q.id]) {
    return QUESTION_MODULE_MAPPING[q.id];
  }

  // Fallback by taskListCode if novel questions are introduced
  switch (q.taskListCode) {
    case 'A-1':
    case 'A-6':
      return {
        moduleId: 'module-2-visual-tracking',
        moduleTitle: '2. Core Data Collection Methods for Visual Tracking Metrics',
        chapterNumber: 2,
        sectionTitle: 'Operational Definitions, Checklists, & Task A-1 Preparation',
        focusConcept: 'Objective, clear, and complete behavioral definitions and IOA validation standards.',
        summaryTakeaway: 'Review the Stranger Test, Dead Man\'s Test, and preparation checklists.',
        memoryPeg: 'Passes the Stranger Test!'
      };
    case 'A-2':
    case 'A-3':
    case 'A-4':
      return {
        moduleId: 'module-1-measurement',
        moduleTitle: '1. Data Collection Systems & Measurement Dimensions',
        chapterNumber: 1,
        sectionTitle: 'Continuous & Discontinuous Measurement Systems',
        focusConcept: 'Rate, Duration, Latency, IRT, WIR, PIR, and MTS scoring criteria.',
        summaryTakeaway: 'Remember WIR underestimates and PIR overestimates behavioral duration.',
        memoryPeg: 'POW-U: Partial Overestimates, Whole Underestimates!'
      };
    case 'A-5':
    default:
      return {
        moduleId: 'module-3-graphing-rules',
        moduleTitle: '3. Graphing Techniques for Progress Monitoring: Line Graphs, Bar Charts, & Scatterplots',
        chapterNumber: 3,
        sectionTitle: 'Equal-Interval Graph Construction & Progress Monitoring',
        focusConcept: 'Visual analysis of level, trend, variability, phase change lines, and aim lines.',
        summaryTakeaway: 'Do not connect points across phase change lines or prolonged time absences.',
        memoryPeg: 'Solid for major phase changes, dashed for minor modifications.'
      };
  }
}
