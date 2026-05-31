import type { ExerciseKey } from './exercises.js';

export type ExerciseEntry = {
  id: string;
  workoutSessionId: string;
  exerciseKey: ExerciseKey;
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
  note?: string;
};
