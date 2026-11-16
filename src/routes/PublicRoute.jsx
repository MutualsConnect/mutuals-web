import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'
import Loader from '../components/common/Loader'

// Login, registro, etc. Si ya hay sesión, manda al inicio.
export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />
  return <Outlet />
}
