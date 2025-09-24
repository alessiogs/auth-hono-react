import { useAtom, useSetAtom } from "jotai"
import { useNavigate } from "react-router"
import usePrivateApi from "../hooks/usePrivateApi"
import { userAtom } from "../store/user"
import tryCatch from "../utils/tryCatch"
import { useState } from "react"
import { type User } from "../types/user"
import type { AxiosError } from "axios"

const HomePage = () => {
  const [user] = useAtom(userAtom)
  const navigate = useNavigate()
  const privateApi = usePrivateApi()
  const [error, setError] = useState("")
  const [count, setCount] = useState(0)
  const setUser = useSetAtom(userAtom)
  const handleGetUserInfo = async () => {
    setError("")
    const { data, error } = await tryCatch(privateApi.get("/me/profile"))
    setCount((prev) => prev + 1)
    if (error) {
      const axiosError = error as AxiosError
      switch (axiosError?.response?.status) {
        case 401:
          setError("Invalid token")
          setUser(null)
          break

        default:
          setError("Unexpected error")
      }
      return
    }
    setUser(data.data)
  }
  return (
    <main className="flex flex-col justify-start items-center h-full gap-y-8">
      {user ? (
        <section>
          <h1>Hi, {user.username}</h1>
        </section>
      ) : (
        <>
          <h1>You are not logged in.</h1>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      )}
      <button onClick={handleGetUserInfo}>Get User Info (Auth Only)</button>
      {user && (
        <>
          {count && <h5>Request number {count}</h5>}
          <ul className="">
            {(Object.keys(user as User) as Array<keyof User>).map((item) => (
              <li key={String(item)}>
                {item}: {user[item]}
              </li>
            ))}
          </ul>
        </>
      )}
      {error}
    </main>
  )
}

export default HomePage
