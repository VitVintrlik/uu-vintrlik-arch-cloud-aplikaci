import { ExerciseEntry } from 'shared';

import { listExercises } from '../../dao/exerciseDao.js';

/**
 * Retrieves the global list of exercise entries.
 * This can be used for cross-session analytics and volume tracking on the dashboard.
 */
export function listAbl(): { itemList: ExerciseEntry[] } {
  return { itemList: listExercises() };
}
