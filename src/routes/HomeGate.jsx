import { useAuth } from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import MainLayout from '../layouts/MainLayout'
import Landing from '../pages/Landing'

// "/" muestra la landing a visitantes y el Home (dentro del MainLayout) a quien tiene sesión
export default function HomeGate() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  return isAuthenticated ? <MainLayout /> : <Landing />
}
