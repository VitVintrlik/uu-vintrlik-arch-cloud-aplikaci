import { SessionStatus, type WorkoutSession } from 'shared';

import { useSessionsQuery } from '../api/useSessions';

/** Derives the currently active session by selecting from the full session list. Avoids a separate network request by reusing the session list cache. */
export const useActiveSession = () => {
  const { data: activeSession, isLoading } = useSessionsQuery({
    select: (sessions: WorkoutSession[]) =>
      sessions.find((s) => s.status === SessionStatus.ACTIVE) || null,
  });

  return {
    activeSession,
    hasActiveSession: !!activeSession,
    isLoading,
  };
};
