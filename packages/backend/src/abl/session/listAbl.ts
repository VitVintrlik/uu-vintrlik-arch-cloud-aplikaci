import { listSessions } from '../../dao/index.js';

/**
 * Retrieves a list of all workout sessions.
 *
 * Role: Acts as a pass-through to the DAO. In a more complex app, this is where
 * we would handle pagination or permission-based filtering.
 */
export const listAbl = () => {
  const sessions = listSessions();
  return { itemList: sessions };
};
