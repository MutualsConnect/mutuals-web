import { Link, Outlet } from 'react-router-dom'
import './AuthLayout.css'
import Icon from '../../components/common/Icon'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <Link to="/" className="auth-layout__brand">
          <span className="auth-layout__logo">
            <Icon name="flame" size={40} />
          </span>
          <h1 className="auth-layout__name">Mutuals</h1>
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
