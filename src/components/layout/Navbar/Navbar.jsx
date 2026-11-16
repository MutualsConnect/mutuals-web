import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { ROUTES } from '../../../constants/routes'
import Avatar from '../../common/Avatar'
import './Navbar.css'

const LINKS = [
  { to: ROUTES.HOME, label: 'Inicio', end: true },
  { to: ROUTES.STREAKS, label: 'Rachas' },
  { to: ROUTES.SEARCH, label: 'Buscar' },
  { to: ROUTES.CHALLENGES, label: 'Retos' },
  { to: ROUTES.TIMELINE, label: 'Actividad' },
  { to: ROUTES.NOTIFICATIONS, label: 'Notificaciones' },
]

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <header className="navbar">
      <Link to={ROUTES.HOME} className="navbar__brand">
        Mutuals
      </Link>

      <nav className="navbar__links">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="navbar__link">
            {link.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to={ROUTES.ADMIN} className="navbar__link">
            Admin
          </NavLink>
        )}
      </nav>

      <div className="navbar__user">
        {user && (
          <>
            <span className="navbar__stat" title="Gemas">💎 {user.gems}</span>
            <span className="navbar__stat" title="Escudos">🛡️ {user.shields}</span>
            <Link to={ROUTES.PROFILE} aria-label="Mi perfil">
              <Avatar src={user.avatarUrl} name={user.displayName} size={32} />
            </Link>
            <button className="navbar__logout" onClick={logout}>
              Salir
            </button>
          </>
        )}
      </div>
    </header>
  )
}
