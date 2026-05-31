import { WorkoutSession, ExerciseEntry, WorkoutSplit, SessionStatus } from 'shared';

import db from '../db.js';

type WorkoutSessionRow = {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  split: WorkoutSplit;
  status: SessionStatus;
  note: string | null;
};

type ExerciseEntryRow = {
  id: string;
  workout_session_id: string;
  exercise_key: ExerciseEntry['exerciseKey'];
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
  note: string | null;
};

/**
 * This layer acts as a translator between the SQL domain (snake_case) and the application domain (camelCase).
 * Isolating SQL here ensures that schema changes do not leak into the core business logic.
 */

export function createSession(session: WorkoutSession): { changes: number } {
  const statement = db.prepare(`
    INSERT INTO workout_session (id, name, date, start_time, end_time, duration, split, status, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = statement.run(
    session.id,
    session.name,
    session.date,
    session.startTime,
    session.endTime || null,
    session.duration || null,
    session.split,
    session.status,
    session.note || null,
  );
  return { changes: info.changes };
}

export function getSession(
  id: string,
): (WorkoutSession & { exerciseEntries: ExerciseEntry[] }) | null {
  const sessionRow = db.prepare('SELECT * FROM workout_session WHERE id = ?').get(id) as
    | WorkoutSessionRow
    | undefined;
  if (!sessionRow) return null;

  const exerciseRows = db
    .prepare('SELECT * FROM exercise_entry WHERE workout_session_id = ?')
    .all(id) as ExerciseEntryRow[];

  return {
    id: sessionRow.id,
    name: sessionRow.name,
    date: sessionRow.date,
    startTime: sessionRow.start_time,
    endTime: sessionRow.end_time || undefined,
    duration: sessionRow.duration || undefined,
    split: sessionRow.split,
    status: sessionRow.status,
    note: sessionRow.note || undefined,
    exerciseEntries: exerciseRows.map((exercise) => ({
      id: exercise.id,
      workoutSessionId: exercise.workout_session_id,
      exerciseKey: exercise.exercise_key,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      rpe: exercise.rpe,
      note: exercise.note || undefined,
    })),
  };
}

export function listSessions(): WorkoutSession[] {
  const sessions = db
    .prepare('SELECT * FROM workout_session ORDER BY date DESC, start_time DESC')
    .all() as WorkoutSessionRow[];
  return sessions.map((session) => ({
    id: session.id,
    name: session.name,
    date: session.date,
    startTime: session.start_time,
    endTime: session.end_time || undefined,
    duration: session.duration || undefined,
    split: session.split,
    status: session.status,
    note: session.note || undefined,
  }));
}

export function updateSession(session: WorkoutSession): { changes: number } {
  const statement = db.prepare(`
    UPDATE workout_session 
    SET name = ?, date = ?, start_time = ?, end_time = ?, duration = ?, split = ?, status = ?, note = ?
    WHERE id = ?
  `);
  const info = statement.run(
    session.name,
    session.date,
    session.startTime,
    session.endTime || null,
    session.duration || null,
    session.split,
    session.status,
    session.note || null,
    session.id,
  );
  return { changes: info.changes };
}

export function deleteSession(id: string): { changes: number } {
  const info = db.prepare('DELETE FROM workout_session WHERE id = ?').run(id);
  return { changes: info.changes };
}

export function getActiveSession(): WorkoutSession | null {
  const sessionRow = db.prepare("SELECT * FROM workout_session WHERE status = 'ACTIVE'").get() as
    | WorkoutSessionRow
    | undefined;
  if (!sessionRow) return null;
  return {
    id: sessionRow.id,
    name: sessionRow.name,
    date: sessionRow.date,
    startTime: sessionRow.start_time,
    endTime: sessionRow.end_time || undefined,
    duration: sessionRow.duration || undefined,
    split: sessionRow.split,
    status: sessionRow.status,
    note: sessionRow.note || undefined,
  };
}

export function getDashboardStats(): { workoutCount: number; totalVolume: number } {
  const row = db
    .prepare(
      `
    SELECT
      COUNT(DISTINCT ws.id) as workoutCount,
      COALESCE(SUM(ee.sets * ee.reps * ee.weight), 0) as totalVolume
    FROM workout_session ws
    LEFT JOIN exercise_entry ee ON ws.id = ee.workout_session_id
    WHERE ws.status = 'FINISHED'
  `,
    )
    .get() as { workoutCount: number; totalVolume: number };

  return {
    workoutCount: row.workoutCount,
    totalVolume: row.totalVolume,
  };
}
