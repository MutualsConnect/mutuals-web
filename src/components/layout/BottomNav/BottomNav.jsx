import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import { useNotifications } from '../../../hooks/useNotifications'
import UnreadBadge from '../../../features/notifications/components/UnreadBadge'
import './BottomNav.css'
import Icon from '../../common/Icon'

// Navegación inferior para móvil
const ITEMS = [
  { to: ROUTES.HOME, label: 'Inicio', icon: 'home', end: true },
  { to: ROUTES.STREAKS, label: 'Rachas', icon: 'flame' },
  { to: ROUTES.SEARCH, label: 'Buscar', icon: 'search' },
  { to: ROUTES.NOTIFICATIONS, label: 'Avisos', icon: 'bell' },
  { to: ROUTES.PROFILE, label: 'Perfil', icon: 'user' },
]

export default function BottomNav() {
  const { unread } = useNotifications()
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="bottom-nav__item">
          <span className="bottom-nav__icon" aria-hidden>
            <Icon name={item.icon} size={22} />
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
