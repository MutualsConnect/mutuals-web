import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import { useNotifications } from '../../../hooks/useNotifications'
import UnreadBadge from '../../../features/notifications/components/UnreadBadge'
import './BottomNav.css'

// Navegación inferior para móvil
const ITEMS = [
  { to: ROUTES.HOME, label: 'Inicio', icon: '🏠', end: true },
  { to: ROUTES.STREAKS, label: 'Rachas', icon: '🔥' },
  { to: ROUTES.SEARCH, label: 'Buscar', icon: '🔍' },
  { to: ROUTES.NOTIFICATIONS, label: 'Avisos', icon: '🔔' },
  { to: ROUTES.PROFILE, label: 'Perfil', icon: '👤' },
]

export default function BottomNav() {
  const { unread } = useNotifications()
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="bottom-nav__item">
          <span className="bottom-nav__icon" aria-hidden>
            {item.icon}
            {item.to === ROUTES.NOTIFICATIONS && (
              <span className="bottom-nav__badge">
                <UnreadBadge count={unread.total} dot />
              </span>
            )}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
