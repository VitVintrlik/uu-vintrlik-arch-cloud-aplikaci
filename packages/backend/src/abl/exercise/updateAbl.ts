import { z } from 'zod';

import { getExercise, updateExercise } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  id: z.string().uuid(),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  weight: z.number().nonnegative().optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  note: z.string().optional(),
});

export type UpdateExerciseDtoIn = z.infer<typeof schema>;

export const updateAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<UpdateExerciseDtoIn>(schema, dtoIn);

  const exercise = getExercise(data.id);
  if (!exercise) {
    throwBusinessError(`Exercise entry with id ${data.id} not found.`);
  }

  if (data.sets !== undefined) exercise.sets = data.sets;
  if (data.reps !== undefined) exercise.reps = data.reps;
  if (data.weight !== undefined) exercise.weight = data.weight;
  if (data.rpe !== undefined) exercise.rpe = data.rpe;
  if (data.note !== undefined) exercise.note = data.note;

  const result = updateExercise(exercise);

  if (result.changes === 0) {
    throwBusinessError(`Failed to update exercise entry with id ${data.id}.`);
  }

  return { ...exercise, warnings };
};
