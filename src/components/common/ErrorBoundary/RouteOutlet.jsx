import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'

// <Outlet /> protegido: si una página falla, el layout (navbar, menú) sigue visible
// y el error se limpia al cambiar de ruta.
export default function RouteOutlet() {
  const { pathname } = useLocation()
  return (
    <ErrorBoundary resetKey={pathname}>
      <Outlet />
    </ErrorBoundary>
  )
}
