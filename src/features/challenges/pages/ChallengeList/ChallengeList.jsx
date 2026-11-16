import { Link } from 'react-router-dom'
import { challengeService } from '../../services/challengeService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import { formatLocalDate } from '../../../../utils/format'
import { groupChallenges } from '../../constants'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import ChallengeCard from '../../components/ChallengeCard'
import '../../components/ChallengePage.css'

const SECTIONS = [
  { key: 'todo', title: 'Te toca responder' },
  { key: 'waiting', title: 'Esperando a tu amigo' },
  { key: 'completed', title: 'Completados' },
  { key: 'expired', title: 'Vencidos' },
]

export default function ChallengeList() {
  const { data: challenges, loading, error, run: reload } = useAsync(
    () => challengeService.getWeekly(),
    [],
  )

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const groups = groupChallenges(challenges ?? [])
  const weekStart = challenges?.[0]?.weekStart

  return (
    <section className="challenge-page">
      <header>
        <h1 className="challenge-page__title">Desafíos de la semana</h1>
        <p className="challenge-page__subtitle">
          {weekStart ? `Semana del ${formatLocalDate(weekStart, { day: 'numeric', month: 'long' })}. ` : ''}
          Uno por cada racha. La respuesta de tu amigo se revela cuando los dos cumplen.
        </p>
      </header>

      {!challenges?.length ? (
        <EmptyState
          title="No tienes desafíos esta semana"
          description="Cada lunes llega un desafío nuevo por cada racha activa. Empieza una racha con un mutual para recibir el próximo."
          action={<Link to={ROUTES.STREAKS}>Ir a mis rachas</Link>}
        />
      ) : (
        SECTIONS.filter((s) => groups[s.key].length).map((section) => (
          <div key={section.key} className="challenge-page__section">
            <h2 className="challenge-page__section-title">
              {section.title} ({groups[section.key].length})
            </h2>
            <div className="challenge-page__grid">
              {groups[section.key].map((c) => (
                <ChallengeCard key={c.id} challenge={c} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  )
}
