import { Outlet } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { ROUTES } from '../../constants/routes'
import './AdminLayout.css'

const ADMIN_LINKS = [
  { to: ROUTES.ADMIN, label: 'Dashboard', end: true },
  { to: ROUTES.ADMIN_USERS, label: 'Usuarios' },
  { to: ROUTES.ADMIN_REPORTS, label: 'Reportes' },
  { to: ROUTES.ADMIN_CHALLENGE_TEMPLATES, label: 'Plantillas de retos' },
  { to: ROUTES.ADMIN_METRICS, label: 'Métricas' },
]

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="admin-layout__body">
        <Sidebar title="Admin" items={ADMIN_LINKS} />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
