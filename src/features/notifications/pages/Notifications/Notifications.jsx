import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationService } from '../../services/notificationService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { useNotifications } from '../../../../hooks/useNotifications'
import { getErrorMessage } from '../../../../utils/errors'
import { NOTIFICATION_TABS, getNotificationLink } from '../../constants'
import Button from '../../../../components/common/Button'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import NotificationItem from '../../components/NotificationItem'
import '../../components/NotificationItem/NotificationItem.css'
import './Notifications.css'

export default function Notifications() {
  const navigate = useNavigate()
  const { unread, decrementUnread, clearUnread, refreshUnread } = useNotifications()
  const [priority, setPriority] = useState('')
  const list = usePaginated((page) => notificationService.list(priority, page), [priority])
  const [markingAll, setMarkingAll] = useState(false)
  const [actionError, setActionError] = useState('')

  const unreadInTab = priority === 'HIGH' ? unread.high : priority === 'LOW' ? unread.low : unread.total

  const open = async (notification) => {
    if (!notification.read) {
      // Se marca como leída sin esperar, para no frenar la navegación
      list.setItems(list.items.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
      decrementUnread(notification.priority)
      notificationService.markRead(notification.id).catch(() => refreshUnread())
    }
    const link = getNotificationLink(notification)
    if (link) navigate(link)
  }

  const markAll = async () => {
    setMarkingAll(true)
    setActionError('')
    try {
      await notificationService.markAllRead()
      list.setItems(list.items.map((n) => ({ ...n, read: true })))
      clearUnread()
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudieron marcar como leídas'))
    } finally {
      setMarkingAll(false)
    }
  }

  const tabs = NOTIFICATION_TABS.map((t) => {
    const count = t.value === 'HIGH' ? unread.high : t.value === 'LOW' ? unread.low : unread.total
    return { ...t, label: count ? `${t.label} (${count})` : t.label }
  })

  return (
    <section className="notifications-page">
      <header className="notifications-page__header">
        <h1 className="notifications-page__title">Notificaciones</h1>
        <Button size="sm" variant="ghost" onClick={markAll} loading={markingAll} disabled={!unread.total}>
          Marcar todas como leídas
        </Button>
      </header>

      <Tabs tabs={tabs} value={priority} onChange={setPriority} />
      <ErrorMessage message={actionError} />

      {list.loading ? (
        <Loader />
      ) : list.error && !list.items.length ? (
        <ErrorMessage message={list.error} onRetry={list.reload} />
      ) : !list.items.length ? (
        <EmptyState
          title="No tienes notificaciones"
          description={
            priority === 'LOW'
              ? 'Aquí verás nuevos seguidores y rachas largas de perfiles que sigues.'
              : 'Aquí verás invitaciones, confirmaciones y avisos de tus rachas.'
          }
        />
      ) : (
        <>
          {unreadInTab > 0 && (
            <p className="notifications-page__hint">Toca una notificación para abrirla.</p>
          )}
          <ul className="notification-list">
            {list.items.map((n) => (
              <NotificationItem key={n.id} notification={n} onOpen={open} />
            ))}
          </ul>
          {list.error && <ErrorMessage message={list.error} onRetry={list.loadMore} />}
          {list.hasMore && (
            <Button variant="secondary" onClick={list.loadMore} loading={list.loadingMore}>
              Ver más
            </Button>
          )}
        </>
      )}
    </section>
  )
}
