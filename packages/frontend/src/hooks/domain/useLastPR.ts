import { useMemo } from 'react';

import { SessionStatus, EXERCISE_LIBRARY, type ExerciseKey } from 'shared';

import { useAllExercisesQuery } from '../api/useExercises';
import { useSessionsQuery } from '../api/useSessions';

export type LastPR = {
  exerciseKey: ExerciseKey;
  exerciseName: string;
  weight: number;
  delta: number;
};

const POWERLIFTING_LIFTS: ExerciseKey[] = ['bench-press', 'deadlift', 'squat'];

/** Scans finished sessions to find the most recent personal record across the powerlifting lifts (bench, deadlift, squat). Returns the first lift where the latest session weight exceeded the previous best. */
export const useLastPR = (): { lastPR: LastPR | null; isLoading: boolean } => {
  const { data: sessions, isLoading: sessionsLoading } = useSessionsQuery();
  const { data: exercises, isLoading: exercisesLoading } = useAllExercisesQuery();

  const lastPR = useMemo(() => {
    if (!sessions || !exercises) return null;

    const finished = sessions
      .filter((s) => s.status === SessionStatus.FINISHED)
      .sort((a, b) => b.date.localeCompare(a.date));

    return POWERLIFTING_LIFTS.reduce<LastPR | null>((found, key) => {
      if (found) return found;

      const sessionBests = finished
        .map((s) =>
          exercises
            .filter((e) => e.exerciseKey === key && e.workoutSessionId === s.id)
            .reduce((max, e) => Math.max(max, e.weight), 0),
        )
        .filter((w) => w > 0);

      const [latest, previous] = sessionBests;
      if (!previous || latest <= previous) return null;

      return {
        exerciseKey: key,
        exerciseName: EXERCISE_LIBRARY.find((ex) => ex.key === key)?.name ?? key,
        weight: latest,
        delta: latest - previous,
      };
    }, null);
  }, [sessions, exercises]);

  return { lastPR, isLoading: sessionsLoading || exercisesLoading };
};
