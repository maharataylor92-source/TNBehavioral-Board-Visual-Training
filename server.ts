import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import {
  saveExamAttemptSql,
  getExamAttemptsSql,
  saveStudySessionSql,
  getStudySessionsSql,
  saveIntervalSessionSql,
  getIntervalSessionsSql,
} from './src/db/records.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TN RBT Board Exam Study Suite',
      database: 'Cloud SQL PostgreSQL (Developer Edition)',
    });
  });

  // User synchronization to Cloud SQL
  app.post('/api/sync-user', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await getOrCreateUser(
        req.user!.uid,
        req.user!.email || '',
        req.user!.name || ''
      );
      res.json(user);
    } catch (err: any) {
      console.error('Error syncing user to Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to sync user' });
    }
  });

  // Exam Attempts APIs backed by Cloud SQL
  app.get('/api/exam-attempts', requireAuth, async (req: AuthRequest, res) => {
    try {
      const attempts = await getExamAttemptsSql(req.user!.uid);
      res.json(attempts);
    } catch (err: any) {
      console.error('Error fetching exam attempts:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch exam attempts' });
    }
  });

  app.post('/api/exam-attempts', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { score, totalQuestions, percentage, passedBenchmark, mode } = req.body;
      const attempt = await saveExamAttemptSql({
        userId: req.user!.uid,
        score: Number(score) || 0,
        totalQuestions: Number(totalQuestions) || 20,
        percentage: Number(percentage) || 0,
        passedBenchmark: Boolean(passedBenchmark),
        mode: mode || 'study',
      });
      res.json(attempt);
    } catch (err: any) {
      console.error('Error saving exam attempt:', err);
      res.status(500).json({ error: err.message || 'Failed to save exam attempt' });
    }
  });

  // Study Sessions APIs backed by Cloud SQL
  app.get('/api/study-sessions', requireAuth, async (req: AuthRequest, res) => {
    try {
      const sessions = await getStudySessionsSql(req.user!.uid);
      res.json(sessions);
    } catch (err: any) {
      console.error('Error fetching study sessions:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch study sessions' });
    }
  });

  app.post('/api/study-sessions', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { durationMinutes, studyArea, topic, notes } = req.body;
      const session = await saveStudySessionSql({
        userId: req.user!.uid,
        durationMinutes: Number(durationMinutes) || 25,
        studyArea: studyArea || 'Measurement',
        topic: topic || 'Focus Block',
        notes: notes || '',
      });
      res.json(session);
    } catch (err: any) {
      console.error('Error saving study session:', err);
      res.status(500).json({ error: err.message || 'Failed to save study session' });
    }
  });

  // Interval Sessions APIs backed by Cloud SQL
  app.get('/api/interval-sessions', requireAuth, async (req: AuthRequest, res) => {
    try {
      const sessions = await getIntervalSessionsSql(req.user!.uid);
      res.json(sessions);
    } catch (err: any) {
      console.error('Error fetching interval sessions:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch interval sessions' });
    }
  });

  app.post('/api/interval-sessions', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { scenarioName, truePercent, wirPercent, pirPercent, mtsPercent, biasRecognized } = req.body;
      const session = await saveIntervalSessionSql({
        userId: req.user!.uid,
        scenarioName: scenarioName || 'Interval Lab Session',
        truePercent: Number(truePercent) || 0,
        wirPercent: Number(wirPercent) || 0,
        pirPercent: Number(pirPercent) || 0,
        mtsPercent: Number(mtsPercent) || 0,
        biasRecognized: Boolean(biasRecognized),
      });
      res.json(session);
    } catch (err: any) {
      console.error('Error saving interval session:', err);
      res.status(500).json({ error: err.message || 'Failed to save interval session' });
    }
  });

  // Mount Vite middleware in development or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
