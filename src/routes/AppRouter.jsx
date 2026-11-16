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
import Profile from '../features/user/pages/Profile'
import EditProfile from '../features/user/pages/EditProfile'
import Settings from '../features/user/pages/Settings'
import Devices from '../features/user/pages/Devices'
import Search from '../features/social/pages/Search'
import Followers from '../features/social/pages/Followers'
import Following from '../features/social/pages/Following'
import Mutuals from '../features/social/pages/Mutuals'
import Blocks from '../features/social/pages/Blocks'
import Wallet from '../features/wallet/pages/Wallet'
import Transactions from '../features/wallet/pages/Transactions'
import Shields from '../features/wallet/pages/Shields'
import Notifications from '../features/notifications/pages/Notifications'
import UserRedirect from '../features/user/pages/UserRedirect'
import ChallengeList from '../features/challenges/pages/ChallengeList'
import ChallengeDetail from '../features/challenges/pages/ChallengeDetail'
import Timeline from '../features/activity/pages/Timeline'
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

            {/* Perfil y configuración */}
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.DEVICES} element={<Devices />} />
            <Route path={ROUTES.BLOCKS} element={<Blocks />} />

            {/* Social */}
            <Route path={ROUTES.SEARCH} element={<Search />} />
            <Route path={ROUTES.MUTUALS} element={<Mutuals />} />
            <Route path={ROUTES.USER_PROFILE} element={<Profile />} />
            <Route path={ROUTES.USER_FOLLOWERS} element={<Followers />} />
            <Route path={ROUTES.USER_FOLLOWING} element={<Following />} />
            <Route path={ROUTES.USER_BY_ID} element={<UserRedirect />} />

            {/* Notificaciones */}
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />

            {/* Billetera */}
            <Route path={ROUTES.WALLET} element={<Wallet />} />
            <Route path={ROUTES.WALLET_TRANSACTIONS} element={<Transactions />} />
            <Route path={ROUTES.WALLET_SHIELDS} element={<Shields />} />

            {/* Desafíos */}
            <Route path={ROUTES.CHALLENGES} element={<ChallengeList />} />
            <Route path={ROUTES.CHALLENGE_DETAIL} element={<ChallengeDetail />} />

            {/* Novedades */}
            <Route path={ROUTES.TIMELINE} element={<Timeline />} />

            {/* TODO: agregar las páginas de las demás features (logros, avatar...) */}
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
