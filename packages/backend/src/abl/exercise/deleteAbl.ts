import { z } from 'zod';

import { getExercise, deleteExercise } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  id: z.string().uuid(),
});

export type DeleteExerciseDtoIn = z.infer<typeof schema>;

export const deleteAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<DeleteExerciseDtoIn>(schema, dtoIn);

  const exercise = getExercise(data.id);
  if (!exercise) {
    throwBusinessError(`Exercise entry with id ${data.id} not found.`);
  }

  const result = deleteExercise(data.id);

  if (result.changes === 0) {
    throwBusinessError(`Failed to delete exercise entry with id ${data.id}.`);
  }

  return { success: true, warnings };
};
