import cors from 'cors';
import express from 'express';

import * as ExerciseController from './controller/exercise/index.js';
import * as SessionController from './controller/session/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/session/stats', SessionController.getStats);
app.post('/sessions', SessionController.create);
app.get('/sessions', SessionController.list);
app.get('/sessions/:id', SessionController.get);
app.put('/sessions/:id', SessionController.update);
app.patch('/sessions/:id/finish', SessionController.finish);
app.delete('/sessions/:id', SessionController.remove);

app.post('/sessions/:sessionId/exercises', ExerciseController.add);
app.get('/exercises', ExerciseController.list);
app.put('/exercises/:id', ExerciseController.update);
app.delete('/exercises/:id', ExerciseController.remove);

app.use(errorHandler);

export default app;
