import { useCallback, useEffect, useMemo, useState } from 'react'
import { NotificationsContext } from './NotificationsContext'
import { notificationService } from '../features/notifications/services/notificationService'
import { UNREAD_POLL_MS } from '../features/notifications/constants'
import { useAuth } from '../hooks/useAuth'

const EMPTY = { total: 0, high: 0, low: 0 }

// Mantiene el contador de no leídas (punto rojo). Se actualiza cada minuto
// y cuando el usuario vuelve a la pestaña.
export function NotificationsProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [unread, setUnread] = useState(EMPTY)

  const refreshUnread = useCallback(async () => {
    try {
      setUnread(await notificationService.getUnreadCount())
    } catch {
      // Si falla, se mantiene el último valor
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    const load = () =>
      notificationService
        .getUnreadCount()
        .then((count) => {
          if (active) setUnread(count)
        })
        .catch(() => {})

    load()
    const timer = setInterval(load, UNREAD_POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [isAuthenticated])

  // Para actualizar el contador al instante al marcar como leída
  const decrementUnread = useCallback((priority) => {
    setUnread((u) => ({
      total: Math.max(0, u.total - 1),
      high: priority === 'HIGH' ? Math.max(0, u.high - 1) : u.high,
      low: priority === 'LOW' ? Math.max(0, u.low - 1) : u.low,
    }))
  }, [])

  const clearUnread = useCallback(() => setUnread(EMPTY), [])

  // Sin sesión el contador siempre es 0 (no queda el del usuario anterior)
  const visibleUnread = isAuthenticated ? unread : EMPTY

  const value = useMemo(
    () => ({ unread: visibleUnread, refreshUnread, decrementUnread, clearUnread }),
    [visibleUnread, refreshUnread, decrementUnread, clearUnread],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
