import { Request, Response } from 'express';

import { updateAbl } from '../../abl/session/index.js';

export const update = (req: Request, res: Response) => {
  const result = updateAbl({
    ...req.body,
    id: req.params.id,
  });
  res.json(result);
};
