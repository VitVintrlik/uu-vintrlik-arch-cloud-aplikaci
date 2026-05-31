import { Request, Response } from 'express';

import { addAbl } from '../../abl/exercise/index.js';

export const add = (req: Request, res: Response) => {
  const result = addAbl({
    ...req.body,
    workoutSessionId: req.params.sessionId,
  });
  res.status(201).json(result);
};
