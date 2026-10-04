import { StudySection } from '../types';

export const STUDY_MODULES: StudySection[] = [
  {
    id: 'module-1-measurement',
    title: '1. Data Collection Systems & Measurement Dimensions',
    subtitle: 'Continuous vs. Discontinuous Measurement in Neurodivergent Behavioral Assessment',
    readTimeMinutes: 8,
    iconName: 'ClipboardCheck',
    keyTakeaways: [
      'Continuous measurement (Rate, Duration, Latency, IRT) records every instance; discontinuous samples intervals.',
      'Partial Interval Recording OVERESTIMATES behavior duration (best for behaviors targeted for reduction like visual stimming/wandering).',
      'Whole Interval Recording UNDERESTIMATES behavior duration (best for behaviors targeted for increase like sustained visual gaze).',
      'Momentary Time Sampling is practical in busy classrooms because data is only recorded at the instant the interval timer buzzes.',
      'Permanent Product recording measures concrete physical outcomes without requiring direct real-time observation.'
    ],
    tnBoardNote: 'TN Board Rule 1180 emphasizes selecting measurement systems that are direct, sensitive to behavioral change, and clinically feasible without compromising client safety or instructional fidelity.',
    neurodivergentApplication: 'For students with sensory sensitivities or ADHD, continuous duration recording of visual focus can be obtrusive; momentary time sampling or task-segmented latency prevents examiner intrusion while preserving high validity.',
    contentHtml: `
      <div class="space-y-6 text-slate-700 leading-relaxed">
        <p class="text-base">
          Accurate data collection is the cornerstone of applied behavior analysis and special education progress monitoring. On Tennessee State Board examinations, questions routinely test your ability to <strong>select the correct measurement system</strong> for a specific clinical scenario and recognize <strong>measurement artifacts</strong> (over- and under-estimation errors).
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">1. Continuous Measurement Systems</h3>
        <p>
          Continuous measurement detects and logs every single occurrence of the target behavior during an observation period. These systems provide the highest accuracy:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">Frequency / Count</h4>
            <p class="text-xs text-slate-600 mb-2">Total count of discrete behaviors with clear start and stop points.</p>
            <div class="text-xs font-mono bg-slate-50 p-2 rounded text-slate-800">Example: Liam shifted visual gaze away from his worksheet 8 times during a 15-minute literacy block.</div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">Rate (Count per Unit Time)</h4>
            <p class="text-xs text-slate-600 mb-2">Count divided by total observation time. Required when session durations vary!</p>
            <div class="text-xs font-mono bg-slate-50 p-2 rounded text-slate-800">Formula: Rate = Count ÷ Time (e.g., 12 saccadic shifts in 6 minutes = 2.0 shifts/min).</div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">Duration (Total / Per-Occurrence)</h4>
            <p class="text-xs text-slate-600 mb-2">The total elapsed time a behavior persists from initiation to termination.</p>
            <div class="text-xs font-mono bg-slate-50 p-2 rounded text-slate-800">Example: Maya visually tracked a picture book page continuously for 4 minutes and 15 seconds.</div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">Latency (Stimulus to Response Onset)</h4>
            <p class="text-xs text-slate-600 mb-2">Time elapsed between presenting an antecedent prompt and the student initiating the behavior.</p>
            <div class="text-xs font-mono bg-slate-50 p-2 rounded text-slate-800">Exam Trap: Latency measures the delay BEFORE behavior begins, NOT how long the behavior lasts!</div>
          </div>

          <div class="p-4 bg-white rounded-lg border border-slate-200 md:col-span-2">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">Inter-Response Time (IRT)</h4>
            <p class="text-xs text-slate-600 mb-2">The time elapsed between the termination of one response and the onset of the very next response.</p>
            <div class="text-xs font-mono bg-slate-50 p-2 rounded text-slate-800">Key Relationship: As Rate increases, IRT decreases! High-rate behaviors exhibit short IRTs.</div>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">2. Discontinuous (Time-Sampling) Measurement Systems</h3>
        <p>
          Discontinuous measurement divides an observation session into equal time intervals (e.g., 10-second or 1-minute blocks) and samples whether the behavior occurs. These systems are prone to measurement bias:
        </p>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="p-2.5 font-semibold border-b border-slate-200">Measurement Method</th>
                <th class="p-2.5 font-semibold border-b border-slate-200">Scoring Criterion</th>
                <th class="p-2.5 font-semibold border-b border-slate-200">Measurement Bias (Exam Alert)</th>
                <th class="p-2.5 font-semibold border-b border-slate-200">Best Clinical Use</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr>
                <td class="p-2.5 font-medium text-slate-900">Whole Interval Recording (WIR)</td>
                <td class="p-2.5 text-slate-600">Mark "+" ONLY if behavior occurs throughout the ENTIRE duration of the interval.</td>
                <td class="p-2.5 font-semibold text-rose-700">UNDERESTIMATES total duration and frequency of behavior.</td>
                <td class="p-2.5 text-slate-600">Targeting behaviors to INCREASE (e.g., continuous visual gaze on task).</td>
              </tr>
              <tr>
                <td class="p-2.5 font-medium text-slate-900">Partial Interval Recording (PIR)</td>
                <td class="p-2.5 text-slate-600">Mark "+" if behavior occurs at ANY moment during the interval, even for 0.5 seconds.</td>
                <td class="p-2.5 font-semibold text-rose-700">OVERESTIMATES total duration and frequency of behavior.</td>
                <td class="p-2.5 text-slate-600">Targeting behaviors to DECREASE (e.g., visual stimming, gaze disengagement, elopement).</td>
              </tr>
              <tr>
                <td class="p-2.5 font-medium text-slate-900">Momentary Time Sampling (MTS)</td>
                <td class="p-2.5 text-slate-600">Mark "+" ONLY if behavior is occurring at the EXACT instant the interval ends.</td>
                <td class="p-2.5 font-semibold text-emerald-700">Does not systematically over- or under-estimate; random sampling error.</td>
                <td class="p-2.5 text-slate-600">Classroom teachers managing multiple neurodivergent students simultaneously.</td>
              </tr>
              <tr>
                <td class="p-2.5 font-medium text-slate-900">PLACHECK (Planned Activity Check)</td>
                <td class="p-2.5 text-slate-600">Counts number of students engaged in target visual/academic activity at interval end.</td>
                <td class="p-2.5 text-slate-600">Group-level sampling efficiency.</td>
                <td class="p-2.5 text-slate-600">Special ed group work (e.g., % of students visually tracking morning board).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
          <strong class="font-semibold block mb-1">State Board Exam Rule of Thumb:</strong>
          If an exam item asks: "A clinician wants to increase a student's on-task visual reading focus. Which interval method provides the most conservative estimate that won't give false confidence of mastery?"
          <strong>Answer: Whole Interval Recording</strong>, because if the student looks away for even 1 second during a 10-second interval, the entire interval is scored as non-occurrence!
        </div>
      </div>
    `
  },
  {
    id: 'module-2-visual-tracking',
    title: '2. Core Data Collection Methods for Visual Tracking Metrics',
    subtitle: 'Direct Observation, Checklists, Rating Scales, Operational Definitions, & Inter-Observer Reliability',
    readTimeMinutes: 12,
    iconName: 'Eye',
    keyTakeaways: [
      'Visual tracking metrics must be captured through multi-method assessment: Direct Observation (empirical truth), Checklists (skill sequences), and Rating Scales (informant context).',
      'Direct observation includes continuous gaze duration, saccadic orientation latency, and discontinuous time-sampling (WIR, PIR, MTS).',
      'Skill Progression Checklists break visual tracking into developmental hierarchies (Fixation → Smooth Pursuit → Saccades → Joint Attention).',
      'Rating scales (e.g. Likert engagement or sensory profiles) provide subjective screening, but CANNOT replace direct empirical observation for progress monitoring.',
      'Target behaviors must satisfy the "Stranger Test" and "Dead Man\'s Test" with objective, clear, and complete boundaries.',
      'Inter-Observer Agreement (IOA) is mandatory on 20% to 33% of sessions with a minimum 80% benchmark to prevent observer drift and expectancy bias.'
    ],
    tnBoardNote: 'Under TN Board Rule 1180-02 & Tennessee Department of Intellectual & Developmental Disabilities (DIDD) guidelines, behavior plans require objective operational definitions and documented inter-observer reliability (IOA >= 80%) before modifying client interventions.',
    neurodivergentApplication: 'Neurodivergent learners (autism, ADHD, CVI) often demonstrate irregular visual pursuit due to sensory processing. Combining direct stopwatch timing with task-analytic prompt checklists ensures accommodations (e.g. high-contrast borders) are systematically evaluated.',
    contentHtml: `
      <div class="space-y-6 text-slate-700 leading-relaxed">
        <p class="text-base">
          In behavioral development and pediatric health, visual tracking is foundational for reading, communication access (AAC), and social interaction. A comprehensive behavioral assessment protocol integrates three core data collection methodologies: <strong>Direct Observation</strong>, <strong>Checklists</strong>, and <strong>Rating Scales</strong>.
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">1. The Triad of Data Collection Methodologies</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <div class="flex items-center gap-1.5 font-bold text-indigo-900 text-sm">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>A. Direct Observation</span>
            </div>
            <p class="text-xs text-slate-600">
              The gold standard in applied behavior analysis. Involves real-time recording of observable behavioral episodes as they occur in the natural classroom or clinic.
            </p>
            <ul class="text-xs space-y-1 text-slate-700 list-disc list-inside">
              <li><strong>Continuous Duration:</strong> Stopwatch timing of sustained visual fixation on instructional text or toys.</li>
              <li><strong>Response Latency:</strong> Elapsed seconds between delivering a visual prompt card and the student initiating ocular saccades.</li>
              <li><strong>Event / Frequency:</strong> Count of discrete 3-point joint visual attention shifts.</li>
              <li><strong>Time Sampling:</strong> WIR (underestimates), PIR (overestimates), MTS (efficient for multi-student groups).</li>
            </ul>
          </div>

          <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <div class="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>B. Checklists & Rubrics</span>
            </div>
            <p class="text-xs text-slate-600">
              Structured task analyses tracking sequential mastery of developmental milestones or step-by-step visual routines.
            </p>
            <ul class="text-xs space-y-1 text-slate-700 list-disc list-inside">
              <li><strong>Tracking Milestone Checklist:</strong> Fixation (3s) → Horizontal Sweep → Vertical Saccades → Convergence.</li>
              <li><strong>Task-Analytic Schedule:</strong> Step 1: Look at icon; Step 2: Detach card; Step 3: Transition; Step 4: Match to station.</li>
              <li><strong>Scoring Hierarchy:</strong> Independent (+), Visual Prompt (V), Gestural (G), Physical Guidance (P).</li>
            </ul>
          </div>

          <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <div class="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>C. Rating Scales</span>
            </div>
            <p class="text-xs text-slate-600">
              Standardized questionnaire tools administered to teachers, therapists, and caregivers to capture subjective impressions and sensory patterns.
            </p>
            <ul class="text-xs space-y-1 text-slate-700 list-disc list-inside">
              <li><strong>Likert Scales:</strong> E.g., 1 (Severe visual avoidance) to 5 (Sustained engagement).</li>
              <li><strong>Sensory Profiles:</strong> Evaluating visual hypersensitivity (glare distress) vs. hyposensitivity (visual seeking/stimming).</li>
              <li><strong>Exam Distinction:</strong> Useful for screening and IEP baseline profiles; <em>prohibited</em> as sole data for weekly progress monitoring!</li>
            </ul>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">2. The Absolute Necessity of Defining Target Behaviors</h3>
        <p>
          Subjective terms like <em>"paying attention"</em> or <em>"looking carefully"</em> lead to catastrophic disagreement between observers. Under Tennessee Board standards, an operational definition must pass two universal tests:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wide mb-1">1. The "Stranger Test" (Hawkins)</h4>
            <p class="text-xs text-slate-600">
              Could an unfamiliar substitute paraprofessional or outside board auditor walk into the classroom, read the operational definition without coaching, and record the exact same visual tracking data as the primary therapist?
            </p>
          </div>

          <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wide mb-1">2. The "Dead Man's Test" (Lindsley)</h4>
            <p class="text-xs text-slate-600">
              If a dead man can do it, it is NOT a behavior! Defining behavior as "not looking away" or "not staring at the ceiling" fails because a corpse can sit without looking away. The definition must require active ocular orientation.
            </p>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
          <span class="text-xs font-bold text-indigo-900 uppercase tracking-wide block">The 3 Required Criteria of an Operational Definition:</span>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-slate-900 block mb-0.5">1. Objective</strong>
              <span class="text-slate-600">Refers strictly to observable physical movement and anatomy (e.g. "head and open eyes angled toward target within 45 degrees").</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-slate-900 block mb-0.5">2. Clear & Unambiguous</strong>
              <span class="text-slate-600">Leaves no room for subjective interpretation. Readily understood by paraprofessionals and parents alike.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-slate-900 block mb-0.5">3. Complete & Bound</strong>
              <span class="text-slate-600">Specifies precise onset thresholds (e.g. >= 2 sec dwell), termination criteria (gaze shift > 1 sec), and non-examples (peripheral stimming).</span>
            </div>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">3. Inter-Observer Agreement (IOA) & Reliability Standards</h3>
        <p>
          Why is IOA essential in behavioral development? Even with clear definitions, human observers experience <strong>Observer Drift</strong> (unconsciously shifting criteria over weeks) and <strong>Expectancy Bias</strong> (anticipating that an intervention must be working). Independent verification guarantees scientific validity.
        </p>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse border border-slate-200 rounded-lg">
            <thead class="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th class="p-2.5 border-b border-slate-200">IOA Formula Name</th>
                <th class="p-2.5 border-b border-slate-200">Mathematical Calculation</th>
                <th class="p-2.5 border-b border-slate-200">When to Use on Board Exam</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr>
                <td class="p-2.5 font-bold text-slate-900">Total Count IOA</td>
                <td class="p-2.5 font-mono">(Smaller Count ÷ Larger Count) × 100%</td>
                <td class="p-2.5 text-slate-600">Discrete event counts across full sessions. Quickest, but least stringent.</td>
              </tr>
              <tr>
                <td class="p-2.5 font-bold text-slate-900">Interval-by-Interval IOA</td>
                <td class="p-2.5 font-mono">[Agreements ÷ (Agreements + Disagreements)] × 100%</td>
                <td class="p-2.5 text-slate-600">Time-sampling methods (WIR, PIR, MTS). Compares interval by interval.</td>
              </tr>
              <tr>
                <td class="p-2.5 font-bold text-slate-900">Scored-Interval IOA</td>
                <td class="p-2.5 font-mono">[Agreements on (+) ÷ (Intervals where at least one observer scored +)] × 100%</td>
                <td class="p-2.5 font-semibold text-indigo-700">LOW-RATE behaviors (e.g. rare joint attention initiations; ignores inflated (-) agreements).</td>
              </tr>
              <tr>
                <td class="p-2.5 font-bold text-slate-900">Unscored-Interval IOA</td>
                <td class="p-2.5 font-mono">[Agreements on (-) ÷ (Intervals where at least one observer scored -)] × 100%</td>
                <td class="p-2.5 font-semibold text-indigo-700">HIGH-RATE behaviors (e.g. constant visual gaze; ignores inflated (+) agreements).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs text-indigo-950">
          <strong class="font-bold block mb-1">Tennessee Board Regulatory Rules on IOA:</strong>
          • <strong>Frequency:</strong> Must be conducted across a minimum of <strong>20% to 33%</strong> of sessions across every experimental phase.<br />
          • <strong>Acceptable Criterion:</strong> Must achieve at least <strong>80% agreement</strong>. If IOA falls below 80%, intervention cannot be credited until observers are retrained and operational definitions are revised!
        </div>
      </div>
    `
  },
  {
    id: 'module-3-graphing-rules',
    title: '3. Graphing Techniques for Progress Monitoring: Line Graphs, Bar Charts, & Scatterplots',
    subtitle: 'Constructing and Interpreting Line Graphs, Bar Charts, and Scatterplots to Inform Instructional Decisions',
    readTimeMinutes: 13,
    iconName: 'LineChart',
    keyTakeaways: [
      'Line Graphs (Equal-Interval) track continuous progress over time; Bar Charts compare discrete categories; Scatterplots detect temporal/environmental patterns.',
      'Equal-Interval Line Graphs require clear labeling of Abscissa (X-axis = Time) and Ordinate (Y-axis = Metric) with a 3:4 aspect ratio.',
      'NEVER connect data points across condition change lines, prolonged time breaks (e.g. holiday absences), or scale breaks.',
      'Aim Lines (Goal Lines) establish target trajectories; Trendlines and the 4-Point Rule govern weekly instructional decisions.',
      'Bar Charts illustrate environmental setting differences (e.g. visual focus in Resource Room vs. General Ed).',
      'Scatterplots reveal temporal clusters of visual disengagement across the school day (e.g. sensory fatigue before lunch).'
    ],
    tnBoardNote: 'The Tennessee Board of Applied Behavior Analysis & Special Education Monitoring Framework requires graphical displays that strictly avoid visual distortion (aspect ratio 3:4 to 5:8) and include explicit phase change lines with condition labels.',
    neurodivergentApplication: 'For students with autism and ADHD, progress monitoring graphs serve as visual evidence in IEP team meetings, clearly showing whether environmental modifications (such as Typoscopes, contrast adjustments, or sensory breaks) are accelerating visual tracking.',
    contentHtml: `
      <div class="space-y-6 text-slate-700 leading-relaxed">
        <p class="text-base">
          Visual displays are the primary clinical communication vehicle in applied behavior analysis and special education. Selecting the correct graphing technique allows practitioners to showcase progress, detect regression, and make evidence-based instructional modifications.
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">1. The Equal-Interval Line Graph: The Progress Monitoring Workhorse</h3>
        <p>
          The equal-interval line graph is used for continuous, sequential measurement across days and weeks:
        </p>

        <div class="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
          <div class="text-indigo-400 font-semibold text-sm">Mandatory Structural Components:</div>
          <div>1. <span class="text-amber-300">Horizontal Axis (Abscissa / X-Axis):</span> Represents the continuous passage of time (Sessions, Days, or Trials). Remember: <em>"Scissors lie flat on the desk"</em>.</div>
          <div>2. <span class="text-amber-300">Vertical Axis (Ordinate / Y-Axis):</span> Scaled to represent the behavioral dimension (e.g., "Duration in Minutes", "Latency in Seconds", "Percent Correct Fixations"). Must start at 0.</div>
          <div>3. <span class="text-amber-300">Axis Aspect Ratio (3:4 or 5:8):</span> The vertical Y-axis should be approximately 2/3 to 3/4 the length of the horizontal X-axis. Squished or stretched axes create optical slope distortions that lead to faulty clinical decisions!</div>
          <div>4. <span class="text-amber-300">Condition Change Lines:</span> Vertical dividers. <strong>Solid line</strong> indicates a major independent variable shift (Baseline → Visual Schedule); <strong>dashed line</strong> indicates a minor parameter tweak (fading prompt delay).</div>
          <div>5. <span class="text-amber-300">Condition Labels:</span> Concise titles centered above each phase describing the specific environmental intervention.</div>
          <div>6. <span class="text-amber-300">Data Points & Data Path:</span> Geometric markers connected by solid strokes within phases.</div>
        </div>

        <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
          <strong class="font-bold text-rose-900 uppercase tracking-wide block">
            Critical Board Rule: When NOT to Connect Data Points (High-Frequency Exam Trap)
          </strong>
          <p class="text-rose-800">
            Drawing an unbroken line between data points falsely implies continuous measurement and uninterrupted behavioral continuity. You must <strong>NEVER</strong> connect data points:
          </p>
          <ul class="text-rose-800 list-disc list-inside space-y-1">
            <li><strong>Across Phase Change Lines:</strong> Always leave a clean visual gap between baseline and intervention.</li>
            <li><strong>Across Prolonged Time Breaks:</strong> If the student was absent for two weeks or school was on winter break, break the line!</li>
            <li><strong>Across Scale Breaks (//):</strong> If the Y-axis contains a scale discontinuity break, never connect points crossing it.</li>
            <li><strong>Across Discontinued Measurement:</strong> If data was not collected on a given session, leave it unplotted.</li>
          </ul>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">2. Utilizing Aim Lines & Trendlines to Inform Instructional Decisions</h3>
        <p>
          A progress monitoring line graph is not just a historical archive—it is an <em>active decision engine</em>:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h4 class="font-bold text-indigo-900">Constructing the Aim Line (Goal Line)</h4>
            <p class="text-slate-600">
              1. Calculate the <strong>median value of baseline data</strong>.<br />
              2. Identify the target mastery criterion coordinate (e.g. Session 14, 15 seconds latency).<br />
              3. Draw a straight trajectory line between these two points. This establishes the necessary rate of student progress.
            </p>
          </div>

          <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h4 class="font-bold text-indigo-900">The 4-Point Decision Protocol</h4>
            <p class="text-slate-600">
              • <strong>4 Consecutive Points BELOW Aim Line:</strong> Modify or revise the intervention immediately! Check treatment integrity, assess visual glare/distraction, and modify prompt level.<br />
              • <strong>4 Consecutive Points ABOVE Aim Line:</strong> Accelerate learning! Plan prompt fading, increase target difficulty, or probe generalization.
            </p>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">3. Bar Charts (Discrete Categorical Displays)</h3>
        <p>
          While line graphs track continuous time, <strong>Bar Charts</strong> are the preferred graphic display when summarizing <em>discrete, non-continuous categories</em>:
        </p>

        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
          <strong class="font-bold text-slate-900 block">When to Choose a Bar Chart for Neurodivergent Students:</strong>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3 bg-white rounded border border-slate-200">
              <strong class="text-slate-800 block mb-1">Setting Comparisons</strong>
              <span class="text-slate-600">Comparing average visual tracking duration across different classroom environments (e.g., Quiet Resource Room: 8.5 min vs. General Ed Classroom: 3.2 min vs. Cafeteria: 0.8 min).</span>
            </div>
            <div class="p-3 bg-white rounded border border-slate-200">
              <strong class="text-slate-800 block mb-1">Prompt Hierarchy Analysis</strong>
              <span class="text-slate-600">Displaying the percentage of visual schedule transitions completed under Independent vs. Visual Cue vs. Gestural vs. Physical prompts.</span>
            </div>
            <div class="p-3 bg-white rounded border border-slate-200">
              <strong class="text-slate-800 block mb-1">Visual Material Preferences</strong>
              <span class="text-slate-600">Comparing ocular fixation duration across different visual media (e.g., High-Contrast Yellow Border on Black vs. Standard Black/White Text vs. Digital Screen).</span>
            </div>
          </div>
          <div class="text-[11px] text-slate-500 italic">
            Board Warning: Never use a bar chart to evaluate daily progress monitoring trends, because bar charts conceal variability and trend trajectories across time!
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">4. Scatterplots: Temporal & Environmental Pattern Discovery</h3>
        <p>
          A behavioral <strong>Scatterplot</strong> organizes data on a two-dimensional grid where time-of-day blocks (e.g. 15-minute or 30-minute intervals from 8:00 AM to 3:00 PM) are plotted along the vertical axis, and successive calendar days are plotted along the horizontal axis.
        </p>

        <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
          <div class="font-bold text-slate-900">How Scatterplots Inform Instructional Decisions for Neurodivergent Learners:</div>
          <p class="text-slate-600">
            Neurodivergent students frequently experience fluctuations in ocular-motor control and visual attention caused by sensory fatigue, room illumination shifts, or medication cycles. The scatterplot uncovers these hidden patterns:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-amber-50 rounded border border-amber-200">
              <strong class="text-amber-950 block mb-1">Detecting Fatigue Windows (Pre-Lunch / End-of-Day)</strong>
              <p class="text-amber-900">
                If visual gaze disengagement consistently clusters between 11:30 AM and 12:00 PM across Monday through Friday, the team concludes the student is experiencing visual fatigue and hunger.
                <strong>Instructional Action:</strong> Move high-demand visual literacy tasks to the morning, and introduce tactile sensory rest before lunch.
              </p>
            </div>

            <div class="p-3 bg-blue-50 rounded border border-blue-200">
              <strong class="text-blue-950 block mb-1">Detecting Environmental Glare & Sensory Overload</strong>
              <p class="text-blue-900">
                If visual tracking errors cluster between 1:30 PM and 2:00 PM only on sunny days, investigation reveals direct sunlight glare reflecting off tablet screens through classroom south-facing windows.
                <strong>Instructional Action:</strong> Install window blinds or provide anti-glare matte screen overlays.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'module-4-visual-analysis',
    title: '4. Visual Analysis: Level, Trend, & Variability',
    subtitle: 'Extracting Clinical Truth: Split-Middle Line, Stability Envelope, & Percentage of Non-Overlapping Data (PND)',
    readTimeMinutes: 11,
    iconName: 'TrendingUp',
    keyTakeaways: [
      'Visual analysis inspects three core properties: Level, Trend, and Variability.',
      'Level is the mean or median vertical position of data within a phase.',
      'Trend is the direction of the data path (Ascending, Descending, Zero/Flat).',
      'Variability is the degree of bounce; stable baseline requires >= 80% of points within a 20% range of the median.',
      'PND (Percentage of Non-Overlapping Data) provides an objective metric of intervention effect size.'
    ],
    tnBoardNote: 'Before introducing any behavioral intervention, the TN Board mandates establishing a stable baseline trend. Introducing intervention during an already improving trend confounds internal validity!',
    neurodivergentApplication: 'Neurodivergent students often show natural behavioral variability due to sleep, sensory overload, or medication changes. Distinguishing clinical progress from baseline noise requires calculating stability envelopes.',
    contentHtml: `
      <div class="space-y-6 text-slate-700 leading-relaxed">
        <p class="text-base">
          Visual inspection is the primary analytical method in single-subject research. The examiner evaluates whether changes in the target behavior are functionally related to the intervention.
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">1. The Visual Analysis Triad</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">1. LEVEL</h4>
            <p class="text-xs text-slate-600 mb-2">The magnitude of the target behavior along the vertical ordinate.</p>
            <ul class="text-xs space-y-1 text-slate-700">
              <li>• <strong>Mean Level Line:</strong> Arithmetic average of data points in the phase.</li>
              <li>• <strong>Median Level Line:</strong> Preferred when outliers or extreme scores distort the mean.</li>
              <li>• <strong>Change in Level:</strong> Difference between the last point of Phase 1 and the first point of Phase 2 (Immediacy of Effect).</li>
            </ul>
          </div>

          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">2. TREND</h4>
            <p class="text-xs text-slate-600 mb-2">The overall directional trajectory of the data over successive sessions.</p>
            <ul class="text-xs space-y-1 text-slate-700">
              <li>• <strong>Ascending:</strong> Systematic upward trajectory.</li>
              <li>• <strong>Descending:</strong> Systematic downward trajectory.</li>
              <li>• <strong>Zero / Flat:</strong> No systematic directional movement.</li>
              <li>• <strong>Split-Middle Line:</strong> The objective statistical line of progress calculated by dividing the phase in half and finding intersecting quarter medians.</li>
            </ul>
          </div>

          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="font-semibold text-slate-900 text-sm mb-1">3. VARIABILITY</h4>
            <p class="text-xs text-slate-600 mb-2">The degree of bounce or dispersion of data points around the trendline.</p>
            <ul class="text-xs space-y-1 text-slate-700">
              <li>• <strong>High Variability:</strong> Points scatter widely; indicates uncontrolled environmental variables.</li>
              <li>• <strong>Stability Criterion:</strong> Generally, 80% to 90% of data points must fall within 15% to 20% of the median level line to be deemed "stable".</li>
            </ul>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">2. Percentage of Non-Overlapping Data (PND)</h3>
        <p>
          PND is the most frequently tested calculation of effect size in single-case visual analysis:
        </p>

        <div class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg space-y-2">
          <div class="font-semibold text-xs text-indigo-900">PND Calculation Formula:</div>
          <div class="font-mono text-xs bg-white p-2.5 rounded border border-indigo-100 text-slate-800">
            For behaviors targeted to INCREASE (e.g. visual gaze duration):<br>
            PND = (Number of Intervention points strictly GREATER than the HIGHEST Baseline point ÷ Total Intervention points) × 100%
            <br><br>
            For behaviors targeted to DECREASE (e.g. latency to orient):<br>
            PND = (Number of Intervention points strictly LESS than the LOWEST Baseline point ÷ Total Intervention points) × 100%
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs">
            <div class="p-2 bg-emerald-100/60 rounded text-emerald-950 font-medium">> 90% : Highly Effective</div>
            <div class="p-2 bg-blue-100/60 rounded text-blue-950 font-medium">70% - 90% : Moderately Effective</div>
            <div class="p-2 bg-amber-100/60 rounded text-amber-950 font-medium">50% - 70% : Questionable / Mild</div>
            <div class="p-2 bg-rose-100/60 rounded text-rose-950 font-medium">< 50% : Ineffective</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'module-5-progress-monitoring',
    title: '5. Progress Monitoring Tools & Clinical Decision Rules',
    subtitle: 'Aim Lines, The 4-Point Decision Rule, & Inter-Observer Agreement (IOA)',
    readTimeMinutes: 10,
    iconName: 'Target',
    keyTakeaways: [
      'The Aim Line (Goal Line) connects baseline median performance to the IEP target criterion at target date.',
      'The 4-Point Decision Rule governs intervention fidelity and modifications without waiting for annual reviews.',
      '4 consecutive points BELOW the aim line (for increasing behavior) = MODIFY the intervention immediately.',
      '4 consecutive points ABOVE the aim line = ACCELERATE progress (fade prompts or raise target).',
      'Inter-Observer Agreement (IOA) must be collected on 20% to 33% of sessions, maintaining >= 80% agreement.'
    ],
    tnBoardNote: 'Tennessee Department of Education IEP compliance guidelines require documented objective progress monitoring at least bi-weekly for students receiving tier 3 and special education behavioral supports.',
    neurodivergentApplication: 'The 4-point rule prevents "waiting for failure." When a student with autism is not responding to a visual prompt schedule, the 4-point rule forces the team to quickly identify sensory barriers or prompt dependency.',
    contentHtml: `
      <div class="space-y-6 text-slate-700 leading-relaxed">
        <p class="text-base">
          Progress monitoring transforms static graphs into active clinical decision engines. The <strong>Aim Line</strong> and <strong>4-Point Rule</strong> provide clear, objective criteria for when to persist, modify, or fade an intervention.
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">1. Constructing an Aim Line (Goal Line)</h3>
        <p>
          To draw an aim line:
        </p>
        <ol class="list-decimal list-inside text-xs space-y-1.5 pl-2">
          <li>Calculate the <strong>median value of the baseline phase</strong> and locate it at the final baseline session coordinate.</li>
          <li>Plot the <strong>target criterion coordinate</strong> at the scheduled goal completion session (e.g., Session 14, 85% accuracy).</li>
          <li>Draw a straight trajectory line connecting these two coordinates. This represents the expected rate of progress.</li>
        </ol>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">2. The 4-Point Decision Rule (Clinical Protocol)</h3>

        <div class="space-y-3">
          <div class="p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <span class="font-semibold text-xs text-rose-900 uppercase tracking-wide block mb-1">Condition A: 4 Consecutive Points Below Aim Line</span>
            <p class="text-xs text-rose-800">
              <strong>Clinical Action: Modify the Intervention Immediately!</strong><br>
              Do NOT continue an ineffective plan. Investigate:
            </p>
            <ul class="text-xs text-rose-700 list-disc list-inside mt-1 space-y-0.5">
              <li>Treatment Fidelity: Are classroom staff presenting the visual cue consistently?</li>
              <li>Sensory Accommodations: Is visual glare, visual clutter, or auditory noise interfering?</li>
              <li>Prompt Hierarchy: Does the student need temporary visual modeling or physical guidance?</li>
              <li>Motivation / Reinforcer Satiation: Has the incentive lost potency?</li>
            </ul>
          </div>

          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span class="font-semibold text-xs text-emerald-900 uppercase tracking-wide block mb-1">Condition B: 4 Consecutive Points Above Aim Line</span>
            <p class="text-xs text-emerald-800">
              <strong>Clinical Action: Accelerate Progress & Plan Fading!</strong><br>
              The student is acquiring the visual tracking skill faster than expected. Clinical options:
            </p>
            <ul class="text-xs text-emerald-700 list-disc list-inside mt-1 space-y-0.5">
              <li>Increase target goal criterion (e.g. increase duration requirement from 5 min to 10 min).</li>
              <li>Begin systematic prompt fading (move from gestural/visual cue to independent schedule check).</li>
              <li>Introduce generalization probes across novel classroom environments or staff members.</li>
            </ul>
          </div>

          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span class="font-semibold text-xs text-blue-900 uppercase tracking-wide block mb-1">Condition C: Points Scatter Equidistantly Above and Below</span>
            <p class="text-xs text-blue-800">
              <strong>Clinical Action: Maintain Current Intervention & Continue Monitoring.</strong><br>
              The student is progressing on schedule toward the target IEP benchmark.
            </p>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">3. Inter-Observer Agreement (IOA) Formulas</h3>
        <p>
          On board exams, you will be expected to calculate IOA:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-white border border-slate-200 rounded-lg">
            <h5 class="font-semibold text-slate-900 mb-1">Total Count IOA</h5>
            <div class="font-mono bg-slate-50 p-2 rounded text-slate-800 mb-1">IOA = (Smaller Count ÷ Larger Count) × 100%</div>
            <p class="text-slate-600">Simplest method; lacks interval precision. Example: Observer A = 8, Observer B = 10 -> (8/10) * 100% = 80%.</p>
          </div>

          <div class="p-3 bg-white border border-slate-200 rounded-lg">
            <h5 class="font-semibold text-slate-900 mb-1">Interval-by-Interval IOA</h5>
            <div class="font-mono bg-slate-50 p-2 rounded text-slate-800 mb-1">IOA = [Agreements ÷ (Agreements + Disagreements)] × 100%</div>
            <p class="text-slate-600">Standard for time sampling. Example: 8 agreed intervals out of 10 total intervals = 80% IOA.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'module-6-other-graphs',
    title: '6. Cumulative Records, Scatterplots, & Precision Charts',
    subtitle: 'Interpreting Cumulative Slope, Temporal Scatterplots, & Standard Celeration',
    readTimeMinutes: 8,
    iconName: 'BarChart2',
    keyTakeaways: [
      'Cumulative Record: Line NEVER decreases! Responses accumulate continuously over time.',
      'Slope of Cumulative Record = Rate of responding (Steep = High rate; Shallow = Low rate; Flat = Zero rate).',
      'Scatterplot maps behavior across time blocks vs. days to detect temporal/environmental patterns.',
      'Standard Celeration Chart (SCC) uses a semi-logarithmic Y-axis (multiply/divide scale) to measure celeration.'
    ],
    tnBoardNote: 'Skinnerian cumulative records are frequently tested on Tennessee board exams to verify that candidates can interpret slope as instantaneous rate of responding.',
    neurodivergentApplication: 'A scatterplot is invaluable for neurodivergent students whose visual fatigue or sensory meltdown follows predictable circadian or schedule patterns (e.g. following recess or during noisy cafeteria transitions).',
    contentHtml: `
      <div class="space-y-6 text-slate-700 leading-relaxed">
        <p class="text-base">
          While line graphs dominate daily clinical practice, the TN Board exam rigorously assesses your understanding of specialized graphic displays.
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">1. The Cumulative Record (B.F. Skinner)</h3>
        <p>
          In a cumulative record, each response causes the recording pen to step upward by one unit. The paper rolls continuously forward:
        </p>

        <div class="p-4 bg-slate-100 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div class="p-2.5 bg-white rounded border border-slate-300">
              <strong class="text-slate-900 block mb-0.5">Steep Positive Slope</strong>
              <span class="text-slate-600">Indicates a HIGH RATE of responding (rapid responses occurring in rapid succession).</span>
            </div>
            <div class="p-2.5 bg-white rounded border border-slate-300">
              <strong class="text-slate-900 block mb-0.5">Shallow / Gentle Slope</strong>
              <span class="text-slate-600">Indicates a LOW RATE of responding (sparse responses spaced far apart).</span>
            </div>
            <div class="p-2.5 bg-white rounded border border-slate-300">
              <strong class="text-slate-900 block mb-0.5">Flat Horizontal Line</strong>
              <span class="text-rose-700 font-medium">ZERO Responding! Behavior has paused, ceased, or is under extinction.</span>
            </div>
          </div>
          <div class="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 font-semibold">
            Board Test Fact: A cumulative record slope CAN NEVER BE NEGATIVE! A behavior cannot "un-happen."
          </div>
        </div>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">2. The Behavioral Scatterplot</h3>
        <p class="text-xs">
          A scatterplot divides the day into small time intervals (e.g. 15-minute or 30-minute cells) plotted on a grid against days of the week. Cells are shaded according to whether the behavior occurred (0 = unshaded, 1-2 = hatched, 3+ = solid black).
        </p>
        <p class="text-xs">
          <strong>Clinical Utility:</strong> Pinpointing environmental correlations. For instance, if an autistic student exhibits off-task visual gaze wandering almost exclusively between 1:00 PM and 1:30 PM, the scatterplot prompts the team to evaluate lighting changes, medication wear-off, or physical exhaustion.
        </p>

        <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">3. Standard Celeration Chart (SCC)</h3>
        <p class="text-xs">
          Developed by Ogden Lindsley for Precision Teaching, the SCC utilizes a <strong>semi-logarithmic (ratio) scale</strong> on the Y-axis. Equal vertical distances represent equal proportional changes (e.g. doubling from 1 to 2 is the same vertical distance as doubling from 50 to 100).
        </p>
      </div>
    `
  }
];
