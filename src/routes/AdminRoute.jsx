import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

// Usar dentro de ProtectedRoute. Solo usuarios con rol ADMIN.
export default function AdminRoute() {
  const { isAdmin } = useAuth()
  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />
}
