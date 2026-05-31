import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { WorkoutSession, WorkoutSplit, SessionStatus } from 'shared';

import { createSession, getActiveSession } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  name: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  split: z.nativeEnum(WorkoutSplit),
  note: z.string().optional(),
});

export type CreateSessionDtoIn = z.infer<typeof schema>;

/**
 * Orchestrates the creation of a new workout session while enforcing system-wide policies.
 * We centralize rule verification here to ensure the data layer remains generic and reusable.
 */
export const createAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<CreateSessionDtoIn>(schema, dtoIn);

  const activeSession = getActiveSession();
  if (activeSession) {
    throwBusinessError('An active session already exists. Finish it before starting a new one.');
  }

  const id = uuidv4();
  const date = data.date || new Date().toISOString().split('T')[0];
  const startTime = new Date().toISOString();
  const name = data.name || `${data.split} ${date}`;

  const session: WorkoutSession = {
    id,
    name,
    date,
    startTime,
    split: data.split,
    status: SessionStatus.ACTIVE,
    note: data.note,
  };

  const result = createSession(session);

  if (result.changes === 0) {
    throwBusinessError('Failed to create workout session.');
  }

  return { ...session, warnings };
};
