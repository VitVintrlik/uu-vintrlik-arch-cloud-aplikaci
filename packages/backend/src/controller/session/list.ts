import { Request, Response } from 'express';

import { listAbl } from '../../abl/session/index.js';

export const list = (_req: Request, res: Response) => {
  const result = listAbl();
  res.json(result);
};
