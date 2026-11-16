import { formatRelativeTime } from '../../../../utils/format'
import { NOTIFICATION_ICONS } from '../../constants'
import './NotificationItem.css'
import Icon from '../../../../components/common/Icon'

export default function NotificationItem({ notification, onOpen }) {
  const { type, title, body, read, createdAt } = notification

  return (
    <li>
      <button
        type="button"
        className={`notification-item ${read ? '' : 'notification-item--unread'}`}
        onClick={() => onOpen(notification)}
      >
        <span className="notification-item__icon" aria-hidden>
          <Icon name={NOTIFICATION_ICONS[type] ?? 'bell'} size={20} />
        </span>
        <span className="notification-item__body">
          <span className="notification-item__title">{title}</span>
          {body && <span className="notification-item__text">{body}</span>}
          <span className="notification-item__time">{formatRelativeTime(createdAt)}</span>
        </span>
        {!read && <span className="notification-item__dot" aria-label="No leída" />}
      </button>
    </li>
  )
}
