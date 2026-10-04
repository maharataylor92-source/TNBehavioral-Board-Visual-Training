import { db } from './index.ts';
import { examAttempts, intervalSessions, studySessions } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function saveExamAttemptSql(data: {
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passedBenchmark: boolean;
  mode: string;
}) {
  try {
    const [inserted] = await db.insert(examAttempts).values(data).returning();
    return inserted;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function getExamAttemptsSql(userId: string) {
  try {
    return await db
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.userId, userId))
      .orderBy(examAttempts.createdAt);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function saveStudySessionSql(data: {
  userId: string;
  durationMinutes: number;
  studyArea?: string;
  topic: string;
  notes?: string;
}) {
  try {
    const [inserted] = await db.insert(studySessions).values(data).returning();
    return inserted;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function getStudySessionsSql(userId: string) {
  try {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(studySessions.createdAt);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function saveIntervalSessionSql(data: {
  userId: string;
  scenarioName: string;
  truePercent: number;
  wirPercent: number;
  pirPercent: number;
  mtsPercent: number;
  biasRecognized?: boolean;
}) {
  try {
    const [inserted] = await db.insert(intervalSessions).values(data).returning();
    return inserted;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function getIntervalSessionsSql(userId: string) {
  try {
    return await db
      .select()
      .from(intervalSessions)
      .where(eq(intervalSessions.userId, userId))
      .orderBy(intervalSessions.createdAt);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}
