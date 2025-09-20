import { Hono } from "hono"
import { jwt } from "hono/jwt"
import db from "../../db"

const JWT_SECRET = Bun.env.JWT_SECRET ?? "super_secret"

const me = new Hono()

me.use("/*", jwt({ secret: JWT_SECRET }))

me.get("/profile", (c) => {
  const payload = c.get("jwtPayload") as { sub: string }

  if (!payload?.sub) {
    return c.json({ error: "Invalid token" }, 401)
  }

  const row = db
    .query(
      `SELECT id, email, username, name, surname, created_at
       FROM users
       WHERE id = ?`
    )
    .get(payload.sub) as {
    id: string
    email: string
    username: string
    name: string | null
    surname: string | null
    created_at: string
  } | null

  if (!row) return c.json({ error: "User not found" }, 404)

  return c.json(row)
})

export default me
