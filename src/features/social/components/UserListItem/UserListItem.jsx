import { Link } from 'react-router-dom'
import { profilePath } from '../../../../constants/routes'
import Avatar from '../../../../components/common/Avatar'
import './UserListItem.css'

// Fila de un usuario (UserSummaryResponse). action: botón opcional a la derecha.
export default function UserListItem({ user, action, subtitle }) {
  return (
    <div className="user-list-item">
      <Link to={profilePath(user.username)} className="user-list-item__link">
        <Avatar src={user.avatarUrl} name={user.displayName} size={44} />
        <span className="user-list-item__text">
          <span className="user-list-item__name">{user.displayName}</span>
          <span className="user-list-item__username">
            @{user.username}
            {subtitle ? ` · ${subtitle}` : ''}
          </span>
        </span>
        {user.personalStreak > 0 && (
          <span className="user-list-item__streak" title="Racha personal">
            🔥 {user.personalStreak}
          </span>
        )}
      </Link>
      {action && <div className="user-list-item__action">{action}</div>}
    </div>
  )
}
