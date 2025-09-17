import { createContext, type Dispatch, type SetStateAction } from "react"
import type { User } from "../../types/user"

type AuthContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  token: string
  setToken: Dispatch<SetStateAction<string>>
  persist: boolean
  setPersist: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
