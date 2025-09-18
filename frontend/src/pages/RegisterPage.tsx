import { useNavigate } from "react-router"
import RegisterForm from "../components/RegisterForm"

const RegisterPage = () => {
  const navigate = useNavigate()
  return (
    <main className="flex flex-row h-full">
      <div className="w-1/2 flex justify-center items-center">
        Image placeholder
      </div>
      <div className="w-1/2 p-4 flex flex-col justify-center items-center">
        <h3>Login</h3>
        <RegisterForm />
        <section className="flex flex-col text-center w-full md:max-w-2/3 space-y-4 mt-4">
          <span>Already registered?</span>
          <button onClick={() => navigate("/login")}>Login now</button>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage
