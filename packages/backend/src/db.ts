import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * We utilize an idempotent initialization strategy to ensure the system is self-bootstrapping.
 * Environment-based selection maintains strict isolation for automated testing suites.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTest = process.env.NODE_ENV === 'test';
const dbPath = path.resolve(__dirname, `../${isTest ? 'liftlog.test.db' : 'liftlog.db'}`);

const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS workout_session (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration INTEGER,
    split TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT
  );

  CREATE TABLE IF NOT EXISTS exercise_entry (
    id TEXT PRIMARY KEY,
    workout_session_id TEXT NOT NULL,
    exercise_key TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight REAL NOT NULL,
    rpe INTEGER NOT NULL,
    note TEXT,
    FOREIGN KEY (workout_session_id) REFERENCES workout_session(id) ON DELETE CASCADE
  );
`);

export default db;
