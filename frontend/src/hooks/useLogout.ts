import { useSetAtom } from "jotai"
import { accessTokenAtom } from "../store/auth"
import { api } from "../api/api"

const useLogout = () => {
  const setAccessToken = useSetAtom(accessTokenAtom)

  const logout = async () => {
    setAccessToken(null)
    try {
      await api("/logout", {
        withCredentials: true,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return logout
}

export default useLogout
