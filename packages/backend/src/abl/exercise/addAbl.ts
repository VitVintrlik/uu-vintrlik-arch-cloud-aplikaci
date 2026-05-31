import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { EXERCISE_LIBRARY, ExerciseEntry, ExerciseKey, SessionStatus } from 'shared';

import { createExercise, getSession } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  workoutSessionId: z.string().uuid(),
  exerciseKey: z
    .string()
    .refine((val) => EXERCISE_LIBRARY.some((e: { key: string }) => e.key === val), {
      message: 'Invalid exercise key',
    }),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().nonnegative(),
  rpe: z.number().int().min(1).max(10),
  note: z.string().optional(),
});

export type AddExerciseDtoIn = z.infer<typeof schema>;

/**
 * Coordinates the addition of training records while ensuring referential and state integrity.
 */
export const addAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<AddExerciseDtoIn>(schema, dtoIn);

  const session = getSession(data.workoutSessionId);
  if (!session) {
    throwBusinessError(`Session with id ${data.workoutSessionId} not found.`);
  }

  if (session.status !== SessionStatus.ACTIVE) {
    throwBusinessError('Exercises can only be added to an ACTIVE session.');
  }

  const id = uuidv4();
  const entry: ExerciseEntry = {
    ...data,
    id,
    exerciseKey: data.exerciseKey as ExerciseKey,
  };

  const result = createExercise(entry);

  if (result.changes === 0) {
    throwBusinessError('Failed to add exercise entry.');
  }

  return { ...entry, warnings };
};
