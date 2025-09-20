import { useSetAtom } from "jotai"
import { api } from "../api/api"
import { accessTokenAtom } from "../store/auth"

const useRefreshToken = () => {
  const setAccessToken = useSetAtom(accessTokenAtom)

  const refresh = async () => {
    const { data } = await api.get("/auth/refresh", {
      withCredentials: true,
    })
    setAccessToken(data.accessToken)
    return data.accessToken
  }
  return refresh
}

export default useRefreshToken
