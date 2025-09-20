import { useEffect, useRef } from "react"
import { privateApi } from "../api/api"
import { useAtomValue } from "jotai"
import { accessTokenAtom } from "../store/auth"
import useRefreshToken from "./useRefreshToken"

const usePrivateApi = () => {
  const refresh = useRefreshToken()
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
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
          return privateApi(prevRequest)
        }
        return Promise.reject(error)
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
