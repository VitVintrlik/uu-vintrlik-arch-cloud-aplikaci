import { z } from 'zod';

import { getSession, deleteSession } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  id: z.string().uuid(),
});

export type DeleteSessionDtoIn = z.infer<typeof schema>;

/**
 * Deletes a workout session.
 *
 * Logic:
 * 1. Existence Check: We verify the record exists before asking the DAO to delete.
 * 2. Cascading: Since our DB uses ON DELETE CASCADE, deleting a session here
 *    automatically cleans up all related Exercise Entries.
 */
export const deleteAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<DeleteSessionDtoIn>(schema, dtoIn);

  const session = getSession(data.id);
  if (!session) {
    throwBusinessError(`Workout session with id ${data.id} not found.`);
  }

  const result = deleteSession(data.id);

  if (result.changes === 0) {
    throwBusinessError(`Failed to delete workout session with id ${data.id}.`);
  }

  return { success: true, warnings };
};
