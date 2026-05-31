import { Request, Response } from 'express';

import * as ExerciseAbl from '../../abl/exercise/index.js';

export async function list(_req: Request, res: Response) {
  try {
    const exercises = ExerciseAbl.listAbl();
    res.json(exercises);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
}
