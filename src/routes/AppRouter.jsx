import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (sin sesión) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            {/* TODO: agregar las páginas de features/auth, por ejemplo:
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} /> */}
          </Route>
        </Route>

        {/* Rutas privadas (con sesión) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            {/* TODO: agregar las páginas de cada feature (perfil, rachas, retos...) */}
          </Route>

          <Route element={<AdminRoute />}>
            <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
              {/* TODO: agregar las páginas de features/admin */}
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
