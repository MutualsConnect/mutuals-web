import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import MutualGrid from '../../components/MutualGrid'
import StreakActivityBanner from '../../components/StreakActivityBanner'
import '../../components/StreakPage.css'

export default function StreakList() {
  return (
    <section className="streak-page">
      <header className="streak-page__header">
        <div>
          <h1 className="streak-page__title">Rachas</h1>
          <p className="streak-page__subtitle">Primero las que todavía no cuentan hoy.</p>
        </div>
        <div className="streak-page__actions">
          <Link to={ROUTES.STREAKS_CHECK_IN} className="btn btn--primary btn--sm">
            Check-in
          </Link>
          <Link to={ROUTES.STREAKS_INVITATIONS} className="btn btn--secondary btn--sm">
            Invitaciones
          </Link>
          <Link to={ROUTES.STREAKS_HISTORY} className="btn btn--secondary btn--sm">
            Historial
          </Link>
        </div>
      </header>

      <StreakActivityBanner />
      <MutualGrid />
    </section>
  )
}
