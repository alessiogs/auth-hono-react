import { randomUUIDv7 } from "bun"
import { Hono } from "hono"
import { getSignedCookie, setSignedCookie } from "hono/cookie"
import db from "../../db"
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
} from "../../utils/auth.utils"

const ACCESS_TOKEN_SECONDS = 10
const REFRESH_TOKEN_SECONDS = 10

const auth = new Hono()

const createRefreshToken = (userId: string) => {
  const refreshToken = generateRefreshToken()
  const tokenHash = hashToken(refreshToken)
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_SECONDS * 1000
  ).toISOString() // 7d

  db.run(
    `INSERT INTO refresh_tokens (id, token_hash, user_id, expires_at)
     VALUES (?, ?, ?, ?)`,
    [randomUUIDv7(), tokenHash, userId, expiresAt]
  )

  return refreshToken
}

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

  const accessToken = await generateAccessToken(
    { sub: id },
    ACCESS_TOKEN_SECONDS
  )
  const refreshToken = createRefreshToken(id)

  return c.json({ message: "User registered", accessToken, refreshToken })
})

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json()

  const row = db
    .query(`SELECT id, email, password FROM users WHERE email = ?`)
    .get(email) as { id: string; email: string; password: string } | null

  if (!row) return c.json({ error: "Invalid credentials" }, 401)

  const valid = await comparePassword(password, row.password)
  if (!valid) return c.json({ error: "Invalid credentials" }, 401)

  const accessToken = await generateAccessToken(
    { sub: row.id },
    ACCESS_TOKEN_SECONDS
  )
  const refreshToken = createRefreshToken(row.id)
  await setSignedCookie(
    c,
    "refreshToken",
    refreshToken,
    Bun.env.COOKIE_SECRET ?? "super_secret",
    {
      path: "/",
      secure: false,
      httpOnly: true,
    }
  )

  return c.json({ accessToken })
})

auth.post("/refresh", async (c) => {
  const refreshToken = await getSignedCookie(
    c,
    Bun.env.COOKIE_SECRET ?? "super_secret",
    "refreshToken"
  )
  if (!refreshToken) return c.json({ error: "Refresh token required" }, 400)

  const tokenHash = hashToken(refreshToken)

  const row = db
    .query(
      `SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = ?`
    )
    .get(tokenHash) as { user_id: string; expires_at: string } | null

  if (!row) return c.json({ error: "Invalid refresh token" }, 401)

  if (new Date() > new Date(row.expires_at)) {
    db.run(`DELETE FROM refresh_tokens WHERE token_hash = ?`, [tokenHash])
    return c.json({ error: "Refresh token expired" }, 402)
  }

  db.run(`DELETE FROM refresh_tokens WHERE token_hash = ?`, [tokenHash])

  const accessToken = await generateAccessToken(
    { sub: row.user_id },
    ACCESS_TOKEN_SECONDS
  )
  const newRefreshToken = createRefreshToken(row.user_id)

  await setSignedCookie(
    c,
    "refreshToken",
    newRefreshToken,
    Bun.env.COOKIE_SECRET ?? "super_secret",
    {
      path: "/",
      secure: false,
      httpOnly: true,
    }
  )

  return c.json({ accessToken }, 201)
})

auth.post("/logout", async (c) => {
  const { refreshToken } = await c.req.json()
  if (!refreshToken) return c.json({ success: true })

  const tokenHash = hashToken(refreshToken)
  db.run(`DELETE FROM refresh_tokens WHERE token_hash = ?`, [tokenHash])

  return c.json({ success: true })
})

export default auth
