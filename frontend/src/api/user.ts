import { api } from "./api"

export const getUserProfileApi = () => api.get("/me/profile")
