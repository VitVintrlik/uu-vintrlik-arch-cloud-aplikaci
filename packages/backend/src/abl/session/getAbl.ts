import { z } from 'zod';

import { getSession } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  id: z.string().uuid(),
});

export type GetSessionDtoIn = z.infer<typeof schema>;

/**
 * Retrieves a single workout session including its exercise entries.
 *
 * Logic:
 * 1. Coordination: The ABL asks the DAO for data.
 * 2. Presence Check: If the record doesn't exist, we throw a specific error.
 *    This ensures the Frontend gets a meaningful message instead of a null.
 */
export const getAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<GetSessionDtoIn>(schema, dtoIn);

  const session = getSession(data.id);
  if (!session) {
    throwBusinessError(`Workout session with id ${data.id} not found.`);
  }

  return { ...session, warnings };
};
