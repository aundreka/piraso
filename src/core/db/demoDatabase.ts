import type { Database } from 'sql.js';
import { createEmptyDatabase } from './initSqlJs';

export async function createDemoDatabase(): Promise<Database> {
  const db = await createEmptyDatabase();

  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      department_id INTEGER
    );
  `);

  db.run(`
    CREATE TABLE departments (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  db.run(`
    INSERT INTO departments (id, name) VALUES
    (1, 'Engineering'),
    (2, 'Marketing'),
    (3, 'Finance');
  `);

  db.run(`
    INSERT INTO users (id, name, age, department_id) VALUES
    (1, 'Alice', 25, 1),
    (2, 'Bob', 30, 2),
    (3, 'Charlie', 28, 1),
    (4, 'Diana', 35, 3),
    (5, 'Evan', 22, 2);
  `);

  return db;
}