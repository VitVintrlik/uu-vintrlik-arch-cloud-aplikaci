import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.resolve(__dirname, 'liftlog.db'));

db.pragma('foreign_keys = ON');

// Clear existing data
db.exec('DELETE FROM exercise_entry');
db.exec('DELETE FROM workout_session');
console.log('Database cleared.');

const insertSession = db.prepare(`
  INSERT INTO workout_session (id, name, date, start_time, end_time, duration, split, status, note)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertExercise = db.prepare(`
  INSERT INTO exercise_entry (id, workout_session_id, exercise_key, sets, reps, weight, rpe, note)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

type Exercise = { key: string; sets: number; reps: number; weight: number; rpe: number; note?: string };
type Session = {
  name: string; date: string; startTime: string; duration: number;
  split: string; note?: string; exercises: Exercise[];
};

const sessions: Session[] = [
  {
    name: 'Full Body 01.04.2026',
    date: '2026-04-01',
    startTime: '07:15:00',
    duration: 65,
    split: 'FULL_BODY',
    exercises: [
      { key: 'bench-press',     sets: 4, reps: 6, weight: 70,  rpe: 7 },
      { key: 'squat',           sets: 4, reps: 6, weight: 80,  rpe: 7 },
      { key: 'deadlift',        sets: 3, reps: 5, weight: 100, rpe: 7 },
      { key: 'overhead-press',  sets: 3, reps: 8, weight: 45,  rpe: 6 },
    ],
  },
  {
    name: 'Push - první benchmark',
    date: '2026-04-05',
    startTime: '08:00:00',
    duration: 55,
    split: 'PPL',
    note: 'Zkouším nové schéma, uvidíme jak to půjde.',
    exercises: [
      { key: 'bench-press',      sets: 4, reps: 6, weight: 72.5, rpe: 8 },
      { key: 'overhead-press',   sets: 3, reps: 8, weight: 47.5, rpe: 7 },
      { key: 'tricep-extension', sets: 3, reps: 12, weight: 25,  rpe: 7 },
    ],
  },
  {
    name: 'Upper/Lower 08.04.2026',
    date: '2026-04-08',
    startTime: '07:30:00',
    duration: 70,
    split: 'UPPER_LOWER',
    exercises: [
      { key: 'bench-press',  sets: 4, reps: 6, weight: 72.5, rpe: 7 },
      { key: 'pull-ups',     sets: 3, reps: 8, weight: 5,    rpe: 7 },
      { key: 'overhead-press', sets: 3, reps: 8, weight: 47.5, rpe: 7 },
      { key: 'bicep-curl',   sets: 3, reps: 12, weight: 17.5, rpe: 6, note: 'Cítím to víc na pravé paži.' },
    ],
  },
  {
    name: 'Full Body 12.04.2026',
    date: '2026-04-12',
    startTime: '09:00:00',
    duration: 60,
    split: 'FULL_BODY',
    note: 'Trochu unavený, ale porad dobre.',
    exercises: [
      { key: 'bench-press', sets: 4, reps: 5, weight: 75,   rpe: 8 },
      { key: 'squat',       sets: 4, reps: 6, weight: 82.5, rpe: 7 },
      { key: 'deadlift',    sets: 3, reps: 5, weight: 102.5, rpe: 7 },
      { key: 'pull-ups',    sets: 3, reps: 8, weight: 5,    rpe: 7 },
    ],
  },
  {
    name: 'Hrudník + Záda',
    date: '2026-04-17',
    startTime: '07:45:00',
    duration: 80,
    split: 'ARNOLD',
    exercises: [
      { key: 'bench-press',  sets: 4, reps: 5, weight: 75,   rpe: 8 },
      { key: 'pull-ups',     sets: 4, reps: 8, weight: 7.5,  rpe: 8 },
      { key: 'overhead-press', sets: 3, reps: 8, weight: 50, rpe: 7 },
      { key: 'bicep-curl',   sets: 3, reps: 12, weight: 17.5, rpe: 6 },
    ],
  },
  {
    name: 'Push Pull Legs 22.04.2026',
    date: '2026-04-22',
    startTime: '07:00:00',
    duration: 75,
    split: 'PPL',
    note: 'Nohy mě zabily. Dřep byl těžký.',
    exercises: [
      { key: 'squat',            sets: 4, reps: 6, weight: 85,   rpe: 8 },
      { key: 'deadlift',         sets: 3, reps: 5, weight: 105,  rpe: 8 },
      { key: 'tricep-extension', sets: 3, reps: 12, weight: 27.5, rpe: 7 },
      { key: 'bicep-curl',       sets: 3, reps: 12, weight: 17.5, rpe: 6 },
    ],
  },
  {
    name: 'Ramenní den',
    date: '2026-04-27',
    startTime: '10:00:00',
    duration: 50,
    split: 'BRO_SPLIT',
    exercises: [
      { key: 'overhead-press',   sets: 4, reps: 8,  weight: 52.5, rpe: 8 },
      { key: 'bicep-curl',       sets: 3, reps: 12, weight: 20,   rpe: 7 },
      { key: 'tricep-extension', sets: 3, reps: 12, weight: 27.5, rpe: 7 },
    ],
  },
  {
    name: 'Upper/Lower 03.05.2026',
    date: '2026-05-03',
    startTime: '08:15:00',
    duration: 65,
    split: 'UPPER_LOWER',
    note: 'Lepší než minule, bench šel nahoru.',
    exercises: [
      { key: 'bench-press', sets: 4, reps: 5, weight: 77.5,  rpe: 8 },
      { key: 'squat',       sets: 4, reps: 5, weight: 87.5,  rpe: 8 },
      { key: 'deadlift',    sets: 3, reps: 5, weight: 107.5, rpe: 8 },
      { key: 'pull-ups',    sets: 3, reps: 8, weight: 10,    rpe: 8 },
    ],
  },
  {
    name: 'Silový trénink',
    date: '2026-05-10',
    startTime: '07:30:00',
    duration: 85,
    split: 'FULL_BODY',
    exercises: [
      { key: 'bench-press',    sets: 5, reps: 3, weight: 80,  rpe: 9, note: 'Nejteší bench zatím.' },
      { key: 'squat',          sets: 5, reps: 3, weight: 90,  rpe: 9 },
      { key: 'deadlift',       sets: 4, reps: 3, weight: 110, rpe: 9 },
      { key: 'overhead-press', sets: 3, reps: 6, weight: 55,  rpe: 8 },
    ],
  },
  {
    name: 'Push Pull Legs 17.05.2026',
    date: '2026-05-17',
    startTime: '08:00:00',
    duration: 70,
    split: 'PPL',
    note: 'Nový rekord na benchi! +2.5kg. Cítím progres.',
    exercises: [
      { key: 'bench-press',      sets: 4, reps: 4, weight: 82.5, rpe: 9, note: 'PR!' },
      { key: 'overhead-press',   sets: 3, reps: 6, weight: 55,   rpe: 8 },
      { key: 'tricep-extension', sets: 3, reps: 12, weight: 30,  rpe: 7 },
      { key: 'pull-ups',         sets: 3, reps: 8,  weight: 12.5, rpe: 8 },
    ],
  },
];

const seedAll = db.transaction(() => {
  for (const s of sessions) {
    const id = randomUUID();
    const start = new Date(`${s.date}T${s.startTime}`);
    const end = new Date(start.getTime() + s.duration * 60_000);
    const endTime = end.toTimeString().slice(0, 8);

    insertSession.run(
      id, s.name, s.date, s.startTime, endTime, s.duration,
      s.split, 'FINISHED', s.note ?? null,
    );

    for (const e of s.exercises) {
      insertExercise.run(
        randomUUID(), id, e.key, e.sets, e.reps, e.weight, e.rpe, e.note ?? null,
      );
    }
  }
});

seedAll();
console.log(`Seeded ${sessions.length} sessions with exercises.`);
