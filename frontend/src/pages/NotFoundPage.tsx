import { useNavigate } from "react-router"

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <main className="flex flex-col justify-center items-center">
      <h1>This page does not exist!</h1>
      <button onClick={() => navigate("/")}>Home Page</button>
    </main>
  )
}

export default NotFoundPage
