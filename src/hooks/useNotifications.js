import { useContext } from 'react'
import { NotificationsContext } from '../context/NotificationsContext'

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) throw new Error('useNotifications debe usarse dentro de <NotificationsProvider>')
  return context
}
