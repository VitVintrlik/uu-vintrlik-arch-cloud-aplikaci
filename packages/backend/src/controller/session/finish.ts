import { Request, Response } from 'express';

import { finishAbl } from '../../abl/session/index.js';

export const finish = (req: Request, res: Response) => {
  const result = finishAbl({ id: req.params.id, note: req.body?.note });
  res.json(result);
};
