import { Request, Response } from 'express';

import { createAbl } from '../../abl/session/index.js';

export const create = (req: Request, res: Response) => {
  const result = createAbl(req.body);
  res.status(201).json(result);
};
