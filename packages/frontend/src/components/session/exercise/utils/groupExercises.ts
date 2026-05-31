import type { ExerciseEntry, ExerciseKey } from 'shared';

/** Merges pending exercise selections with saved entries into a grouped structure. Pending keys appear first, ensuring newly selected exercises are visible before their first set is saved. */
export const buildGroupedExercises = (entries: ExerciseEntry[], pendingKeys: ExerciseKey[]) => {
  const allKeys = [...new Set([...pendingKeys, ...entries.map((e) => e.exerciseKey)])];
  return allKeys.map((key) => ({
    key,
    sets: entries.filter((e) => e.exerciseKey === key),
  }));
};
