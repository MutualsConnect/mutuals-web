import { AuthProvider } from './context/AuthProvider'
import { NotificationsProvider } from './context/NotificationsProvider'
import { ToastProvider } from './context/ToastProvider'
import ErrorBoundary from './components/common/ErrorBoundary'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NotificationsProvider>
            <AppRouter />
          </NotificationsProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
