import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import ForgotPassword from '../features/auth/pages/ForgotPassword'
import ResetPassword from '../features/auth/pages/ResetPassword'
import StreakList from '../features/streaks/pages/StreakList'
import StreakDetail from '../features/streaks/pages/StreakDetail'
import StreakHistory from '../features/streaks/pages/StreakHistory'
import Invitations from '../features/streaks/pages/Invitations'
import PendingInteractions from '../features/streaks/pages/PendingInteractions'
import CheckIn from '../features/streaks/pages/CheckIn'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          {/* Solo sin sesión: si ya hay sesión, redirige al inicio */}
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          {/* Accesibles siempre (el enlace del correo puede abrirse con sesión iniciada) */}
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        {/* Rutas privadas (con sesión) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />

            {/* Rachas */}
            <Route path={ROUTES.STREAKS} element={<StreakList />} />
            <Route path={ROUTES.STREAKS_INVITATIONS} element={<Invitations />} />
            <Route path={ROUTES.STREAKS_PENDING} element={<PendingInteractions />} />
            <Route path={ROUTES.STREAKS_CHECK_IN} element={<CheckIn />} />
            <Route path={ROUTES.STREAKS_HISTORY} element={<StreakHistory />} />
            <Route path={ROUTES.STREAK_DETAIL} element={<StreakDetail />} />

            {/* TODO: agregar las páginas de las demás features (perfil, retos...) */}
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
