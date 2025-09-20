import { createHash } from "crypto"
import { sign, verify } from "hono/jwt"
import { JWTPayload } from "hono/utils/jwt/types"

const JWT_SECRET = Bun.env.JWT_SECRET ?? "super_secret"

export const hashPassword = (password: string) => {
  return Bun.password.hash(password)
}

export const comparePassword = async (password: string, hashed: string) => {
  return Bun.password.verify(password, hashed)
}

export const generateAccessToken = async (
  payload: JWTPayload,
  expSeconds: number
) => {
  return await sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + expSeconds },
    JWT_SECRET
  )
}

export const verifyAccessToken = async (token: string) => {
  try {
    return await verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export const generateRefreshToken = () => crypto.randomUUID()
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex")
