import { z } from 'zod';

import { WorkoutSplit } from 'shared';

import { getSession, updateSession } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  split: z.nativeEnum(WorkoutSplit).optional(),
  note: z.string().optional(),
});

export type UpdateSessionDtoIn = z.infer<typeof schema>;

/**
 * Updates an existing workout session.
 *
 * Strategy:
 * 1. Patch Logic: We only update fields that were actually provided in the request (data.field !== undefined).
 * 2. Immutability: We do not allow updating status or duration through this generic update method.
 */
export const updateAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<UpdateSessionDtoIn>(schema, dtoIn);

  const session = getSession(data.id);
  if (!session) {
    throwBusinessError(`Workout session with id ${data.id} not found.`);
  }

  if (data.name !== undefined) session.name = data.name;
  if (data.split !== undefined) session.split = data.split;
  if (data.note !== undefined) session.note = data.note;

  const result = updateSession(session);

  if (result.changes === 0) {
    throwBusinessError(`Failed to update workout session with id ${data.id}.`);
  }

  return { ...session, warnings };
};
