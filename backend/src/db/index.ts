import { Database } from "bun:sqlite"

const db = new Database("db.sqlite", { create: true })

db.run("PRAGMA journal_mode = WAL;")

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    surname TEXT,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
`)
db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
`)

export default db
