import { useState, type ChangeEvent, type FormEvent } from "react"
import type { LoginPayload } from "../types/user"

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email) return setError("Insert email")
    if (!formData.password) return setError("Insert password")
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
