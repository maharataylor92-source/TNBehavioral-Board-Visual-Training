import { ExamQuestion } from '../types';

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    category: 'Measurement Systems',
    scenario: 'A behavior specialist in a Tennessee public school is designing a data collection protocol for a 2nd-grade autistic student. The team aims to INCREASE the student’s continuous visual fixation on literacy materials during 10-minute independent reading stations. The classroom assistant can only observe the student for 10-second intervals.',
    question: 'Which measurement system is the MOST appropriate and conservative method to ensure the team does not prematurely conclude the student has mastered sustained visual reading?',
    options: [
      'Partial Interval Recording, because it captures any brief glance at the book.',
      'Whole Interval Recording, because it underestimates behavior duration by requiring visual gaze throughout the entire 10 seconds.',
      'Momentary Time Sampling, because it overestimates duration consistently.',
      'Frequency counting of eye blinks.'
    ],
    correctIndex: 1,
    explanation: 'Whole Interval Recording (WIR) requires the target behavior to persist continuously for the entire duration of the interval. Because brief glances away result in scoring a non-occurrence, WIR systematically UNDERESTIMATES duration. When targeting a behavior for INCREASE (such as sustained visual engagement), WIR is the most conservative metric because it ensures the student is truly maintaining sustained focus before credit is given.',
    tnBoardReference: 'TN Board of Applied Behavior Analysis Rule 1180-02 (Measurement Standards) & Cooper, Heron, & Heward (2020) Ch. 4.',
    clinicalRelevance: 'Partial interval would score the interval as positive even if the child looked at the book for only 1 second out of 10, giving false inflated data.'
  },
  {
    id: 'q2',
    category: 'Progress Monitoring Rules',
    scenario: 'During an IEP progress monitoring cycle for a neurodivergent learner, an Aim Line was constructed from the baseline median (4 instances/session) to the target goal (14 instances/session at Session 12). During the implementation of a high-contrast visual schedule, data for Sessions 6, 7, 8, and 9 were recorded as 5, 4, 6, and 5 instances respectively—all falling strictly below the Aim Line.',
    question: 'According to the standard 4-Point Progress Monitoring Decision Rule adopted in Tennessee behavioral health and special education, what action MUST the team take?',
    hasGraph: true,
    graphType: 'line',
    graphData: {
      baseline: [4, 5, 3, 4, 4],
      intervention: [5, 4, 6, 5],
      aimLine: { start: 4, end: 14 },
      yLabel: 'Target Responses / Session'
    },
    options: [
      'Maintain the intervention without alteration until the annual IEP review meeting in 8 months.',
      'Immediately modify or revise the intervention, evaluate treatment fidelity, and examine environmental visual supports.',
      'Accelerate progress by fading the visual schedule immediately.',
      'Conclude that the student is incapable of learning the skill and terminate the goal.'
    ],
    correctIndex: 1,
    explanation: 'The 4-Point Decision Rule states that if 4 consecutive data points fall below the Aim Line (for a behavior targeted for increase), the intervention is failing to produce the required trajectory of progress. The team must NOT wait for the annual review; they must evaluate treatment integrity, revise the antecedent supports (e.g. check visual contrast or prompt hierarchy), or introduce stronger reinforcement.',
    tnBoardReference: 'Tennessee Department of Education Special Education Framework & Progress Monitoring Guidelines (IDEA Part B).',
    clinicalRelevance: 'Prevents educational stagnation and ensures rapid clinical adaptation for neurodivergent learners.'
  },
  {
    id: 'q3',
    category: 'Graph Construction & Rules',
    scenario: 'A clinician is creating an equal-interval line graph representing a student’s transition latency. Between Session 10 and Session 11, the school was closed for a two-week winter holiday break. Furthermore, at Session 15, the team introduced a completely new sensory visual schedule intervention.',
    question: 'Under standard single-case graphing conventions, where should the data path line NOT be connected?',
    options: [
      'Between Session 10 and Session 11 (time break), AND between Session 14 and Session 15 across the condition change line.',
      'Only between the first two data points of baseline.',
      'Data points must always be connected continuously regardless of holidays or phase changes.',
      'Only across days of the week when the student was present.'
    ],
    correctIndex: 0,
    explanation: 'Single-case graphing conventions strictly prohibit connecting data points: (1) across condition change lines (phases), (2) across significant breaks in time (e.g., multi-week absences or school holidays), (3) across scale breaks, and (4) across discontinuous data points. Drawing lines across these boundaries falsely implies continuous measurement and continuous behavioral continuity.',
    tnBoardReference: 'Cooper, Heron, & Heward (2020) Ch. 5; Gast & Ledford Single Case Methodology.',
    clinicalRelevance: 'Connecting across breaks obscures the effect of holiday regression and obscures phase boundaries.'
  },
  {
    id: 'q4',
    category: 'Cumulative Records',
    scenario: 'A supervisor presents a cumulative record tracking a non-speaking student’s selection of picture symbols on a visual communication board. Across a 20-minute independent work period, the cumulative line runs completely flat and horizontal.',
    question: 'How should the clinician interpret this flat horizontal segment on a cumulative record?',
    hasGraph: true,
    graphType: 'cumulative',
    graphData: {
      baseline: [0, 2, 5, 8, 8, 8, 8, 8, 12, 16],
      intervention: [],
      yLabel: 'Cumulative AAC Selections'
    },
    options: [
      'The student is selecting symbols at a high, steady rate.',
      'The student has engaged in negative responding or unlearned the target skill.',
      'Zero responding occurred during that time interval; no responses were logged.',
      'The recording device experienced a paper malfunction.'
    ],
    correctIndex: 2,
    explanation: 'On a cumulative record, the slope of the line reflects the rate of responding. A steep slope indicates a high rate; a gentle slope indicates a low rate; and a completely flat horizontal line indicates ZERO responding (the response pen did not step upward). Downward lines are mathematically impossible because responses cannot be subtracted.',
    tnBoardReference: 'Skinner, B.F. (1938/1966) Cumulative Record Analysis & TN Board Assessment Competency Area 2.',
    clinicalRelevance: 'Identifies behavioral pauses, task avoidance, or sensory disengagement periods.'
  },
  {
    id: 'q5',
    category: 'Visual Analysis',
    scenario: 'A behavior analyst is inspecting baseline data prior to introducing a visual timer intervention for off-task gaze aversion. The baseline values across 5 sessions are: 28 min, 12 min, 31 min, 8 min, and 29 min.',
    question: 'Which statement accurately describes the baseline data and the ethical next step according to Tennessee Board standards?',
    options: [
      'The baseline shows low variability with a clear ascending trend; introduce intervention immediately.',
      'The baseline exhibits extreme variability without stability; the clinician should hold off on intervention and investigate uncontrolled environmental variables first.',
      'The baseline is stable; the clinician should immediately document mastery.',
      'Variability does not matter in single-case design as long as 5 data points exist.'
    ],
    correctIndex: 1,
    explanation: 'The baseline data bounces wildly between 8 minutes and 31 minutes, demonstrating severe variability and lack of stability. In single-case research and ethical ABA practice, interventions should not be implemented into an unstable, highly variable baseline because you cannot attribute subsequent changes to the independent variable. The clinician must stabilize the baseline first by controlling environmental variables.',
    tnBoardReference: 'TN Board Rule 1180-04 (Evidence-Based Practice and Assessment Validity).',
    clinicalRelevance: 'Introducing an intervention during unstable baseline creates uninterpretable confounding data.'
  },
  {
    id: 'q6',
    category: 'Visual Tracking Metrics',
    scenario: 'A special education team writes the following target behavior for an autistic student with visual hypersensitivity: "Student will pay good attention to the visual schedule during morning group without getting distracted."',
    question: 'Which revision represents a board-compliant, measurable operational definition passing the "Stranger Test"?',
    options: [
      'Student will be attentive and demonstrate respect toward the teacher’s visual board.',
      'Student will orient their head and gaze within 30 degrees of the personal visual schedule strip within 5 seconds of the teacher’s verbal cue "Check schedule" for at least 3 consecutive seconds.',
      'Student will listen attentively and avoid daydreaming when visual icons are shown.',
      'Student will show positive internal motivation when reading schedule cards.'
    ],
    correctIndex: 1,
    explanation: 'A compliant operational definition must be objective, clear, and complete (passing the Stranger Test). Option B specifies observable bodily action (head and gaze orientation), verifiable spatial boundaries (within 30 degrees), clear antecedent trigger, quantifiable latency (within 5 seconds), and minimum duration (3 continuous seconds). "Pay attention", "respect", and "daydreaming" are subjective inferences.',
    tnBoardReference: 'TN Board Behavior Analyst Scope of Practice & BACB 5th Edition Task List C-1.',
    clinicalRelevance: 'Enables classroom aides, therapists, and substitutes to record identical, reliable data.'
  },
  {
    id: 'q7',
    category: 'Visual Analysis',
    scenario: 'A student targeting on-task visual gaze tracking has baseline data points of [2, 3, 2, 4, 3] minutes. Following the introduction of a Typoscope tracking overlay, the 6 intervention data points are [5, 6, 7, 6, 8, 9] minutes.',
    question: 'What is the Percentage of Non-Overlapping Data (PND), and how is this intervention clinically classified?',
    options: [
      'PND = 50% (Questionable effectiveness)',
      'PND = 83.3% (Moderately effective)',
      'PND = 100% (Highly effective intervention)',
      'PND = 0% (Ineffective intervention)'
    ],
    correctIndex: 2,
    explanation: 'For a behavior targeted to increase, PND is calculated by finding the highest baseline point (which is 4) and counting how many intervention points strictly exceed 4. The intervention points are [5, 6, 7, 6, 8, 9]—all 6 points exceed 4! PND = (6 ÷ 6) × 100% = 100%. A PND greater than 90% is classified as "Highly Effective."',
    tnBoardReference: 'Scruggs, Mastropieri, & Casto (1987) PND Metric & Single-Case Evaluation Standards.',
    clinicalRelevance: 'Confirms that the visual overlay intervention produced an unmistakable, non-overlapping improvement.'
  },
  {
    id: 'q8',
    category: 'Measurement Systems',
    scenario: 'A therapist needs to measure the delay between when a paraprofessional holds up a yellow "Stop" icon and when a student with ADHD ceases running and looks at the card.',
    question: 'Which continuous measurement dimension is being recorded?',
    options: [
      'Duration',
      'Inter-Response Time (IRT)',
      'Latency',
      'Momentary Time Sampling'
    ],
    correctIndex: 2,
    explanation: 'Response latency measures the elapsed time from the onset of an antecedent stimulus (presenting the yellow "Stop" visual icon) to the initiation of the target response (looking and stopping). Duration measures how long the response lasts once it has already begun.',
    tnBoardReference: 'Cooper, Heron, & Heward Ch. 4 (Continuous Measurement: Response Latency).',
    clinicalRelevance: 'Critical for measuring processing speed and transition readiness in neurodivergent learners.'
  },
  {
    id: 'q9',
    category: 'Measurement Systems',
    scenario: 'Two observers independently track an autistic student’s visual engagement during ten 1-minute intervals. Observers agree on intervals 1, 2, 4, 5, 7, 8, 9, and 10. They disagree on intervals 3 and 6.',
    question: 'What is the Interval-by-Interval Inter-Observer Agreement (IOA), and does it meet Tennessee Board research standards?',
    options: [
      '70% IOA; does not meet the standard minimum of 80%.',
      '80% IOA; meets the standard acceptable threshold of >= 80%.',
      '90% IOA; exceeds requirements.',
      '20% IOA; invalid.'
    ],
    correctIndex: 1,
    explanation: 'Interval-by-Interval IOA = [Agreements ÷ (Agreements + Disagreements)] × 100%. Here, agreements = 8, disagreements = 2, total = 10. (8 ÷ 10) × 100% = 80%. In behavioral health and board exam standards, an IOA of at least 80% is the accepted benchmark for acceptable measurement reliability.',
    tnBoardReference: 'TN Board Rule 1180 Measurement Reliability Standards & Page, Iwata, & Reid (1982).',
    clinicalRelevance: 'Verifies that multiple staff members are applying the operational definition consistently.'
  },
  {
    id: 'q10',
    category: 'Graph Construction & Rules',
    scenario: 'On an equal-interval line graph, a behavior specialist places a vertical line between Session 5 and Session 6. The line is drawn as a dashed line rather than a solid line.',
    question: 'What does a DASHED vertical condition line conventionally signify in single-case visual displays?',
    options: [
      'A complete reversal back to baseline.',
      'A minor modification to an existing intervention (e.g., prompt fading, parameter tweak, or setting change).',
      'The end of the school year.',
      'A data recording error made by the observer.'
    ],
    correctIndex: 1,
    explanation: 'In single-case graphing conventions, a SOLID vertical line designates a major phase change (introduction of a completely new independent variable, such as moving from Baseline to Differential Reinforcement). A DASHED vertical line signifies a minor condition change, such as adjusting a schedule parameter, fading prompt delay from 2s to 4s, or shifting instructors.',
    tnBoardReference: 'Cooper, Heron, & Heward (2020) Graph Construction Rules (Ch. 5).',
    clinicalRelevance: 'Clarifies whether changes represent a new treatment or fine-tuning of an existing support.'
  },
  {
    id: 'q11',
    category: 'Visual Tracking Metrics',
    scenario: 'An SLP and BCBA are evaluating a 5-year-old student with Cortical Visual Impairment (CVI) and autism. The child exhibits difficulty locating target communication symbols when displayed on a crowded white tablet background.',
    question: 'Which evidence-based visual adaptation should be reflected in the baseline-to-intervention phase change to enhance visual tracking metrics?',
    options: [
      'Increase the array to 60 small monochrome line drawings to test visual resilience.',
      'Utilize high-contrast colors (e.g. yellow or red border on black background) and reduce the visual array complexity to 4 distinct symbols.',
      'Use bright flashing strobe lights behind the icons.',
      'Switch entirely to purely auditory prompts with no visual cues.'
    ],
    correctIndex: 1,
    explanation: 'Individuals with Cortical Visual Impairment (CVI) and autism frequently struggle with visual complexity (crowding) and low contrast. Evidence-based CVI interventions incorporate preferred high-contrast colors (typically yellow or red), high figure-ground contrast (black backdrop), increased icon spacing, and reduced array complexity to facilitate functional visual fixation and saccadic localization.',
    tnBoardReference: 'Roman-Lantzy (2018) Cortical Visual Impairment Framework & TN DIDD Guidelines.',
    clinicalRelevance: 'Directly informs the intervention phase label and expected upward trend in visual fixations.'
  },
  {
    id: 'q12',
    category: 'Visual Analysis',
    scenario: 'A clinician is computing the Split-Middle Line of Progress to objectively determine the trend of 8 data points in an intervention phase. The 8 data points are divided into two equal halves of 4 points each.',
    question: 'What is the correct next step in the Split-Middle calculation procedure?',
    options: [
      'Average all 8 points together and draw a horizontal line.',
      'Find the median session coordinate and median response value for each half, plot these two quarter-intersect points, and draw a line through them.',
      'Draw a line connecting the very first point directly to the very last point.',
      'Discard the highest and lowest points and connect the rest.'
    ],
    correctIndex: 1,
    explanation: 'The Split-Middle Line of Progress (Quarter-Intersect method) calculates trend by: (1) dividing the phase in half along the X-axis, (2) finding the median coordinate (intersection of mid-session and mid-value) for the first half, (3) finding the median coordinate for the second half, and (4) drawing a straight line through the two quarter-intersect points, adjusting up or down so half the points fall above and half fall below.',
    tnBoardReference: 'White & Haring (1980) Exceptional Teaching & BACB 5th Edition Task List D-2.',
    clinicalRelevance: 'Removes subjective visual bias when evaluating whether an intervention is truly working.'
  },
  {
    id: 'q13',
    category: 'RBT Role & Graphing (A-5)',
    scenario: 'An RBT in Tennessee has been graphing daily session data on an autistic student’s visual schedule adherence. After plotting today’s point, the RBT observes that the last 4 consecutive session points have all fallen strictly below the aim line established in the client’s Behavior Intervention Plan (BIP).',
    question: 'Under BACB Task List item A-5 and RBT professional ethics, what is the RBT’s mandatory next step?',
    options: [
      'Change the student’s visual schedule format immediately without consulting anyone.',
      'Delete the 4 low data points from the graph so the student does not get penalized.',
      'Immediately notify and communicate the trend to the supervising BCBA/BCaBA so the clinical team can re-evaluate the intervention.',
      'Stop collecting data for the rest of the month.'
    ],
    correctIndex: 2,
    explanation: 'Under BACB RBT Task List item A-5 (Enter data and update graphs) and RBT Ethics Code 2.01, RBTs are responsible for graphing data accurately and communicating clinical trends to their supervisor. An RBT must NOT independently redesign an intervention plan without BCBA direction, nor alter data. When the 4-point rule alert triggers, notifying the supervising BCBA ensures timely clinical adjustments.',
    tnBoardReference: 'BACB RBT Task List (2nd Ed.) A-5 & RBT Ethics Code 2.01.',
    clinicalRelevance: 'Empowers RBTs to act as the primary frontline eyes and ears for the clinical team.'
  },
  {
    id: 'q14',
    category: 'Permanent Product (A-4)',
    scenario: 'A supervising BCBA asks an RBT: "Can we use permanent product recording to measure how many minutes Maya maintains visual gaze on her reading worksheet during center rotations?"',
    question: 'How should the RBT correctly answer based on behavioral measurement principles?',
    options: [
      'Yes, because reading a worksheet always counts as permanent product.',
      'No, because the act of visual eye gaze itself leaves no tangible, physical outcome on the environment; it must be directly observed unless a continuous video recording is reviewed.',
      'Yes, by counting how many times the student smiled.',
      'No, because permanent product can only measure aggressive behaviors.'
    ],
    correctIndex: 1,
    explanation: 'Permanent product recording measures behavior AFTER it has occurred by evaluating the durable physical outcome left behind in the environment (e.g., written math answers, assembled puzzles). The physiological act of visual eye gaze dissipates instantly and leaves no tangible mark on the paper. Therefore, visual tracking requires direct observation (duration or interval recording) unless permanent video is captured.',
    tnBoardReference: 'BACB RBT Task List (2nd Ed.) A-4 (Permanent Product Recording).',
    clinicalRelevance: 'Crucial distinction for RBTs: do not attempt to score visual gaze retrospectively without an active observation protocol.'
  },
  {
    id: 'q15',
    category: 'Preparation for Data Collection (A-1)',
    scenario: 'An RBT arrives at a pediatric clinic to begin a 2-hour behavioral session with a neurodivergent client. The client is working on visual tracking of picture communication cards.',
    question: 'What is the FIRST action the RBT must take to comply with Task List item A-1 (Prepare for data collection)?',
    options: [
      'Immediately deliver the first instructional SD before getting any materials ready.',
      'Read the operational definition in the client’s binder, verify target mastery criteria, and ensure all data sheets, stopwatches, and visual stimuli are gathered and functional.',
      'Ask the client’s parent to collect the data.',
      'Estimate the data at the end of the session based on memory.'
    ],
    correctIndex: 1,
    explanation: 'Task List item A-1 explicitly defines preparation: before approaching the client, the RBT must review the current operational definitions, confirm which behaviors are targeted, calibrate timers/clickers, and set up all antecedent visual materials. Never start instruction without recording tools ready.',
    tnBoardReference: 'BACB RBT Task List (2nd Ed.) A-1 (Prepare for Data Collection).',
    clinicalRelevance: 'Prevents missed intervals and ensures zero data loss during high-tempo instruction.'
  },
  {
    id: 'q16',
    category: 'Graph Construction & Rules',
    scenario: 'On an RBT examination graph question, an equal-interval line graph is displayed with "Sessions" labeled along the horizontal bottom axis and "Duration of Visual Tracking (Minutes)" along the vertical left axis.',
    question: 'What are the technical scientific names for the horizontal (X) and vertical (Y) axes respectively?',
    options: [
      'Horizontal is Ordinate; Vertical is Abscissa',
      'Horizontal is Abscissa; Vertical is Ordinate',
      'Horizontal is Trendline; Vertical is Aim Line',
      'Horizontal is Scatterplot; Vertical is Histogram'
    ],
    correctIndex: 1,
    explanation: 'Remember the memory hook: "Ab-SCISS-a lies flat on the desk like scissors" = Horizontal (X-axis). "Ordinate reaches Overhead to the sky" = Vertical (Y-axis).',
    tnBoardReference: 'Cooper, Heron, & Heward (2020) Ch. 5 & BACB RBT Task List A-5.',
    clinicalRelevance: 'Guarantees the RBT correctly identifies axis labels and scales on state board exams.'
  }
];
