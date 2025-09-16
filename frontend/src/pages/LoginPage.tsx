import LoginForm from "../components/LoginForm"

const LoginPage = () => {
  return (
    <main className="flex flex-row h-full">
      <div className="w-1/2 flex justify-center items-center">
        Image placeholder
      </div>
      <div className="w-1/2 p-4">
        <h3>Login</h3>
        <LoginForm />
      </div>
    </main>
  )
}

export default LoginPage
