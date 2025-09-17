import { useState, type ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import { type User } from "../../types/user"

type AuthProviderProps = { children: ReactNode }

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState("")
  const [persist, setPersist] = useState<boolean>(
    localStorage.getItem("persist") === "true" || false
  )
  return (
    <AuthContext.Provider
      value={{ user, setUser, token, setToken, persist, setPersist }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
