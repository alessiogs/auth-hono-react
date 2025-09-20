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

db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`)
db.run(
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);`
)

db.run(`
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    token_hash TEXT UNIQUE NOT NULL,  -- hashed refresh token
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

db.run(
  `CREATE INDEX IF NOT EXISTS idx_refresh_user_id ON refresh_tokens(user_id);`
)

export default db
