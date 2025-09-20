import { useState, type ChangeEvent, type FormEvent } from "react"
import type { RegisterPayload } from "../types/user"

const RegisterForm = () => {
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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email) return setError("Insert email")
    if (!formData.password) return setError("Insert password")
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
      <label htmlFor="repeatPassword">password</label>
      <input
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        required
        value={formData.password}
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
