import { ExerciseEntry } from 'shared';

import db from '../db.js';

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
 * Direct SQL interface for the exercise_entry table.
 * Maintains encapsulation by handling all relational persistence details in one location.
 */

export function createExercise(entry: ExerciseEntry): { changes: number } {
  const statement = db.prepare(`
    INSERT INTO exercise_entry (id, workout_session_id, exercise_key, sets, reps, weight, rpe, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = statement.run(
    entry.id,
    entry.workoutSessionId,
    entry.exerciseKey,
    entry.sets,
    entry.reps,
    entry.weight,
    entry.rpe,
    entry.note || null,
  );
  return { changes: info.changes };
}

export function getExercise(id: string): ExerciseEntry | null {
  const exerciseRow = db.prepare('SELECT * FROM exercise_entry WHERE id = ?').get(id) as
    | ExerciseEntryRow
    | undefined;
  if (!exerciseRow) return null;

  return {
    id: exerciseRow.id,
    workoutSessionId: exerciseRow.workout_session_id,
    exerciseKey: exerciseRow.exercise_key,
    sets: exerciseRow.sets,
    reps: exerciseRow.reps,
    weight: exerciseRow.weight,
    rpe: exerciseRow.rpe,
    note: exerciseRow.note || undefined,
  };
}

export function updateExercise(entry: ExerciseEntry): { changes: number } {
  const statement = db.prepare(`
    UPDATE exercise_entry
    SET sets = ?, reps = ?, weight = ?, rpe = ?, note = ?
    WHERE id = ?
  `);
  const info = statement.run(
    entry.sets,
    entry.reps,
    entry.weight,
    entry.rpe,
    entry.note || null,
    entry.id,
  );
  return { changes: info.changes };
}

export function deleteExercise(id: string): { changes: number } {
  const info = db.prepare('DELETE FROM exercise_entry WHERE id = ?').run(id);
  return { changes: info.changes };
}

export function listExercises(): ExerciseEntry[] {
  const exercises = db.prepare('SELECT * FROM exercise_entry').all() as ExerciseEntryRow[];

  return exercises.map((exercise) => ({
    id: exercise.id,
    workoutSessionId: exercise.workout_session_id,
    exerciseKey: exercise.exercise_key,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    rpe: exercise.rpe,
    note: exercise.note || undefined,
  }));
}
