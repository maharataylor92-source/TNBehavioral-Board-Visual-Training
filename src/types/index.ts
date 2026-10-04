export type TabMode = 
  | 'dashboard'
  | 'study-timer'
  | 'rbt-task-list'
  | 'rbt-glossary'
  | 'exam-simulator'
  | 'memory-hacks'
  | 'study-guide'
  | 'interactive-graph'
  | 'interval-simulator'
  | 'cumulative-recorder'
  | 'practice-exam'
  | 'flashcards'
  | 'datasheet-generator'
  | 'cheat-sheet';

export interface DataPoint {
  id: string;
  session: number;
  date?: string;
  value: number;
  phase: 'Baseline' | 'Intervention' | 'Maintenance' | 'Fading';
  notes?: string;
}

export interface PhaseChange {
  sessionBefore: number; // e.g. after session 5
  type: 'solid' | 'dashed'; // solid = major independent variable; dashed = minor parameter shift
  label: string; // e.g. "Baseline", "Visual Schedule & High-Contrast Icons", "Prompt Fading"
}

export interface StudentCase {
  id: string;
  studentName: string;
  age: string;
  diagnosis: string;
  targetBehavior: string;
  behaviorType: 'increase' | 'decrease';
  dimension: 'Duration' | 'Latency' | 'Rate/Frequency' | 'Percent Intervals';
  unit: string;
  yAxisLabel: string;
  targetGoal: number;
  initialData: DataPoint[];
  phaseChanges: PhaseChange[];
  aimLineTargetSession: number;
  clinicalContext: string;
  neurodivergentConsiderations: string;
}

export interface Flashcard {
  id: string;
  category: 'TN Board Rules' | 'Continuous Measurement' | 'Discontinuous Measurement' | 'Visual Tracking Metrics' | 'Graph Anatomy & Rules' | 'Visual Analysis' | 'Progress Monitoring' | 'Cumulative Records';
  question: string;
  answer: string;
  boardTip: string;
  clinicalExample: string;
}

export interface ExamQuestion {
  id: string;
  category: string;
  scenario: string;
  question: string;
  hasGraph?: boolean;
  graphType?: 'line' | 'cumulative' | 'scatterplot' | 'bar';
  graphData?: {
    baseline: number[];
    intervention: number[];
    aimLine?: { start: number; end: number };
    yLabel: string;
  };
  options: string[];
  correctIndex: number;
  explanation: string;
  tnBoardReference: string;
  clinicalRelevance: string;
}

export interface StudySection {
  id: string;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  iconName: string;
  keyTakeaways: string[];
  contentHtml: string;
  tnBoardNote?: string;
  neurodivergentApplication?: string;
}
