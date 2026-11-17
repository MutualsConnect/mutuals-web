import Navbar from '../../components/layout/Navbar'
import BottomNav from '../../components/layout/BottomNav'
import './MainLayout.css'
import { RouteOutlet } from '../../components/common/ErrorBoundary'

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-layout__content">
        <RouteOutlet />
      </main>
      <BottomNav />
    </div>
  )
}
