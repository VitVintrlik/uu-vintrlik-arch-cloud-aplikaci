import { z } from 'zod';

import { SessionStatus } from 'shared';

import { getSession, updateSession } from '../../dao/index.js';
import { validateDtoIn, throwBusinessError } from '../../helpers/validator.js';

const schema = z.object({
  id: z.string().uuid(),
  note: z.string().optional(),
});

export type FinishSessionDtoIn = z.infer<typeof schema>;

/**
 * Transitions a session to a terminal state and performs final session calculations.
 * Centralizing this logic ensures data consistency and prevents partial state updates.
 */
export const finishAbl = (dtoIn: unknown) => {
  const { data, warnings } = validateDtoIn<FinishSessionDtoIn>(schema, dtoIn);

  const session = getSession(data.id);
  if (!session) {
    throwBusinessError(`Session with id ${data.id} not found.`);
  }

  if (session.status === SessionStatus.FINISHED) {
    throwBusinessError(`Session with id ${data.id} is already finished.`);
  }

  const endTime = new Date().toISOString();
  const startTimeDate = new Date(session.startTime);
  const endTimeDate = new Date(endTime);

  const durationMs = endTimeDate.getTime() - startTimeDate.getTime();
  const duration = Math.max(0, Math.round(durationMs / (1000 * 60)));

  session.endTime = endTime;
  session.duration = duration;
  session.status = SessionStatus.FINISHED;

  if (data.note !== undefined) {
    session.note = data.note;
  }

  const result = updateSession(session);
  if (result.changes === 0) {
    throwBusinessError(`Failed to finish session with id ${data.id}.`);
  }

  return { ...session, warnings };
};
