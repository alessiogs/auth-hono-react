import { useEffect, useRef } from "react"
import { privateApi } from "../api/api"
import { useAtomValue } from "jotai"
import { accessTokenAtom } from "../store/auth"
import useRefreshToken from "./useRefreshToken"
import useLogout from "./useLogout"
import tryCatch from "../utils/tryCatch"

const usePrivateApi = () => {
  const refresh = useRefreshToken()
  const logout = useLogout()
  const accessToken = useAtomValue(accessTokenAtom)
  const tokenRef = useRef(accessToken)

  useEffect(() => {
    tokenRef.current = accessToken
  }, [accessToken])

  useEffect(() => {
    const requestIntercept = privateApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${tokenRef.current}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = privateApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config
        if (error?.response?.status === 403 && !previousRequest?.sent) {
          previousRequest.sent = true
          const { data, error: refreshError } = await tryCatch(refresh())
          if (refreshError) {
            await logout()
            return Promise.reject(error)
          }
          previousRequest.headers["Authorization"] = `Bearer ${data}`
          return privateApi(previousRequest)
        }
      }
    )

    return () => {
      privateApi.interceptors.request.eject(requestIntercept)
      privateApi.interceptors.response.eject(responseIntercept)
    }
  }, [refresh])

  return privateApi
}

export default usePrivateApi
