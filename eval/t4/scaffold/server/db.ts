// One SQLite file. DB_FILE picks it, ":memory:" in tests.
import { Database } from "bun:sqlite";
export function open(file = process.env.DB_FILE ?? "data.db") {
  const db = new Database(file, { create: true });
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS firms (id TEXT PRIMARY KEY, name TEXT NOT NULL, state TEXT NOT NULL, gstin TEXT);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, firm_id TEXT NOT NULL REFERENCES firms(id), email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('owner','accountant','viewer')));
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL);
  `);
  return db;
}
export type DB = ReturnType<typeof open>;
