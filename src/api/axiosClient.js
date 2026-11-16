import axios from 'axios'
import { env } from '../config/env'
import { tokenStorage } from '../utils/storage'

export const AUTH_LOGOUT_EVENT = 'auth:logout'

// Sin Content-Type fijo: axios pone application/json al mandar objetos y,
// con FormData (subida de fotos), deja que el navegador ponga multipart/form-data.
const axiosClient = axios.create({
  baseURL: env.apiUrl,
})

// Agrega el access token a cada petición
axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el access token venció (401), intenta renovarlo con el refresh token
// una sola vez y repite las peticiones que estaban esperando.
let refreshPromise = null

async function refreshTokens() {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) throw new Error('No hay refresh token')
  const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, { refreshToken })
  tokenStorage.setTokens(data)
  return data.accessToken
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthCall = original?.url?.startsWith('/auth/')

    if (error.response?.status !== 401 || original._retry || isAuthCall) {
      return Promise.reject(error)
    }

    original._retry = true
    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null
      })
      const newToken = await refreshPromise
      original.headers.Authorization = `Bearer ${newToken}`
      return axiosClient(original)
    } catch (refreshError) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
      return Promise.reject(refreshError)
    }
  },
)

export default axiosClient
