import { Hono } from "hono"
import { verify } from "hono/jwt" // import the class
import db from "../../db"

const JWT_SECRET = Bun.env.JWT_SECRET ?? "super_secret"

const me = new Hono()

me.use("/*", async (c, next) => {
  const auth = c.req.header("Authorization")
  if (!auth?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const token = auth.split(" ")[1]

  try {
    const payload = await verify(token, JWT_SECRET)
    c.set("jwtPayload", payload)
    await next()
  } catch (err: any) {
    if (err?.name === "JwtTokenExpired") {
      return c.json({ error: "Token expired" }, 403)
    }

    return c.json({ error: "Unauthorized" }, 401)
  }
})

me.get("/profile", (c) => {
  const payload = c.get("jwtPayload") as { sub: string }

  if (!payload?.sub) {
    return c.json({ error: "Invalid token" }, 403)
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
