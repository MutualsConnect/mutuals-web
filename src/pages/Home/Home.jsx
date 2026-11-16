import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import MutualGrid from '../../features/streaks/components/MutualGrid'
import StreakActivityBanner from '../../features/streaks/components/StreakActivityBanner'
import StreakFlame from '../../features/streaks/components/StreakFlame'
import './Home.css'

// Home: racha personal + grid de mutuals con su racha
export default function Home() {
  const { user } = useAuth()

  return (
    <section className="home">
      <header className="home__header">
        <div>
          <h1 className="home__title">Hola, {user?.displayName}</h1>
          <p className="home__subtitle">Tu racha personal</p>
        </div>
        <StreakFlame days={user?.personalStreak ?? 0} size="lg" />
      </header>

      <StreakActivityBanner />

      <div className="home__section-header">
        <h2 className="home__section-title">Tus mutuals</h2>
        <Link to={ROUTES.STREAKS_CHECK_IN} className="btn btn--primary btn--sm">
          Check-in
        </Link>
      </div>
      <MutualGrid />
    </section>
  )
}
