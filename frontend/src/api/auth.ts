import type { LoginPayload } from "../types/user"
import { api } from "./api"

export const loginApi = (formData: LoginPayload) =>
  api.post("/auth/login", formData)
