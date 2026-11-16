import { AuthProvider } from './context/AuthProvider'
import { NotificationsProvider } from './context/NotificationsProvider'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <AppRouter />
      </NotificationsProvider>
    </AuthProvider>
  )
}
