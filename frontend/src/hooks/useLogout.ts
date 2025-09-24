import { useSetAtom } from "jotai"
import { api } from "../api/api"
import { accessTokenAtom } from "../store/auth"
import { userAtom } from "../store/user"
import tryCatch from "../utils/tryCatch"

const useLogout = () => {
  const setAccessToken = useSetAtom(accessTokenAtom)
  const setUser = useSetAtom(userAtom)

  const logout = async () => {
    setAccessToken(null)
    setUser(null)
    const { error } = await tryCatch(
      api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
    )
    if (error) console.log(error)
  }

  return logout
}

export default useLogout
