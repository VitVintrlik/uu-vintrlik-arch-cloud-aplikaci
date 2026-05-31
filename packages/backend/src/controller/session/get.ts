import { Request, Response } from 'express';

import { getAbl } from '../../abl/session/index.js';

export const get = (req: Request, res: Response) => {
  const result = getAbl({ id: req.params.id });
  res.json(result);
};
