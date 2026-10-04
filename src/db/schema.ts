import { boolean, doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table mapping to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Exam attempts table
export const examAttempts = pgTable('exam_attempts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  percentage: doublePrecision('percentage').notNull(),
  passedBenchmark: boolean('passed_benchmark').notNull().default(false),
  mode: text('mode').notNull().default('study'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Discontinuous interval measurement lab simulations
export const intervalSessions = pgTable('interval_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  scenarioName: text('scenario_name').notNull(),
  truePercent: doublePrecision('true_percent').notNull(),
  wirPercent: doublePrecision('wir_percent').notNull(),
  pirPercent: doublePrecision('pir_percent').notNull(),
  mtsPercent: doublePrecision('mts_percent').notNull(),
  biasRecognized: boolean('bias_recognized').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Focused Pomodoro study blocks
export const studySessions = pgTable('study_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  studyArea: text('study_area'),
  topic: text('topic').notNull(),
  notes: text('notes'),
  completed: boolean('completed').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
