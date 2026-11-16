import { Link } from 'react-router-dom'
import { useMutuals } from '../../../streaks/hooks/useMutuals'
import { ROUTES, streakPath } from '../../../../constants/routes'
import { formatDate } from '../../../../utils/format'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import UserListItem from '../../components/UserListItem'
import '../../../user/components/UserPage.css'

// Mis mutuals (personas que sigo y me siguen) en formato lista
export default function Mutuals() {
  const { data: mutuals, loading, error, run: reload } = useMutuals()

  return (
    <section className="user-page">
      <header>
        <h1 className="user-page__title">Mis mutuals</h1>
        <p className="user-page__subtitle">Personas que sigues y te siguen de vuelta.</p>
      </header>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !mutuals?.length ? (
        <EmptyState
          title="Todavía no tienes mutuals"
          action={<Link to={ROUTES.SEARCH}>Buscar amigos</Link>}
        />
      ) : (
        <div className="user-page__list">
          {mutuals.map((m) => (
            <UserListItem
              key={m.mutualId}
              user={m.friend}
              subtitle={`desde ${formatDate(m.mutualSince, { month: 'short', year: 'numeric' })}`}
              action={
                m.streak ? (
                  <Link to={streakPath(m.streak.id)} className="btn btn--secondary btn--sm">
                    🔥 {m.streak.currentLength}
                  </Link>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
