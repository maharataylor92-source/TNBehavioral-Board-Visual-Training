import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface SavedExamAttempt {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passedBenchmark: boolean;
  mode: 'study' | 'timed' | 'adaptive';
  createdAt: string;
}

export interface SavedAdaptiveMistake {
  id: string;
  userId: string;
  questionId: string;
  taskListCode: string;
  category?: string;
  selectedAnswerIndex?: number;
  correctAnswerIndex?: number;
  suggestedModuleId: string;
  suggestedModuleTitle?: string;
  mistakeCount?: number;
  resolved?: boolean;
  lastAttemptAt?: string;
  createdAt: string;
}

export interface SavedIntervalSession {
  id: string;
  userId: string;
  scenarioName: string;
  truePercent: number;
  pirPercent: number;
  wirPercent: number;
  mtsPercent: number;
  biasRecognized?: boolean;
  createdAt: string;
}

export interface SavedStudySession {
  id: string;
  userId: string;
  durationMinutes: number;
  studyArea?: string; // e.g. Measurement, Assessment, Skill Acquisition, Behavior Reduction, Documentation & Reporting, Ethics
  topic: string;
  notes?: string;
  completed?: boolean;
  createdAt: string;
}

export interface SavedDataSheet {
  id: string;
  userId: string;
  studentName: string;
  observerName?: string;
  targetBehavior: string;
  measurementType: 'Duration' | 'Latency' | 'Frequency' | 'Whole Interval' | 'Partial Interval' | 'Momentary Time Sampling';
  setting?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------- EXAM ATTEMPTS ----------------

export async function saveExamAttempt(attempt: Omit<SavedExamAttempt, 'id'>): Promise<string> {
  const attemptId = `attempt_${Date.now()}`;
  const path = `users/${attempt.userId}/examAttempts/${attemptId}`;
  try {
    const docRef = doc(db, 'users', attempt.userId, 'examAttempts', attemptId);
    await setDoc(docRef, {
      ...attempt,
      createdAt: new Date().toISOString()
    });
    return attemptId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getExamAttempts(userId: string): Promise<SavedExamAttempt[]> {
  const path = `users/${userId}/examAttempts`;
  try {
    const colRef = collection(db, 'users', userId, 'examAttempts');
    const snapshot = await getDocs(colRef);
    return snapshot.docs
      .map(d => ({
        id: d.id,
        ...(d.data() as Omit<SavedExamAttempt, 'id'>)
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ---------------- INTERVAL LAB SESSIONS ----------------

export async function saveIntervalSession(session: Omit<SavedIntervalSession, 'id'>): Promise<string> {
  const sessionId = `interval_${Date.now()}`;
  const path = `users/${session.userId}/intervalSessions/${sessionId}`;
  try {
    const docRef = doc(db, 'users', session.userId, 'intervalSessions', sessionId);
    await setDoc(docRef, {
      ...session,
      createdAt: new Date().toISOString()
    });
    return sessionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getIntervalSessions(userId: string): Promise<SavedIntervalSession[]> {
  const path = `users/${userId}/intervalSessions`;
  try {
    const colRef = collection(db, 'users', userId, 'intervalSessions');
    const snapshot = await getDocs(colRef);
    return snapshot.docs
      .map(d => ({
        id: d.id,
        ...(d.data() as Omit<SavedIntervalSession, 'id'>)
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ---------------- STUDY TIMER SESSIONS ----------------

export async function saveStudySession(session: Omit<SavedStudySession, 'id'>): Promise<string> {
  const studyId = `study_${Date.now()}`;
  const path = `users/${session.userId}/studySessions/${studyId}`;
  try {
    const docRef = doc(db, 'users', session.userId, 'studySessions', studyId);
    await setDoc(docRef, {
      ...session,
      createdAt: new Date().toISOString()
    });
    return studyId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getStudySessions(userId: string): Promise<SavedStudySession[]> {
  const path = `users/${userId}/studySessions`;
  try {
    const colRef = collection(db, 'users', userId, 'studySessions');
    const snapshot = await getDocs(colRef);
    return snapshot.docs
      .map(d => ({
        id: d.id,
        ...(d.data() as Omit<SavedStudySession, 'id'>)
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteStudySession(userId: string, studyId: string): Promise<void> {
  const path = `users/${userId}/studySessions/${studyId}`;
  try {
    const docRef = doc(db, 'users', userId, 'studySessions', studyId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- DATA SHEETS ----------------

export async function saveCustomDataSheet(sheet: Omit<SavedDataSheet, 'id'>): Promise<string> {
  const sheetId = `sheet_${Date.now()}`;
  const path = `users/${sheet.userId}/dataSheets/${sheetId}`;
  try {
    const docRef = doc(db, 'users', sheet.userId, 'dataSheets', sheetId);
    await setDoc(docRef, {
      ...sheet,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return sheetId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getCustomDataSheets(userId: string): Promise<SavedDataSheet[]> {
  const path = `users/${userId}/dataSheets`;
  try {
    const colRef = collection(db, 'users', userId, 'dataSheets');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<SavedDataSheet, 'id'>)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteCustomDataSheet(userId: string, sheetId: string): Promise<void> {
  const path = `users/${userId}/dataSheets/${sheetId}`;
  try {
    const docRef = doc(db, 'users', userId, 'dataSheets', sheetId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- ADAPTIVE MISTAKES & WEAK-SPOT TRACKING ----------------

export async function saveAdaptiveMistake(mistake: Omit<SavedAdaptiveMistake, 'id'>): Promise<string> {
  const mistakeId = mistake.questionId || `mistake_${Date.now()}`;
  const path = `users/${mistake.userId}/adaptiveMistakes/${mistakeId}`;
  try {
    const docRef = doc(db, 'users', mistake.userId, 'adaptiveMistakes', mistakeId);
    await setDoc(docRef, {
      ...mistake,
      lastAttemptAt: new Date().toISOString(),
      createdAt: mistake.createdAt || new Date().toISOString()
    }, { merge: true });
    return mistakeId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getAdaptiveMistakes(userId: string): Promise<SavedAdaptiveMistake[]> {
  const path = `users/${userId}/adaptiveMistakes`;
  try {
    const colRef = collection(db, 'users', userId, 'adaptiveMistakes');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<SavedAdaptiveMistake, 'id'>)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function resolveAdaptiveMistake(userId: string, questionId: string): Promise<void> {
  const path = `users/${userId}/adaptiveMistakes/${questionId}`;
  try {
    const docRef = doc(db, 'users', userId, 'adaptiveMistakes', questionId);
    await setDoc(docRef, {
      resolved: true,
      lastAttemptAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAdaptiveMistake(userId: string, mistakeId: string): Promise<void> {
  const path = `users/${userId}/adaptiveMistakes/${mistakeId}`;
  try {
    const docRef = doc(db, 'users', userId, 'adaptiveMistakes', mistakeId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- USER PROFILE & TARGET EXAM DATE ----------------

export async function saveUserTargetExamDate(
  userId: string,
  email: string,
  targetExamDate: string
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(
      docRef,
      {
        userId,
        email,
        targetExamDate,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string): Promise<any> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
