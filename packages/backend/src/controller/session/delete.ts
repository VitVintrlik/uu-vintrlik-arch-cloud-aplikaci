import { Request, Response } from 'express';

import { deleteAbl } from '../../abl/session/index.js';

export const remove = (req: Request, res: Response) => {
  const result = deleteAbl({ id: req.params.id });
  res.json(result);
};
