import './UnreadBadge.css'

// Número (o punto si dot=true) de notificaciones sin leer
export default function UnreadBadge({ count, dot = false }) {
  if (!count) return null
  if (dot) return <span className="unread-badge unread-badge--dot" aria-label={`${count} sin leer`} />
  return (
    <span className="unread-badge" aria-label={`${count} sin leer`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
