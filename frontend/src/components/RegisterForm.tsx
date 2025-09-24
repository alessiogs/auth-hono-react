import { useState, type ChangeEvent, type FormEvent } from "react"
import type { RegisterPayload } from "../types/user"
import { api, privateApi } from "../api/api"
import { useSetAtom } from "jotai"
import { accessTokenAtom } from "../store/auth"
import { userAtom } from "../store/user"
import { useNavigate } from "react-router"
import { AxiosError } from "axios"

const RegisterForm = () => {
  const navigate = useNavigate()
  const setToken = useSetAtom(accessTokenAtom)
  const setUser = useSetAtom(userAtom)
  const [formData, setFormData] = useState<
    RegisterPayload & { repeatedPassword: string }
  >({
    email: "",
    password: "",
    repeatedPassword: "",
    username: "",
    name: "",
    surname: "",
  })
  const [error, setError] = useState<string>("")

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email) return setError("Insert email")
    if (!formData.password) return setError("Insert password")
    try {
      const { data: tokenData } = await api.post("/auth/register", formData, {
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
    <form onSubmit={handleSubmit} className="flex flex-col w-full md:max-w-2/3">
      <label htmlFor="email">email</label>
      <input
        type="text"
        name="email"
        id="email"
        required
        value={formData.email}
        onChange={handleChange}
      />
      <label htmlFor="password">password</label>
      <input
        type="password"
        name="password"
        id="password"
        required
        value={formData.password}
        onChange={handleChange}
      />
      <label htmlFor="repeatPassword">repeat password</label>
      <input
        type="password"
        name="repeatedPassword"
        id="repeatedPassword"
        required
        value={formData.repeatedPassword}
        onChange={handleChange}
      />
      <label htmlFor="username">username</label>
      <input
        type="text"
        name="username"
        id="username"
        required
        value={formData.username}
        onChange={handleChange}
      />
      <label htmlFor="name">name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
      />
      <label htmlFor="surname">surname</label>
      <input
        type="text"
        name="surname"
        id="surname"
        value={formData.surname}
        onChange={handleChange}
      />
      <button className="mt-4" type="submit">
        Register
      </button>
      {error}
    </form>
  )
}

export default RegisterForm
