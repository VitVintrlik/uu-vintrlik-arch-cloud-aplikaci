import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';

import { WorkoutSplit, EXERCISE_LIBRARY } from 'shared';

import app from '../app.js';
import db from '../db.js';

describe('LiftLog API Integration Tests', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM exercise_entry').run();
    db.prepare('DELETE FROM workout_session').run();
  });

  describe('Workout Session', () => {
    it('should create a new active session', async () => {
      const response = await request(app).post('/sessions').send({
        split: WorkoutSplit.FULL_BODY,
        name: 'Morning Blast',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
      expect(response.body.name).toBe('Morning Blast');
      expect(response.body.id).toBeDefined();
    });

    it('should block creating a second active session', async () => {
      await request(app).post('/sessions').send({ split: WorkoutSplit.PPL });

      const response = await request(app)
        .post('/sessions')
        .send({ split: WorkoutSplit.UPPER_LOWER });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('active session already exists');
    });

    it('should calculate duration when finishing a session', async () => {
      const createRes = await request(app)
        .post('/sessions')
        .send({ split: WorkoutSplit.FULL_BODY });

      const sessionId = createRes.body.id;

      const finishRes = await request(app).patch(`/sessions/${sessionId}/finish`);

      expect(finishRes.status).toBe(200);
      expect(finishRes.body.status).toBe('FINISHED');
      expect(finishRes.body.duration).toBeDefined();
      expect(typeof finishRes.body.duration).toBe('number');
    });

    it('should save note when finishing a session', async () => {
      const createRes = await request(app)
        .post('/sessions')
        .send({ split: WorkoutSplit.FULL_BODY, name: 'Note Test' });

      const sessionId = createRes.body.id;

      const finishRes = await request(app)
        .patch(`/sessions/${sessionId}/finish`)
        .send({ note: 'Šlo to dobře' });

      expect(finishRes.status).toBe(200);
      expect(finishRes.body.note).toBe('Šlo to dobře');
      expect(finishRes.body.status).toBe('FINISHED');
    });

    it('should return error for invalid split', async () => {
      const response = await request(app).post('/sessions').send({ split: 'INVALID_SPLIT' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('invalidDtoIn');
      expect(response.body.parameters.invalidValueKeyMap.split).toBeDefined();
    });
  });

  describe('Exercise Entries', () => {
    it('should add an exercise to an active session', async () => {
      const sessionRes = await request(app).post('/sessions').send({ split: WorkoutSplit.PPL });

      const sessionId = sessionRes.body.id;

      const exerciseRes = await request(app).post(`/sessions/${sessionId}/exercises`).send({
        exerciseKey: EXERCISE_LIBRARY[0].key,
        sets: 3,
        reps: 10,
        weight: 100,
        rpe: 8,
      });

      expect(exerciseRes.status).toBe(201);
      expect(exerciseRes.body.exerciseKey).toBe(EXERCISE_LIBRARY[0].key);
      expect(exerciseRes.body.workoutSessionId).toBe(sessionId);
    });

    it('should block adding exercise to a finished session', async () => {
      const sessionRes = await request(app).post('/sessions').send({ split: WorkoutSplit.PPL });

      const sessionId = sessionRes.body.id;
      await request(app).patch(`/sessions/${sessionId}/finish`);

      const response = await request(app).post(`/sessions/${sessionId}/exercises`).send({
        exerciseKey: EXERCISE_LIBRARY[0].key,
        sets: 3,
        reps: 10,
        weight: 100,
        rpe: 8,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('ACTIVE session');
    });
  });
});
