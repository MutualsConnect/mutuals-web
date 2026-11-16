import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
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
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="bottom-nav__item">
          <span aria-hidden>{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
