import { useNavigate } from "react-router"
import useAuth from "../hooks/useAuth"

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  return (
    <main className="flex flex-col justify-center items-center">
      {user ? (
        <h1>Hi, {user.username}</h1>
      ) : (
        <>
          <h1>You are not logged in.</h1>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      )}
    </main>
  )
}

export default HomePage
