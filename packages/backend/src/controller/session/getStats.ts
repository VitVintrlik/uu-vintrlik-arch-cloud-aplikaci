import { Request, Response } from 'express';
import { getStatsAbl } from '../../abl/session/index.js';

export const getStats = (_req: Request, res: Response) => {
  res.json(getStatsAbl());
};
