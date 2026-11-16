import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../features/auth/services/authService'
import { AUTH_LOGOUT_EVENT } from '../api/axiosClient'
import { tokenStorage } from '../utils/storage'
import { ROLES } from '../constants/roles'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(tokenStorage.getAccessToken()))

  // Al abrir la app, si hay token guardado, recupera el usuario
  useEffect(() => {
    if (!tokenStorage.getAccessToken()) return
    authService
      .getMe()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  // Si el refresh token falla, axiosClient emite este evento
  useEffect(() => {
    const onForcedLogout = () => setUser(null)
    window.addEventListener(AUTH_LOGOUT_EVENT, onForcedLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onForcedLogout)
  }, [])

  const startSession = useCallback((authResponse) => {
    tokenStorage.setTokens(authResponse)
    setUser(authResponse.user)
    return authResponse.user
  }, [])

  const login = useCallback(
    async (credentials) => startSession(await authService.login(credentials)),
    [startSession],
  )

  const register = useCallback(
    async (payload) => startSession(await authService.register(payload)),
    [startSession],
  )

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    try {
      if (refreshToken) await authService.logout(refreshToken)
    } finally {
      tokenStorage.clear()
      setUser(null)
    }
  }, [])

  // Cierra la sesión solo en el navegador (por ejemplo, después de eliminar la cuenta)
  const clearSession = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await authService.getMe()
    setUser(me)
    return me
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.roles?.includes(ROLES.ADMIN)),
      login,
      register,
      logout,
      clearSession,
      refreshUser,
      setUser,
    }),
    [user, loading, login, register, logout, clearSession, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
