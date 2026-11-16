import { Outlet } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import BottomNav from '../../components/layout/BottomNav'
import './MainLayout.css'

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
