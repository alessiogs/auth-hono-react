import { useAtom } from "jotai"
import { useNavigate } from "react-router"
import usePrivateApi from "../hooks/usePrivateApi"
import { userAtom } from "../store/user"

const HomePage = () => {
  const [user] = useAtom(userAtom)
  const navigate = useNavigate()
  const privateApi = usePrivateApi()
  const handleGetUserInfo = async () => await privateApi.get("/me/profile")
  return (
    <main className="flex flex-col justify-center items-center">
      {user ? (
        <>
          <h1>Hi, {user.username}</h1>
          <button onClick={handleGetUserInfo}>Get User Info</button>
        </>
      ) : (
        <>
          <h1>You are not logged in.</h1>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={handleGetUserInfo}>Get User Info</button>
        </>
      )}
    </main>
  )
}

export default HomePage
