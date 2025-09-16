import { sign } from "hono/jwt"
import { JWTPayload } from "hono/utils/jwt/types"

const JWT_SECRET = Bun.env.JWT_SECRET ?? "super_secret"

export const hashPassword = (password: string) => {
  return Bun.password.hash(password)
}

export const comparePassword = async (password: string, hashed: string) => {
  const response = await Bun.password.verify(password, hashed)
  return response
}

export const generateToken = async (payload: JWTPayload) => {
  return await sign(payload, JWT_SECRET)
}
