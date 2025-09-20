import { AxiosError } from "axios"
import { useSetAtom } from "jotai"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { api } from "../api/api"
import usePrivateApi from "../hooks/usePrivateApi"
import { accessTokenAtom } from "../store/auth"
import { userAtom } from "../store/user"
import type { LoginPayload } from "../types/user"

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()
  const setToken = useSetAtom(accessTokenAtom)
  const setUser = useSetAtom(userAtom)
  const privateApi = usePrivateApi()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email) return setError("Insert email")
    if (!formData.password) return setError("Insert password")
    try {
      const { data: tokenData } = await api.post("/auth/login", formData, {
        withCredentials: true,
      })
      setToken(tokenData.accessToken)
      const { data: userData } = await privateApi.get("/me/profile", {
        headers: { Authorization: `Bearer ${tokenData.accessToken}` },
      })
      setUser(userData)
      navigate("/")
    } catch (error) {
      if (error instanceof AxiosError) return setError(error.message)
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-full md:max-w-2/3"
    >
      <label className="flex flex-col" htmlFor="email">
        email
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-col" htmlFor="password">
        password
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <button className="mt-2" type="submit">
        Login
      </button>
      {error}
    </form>
  )
}

export default LoginForm
