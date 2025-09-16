import { Hono } from "hono"
import { comparePassword, generateToken, hashPassword } from "../../utils/auth"
import { randomUUIDv7 } from "bun"
import db from "../../db"

const auth = new Hono()

auth.post("/register", async (c) => {
  const { email, username, password, name, surname } = await c.req.json()

  if (!email || !username || !password) {
    return c.json({ error: "Email, username, and password are required" }, 400)
  }

  const hashed = await hashPassword(password)
  const id = randomUUIDv7()

  try {
    db.run(
      `INSERT INTO users (id, email, username, password, name, surname)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, email, username, hashed, name ?? null, surname ?? null]
    )
  } catch (err: any) {
    return c.json({ error: "User already exists", details: err.message }, 400)
  }

  const token = await generateToken({
    sub: id,
  })

  return c.json({ message: "User registered", token })
})

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json()

  const row = db
    .query(`SELECT id, email, password FROM users WHERE email = ?`)
    .get(email) as { id: string; email: string; password: string } | null

  if (!row) return c.json({ error: "Invalid credentials" }, 401)

  const valid = await comparePassword(password, row.password)
  if (!valid) return c.json({ error: "Invalid credentials" }, 401)

  const token = await generateToken({ sub: row.id })
  return c.json({ token })
})

export default auth
