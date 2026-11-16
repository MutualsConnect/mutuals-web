import { Link } from 'react-router-dom'
import { streakService } from '../../services/streakService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import { formatLocalDate, pluralize } from '../../../../utils/format'
import { STREAK_END_REASON_LABELS } from '../../constants'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Card from '../../../../components/common/Card'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import '../../components/StreakPage.css'
import './StreakHistory.css'
import Icon from '../../../../components/common/Icon'

export default function StreakHistory() {
  const { data: history, loading, error, run: reload } = useAsync(
    () => streakService.getHistory(),
    [],
  )

  return (
    <section className="streak-page">
      <Link to={ROUTES.STREAKS} className="streak-page__back">
        ← Rachas
      </Link>
      <header>
        <h1 className="streak-page__title">Historial de rachas</h1>
        <p className="streak-page__subtitle">Todas tus rachas, activas y terminadas.</p>
      </header>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !history?.length ? (
        <EmptyState title="Todavía no tienes historial" />
      ) : (
        <div className="streak-page__list">
          {history.map((entry) => (
            <Card key={entry.friend.id} className="streak-history">
              <div className="streak-history__header">
                <Avatar src={entry.friend.avatarUrl} name={entry.friend.displayName} size={44} />
                <div className="streak-history__who">
                  <strong>{entry.friend.displayName}</strong>
                  <span>
                    {pluralize(entry.totalStreaks, 'racha')} · mejor: {entry.bestLength} días
                  </span>
                </div>
                {!entry.currentlyMutual && <Badge>Ya no son mutuals</Badge>}
              </div>
              <ul className="streak-history__list">
                {entry.streaks.map((s) => (
                  <li key={s.id}>
                    <Link to={`/streaks/${s.id}`} className="streak-history__row">
                      <span className="icon-text"><Icon name="flame" size={16} filled /> {s.currentLength}</span>
                      <span className="streak-history__dates">
                        {formatLocalDate(s.startDate)}
                        {s.endDate ? ` – ${formatLocalDate(s.endDate)}` : ' – hoy'}
                      </span>
                      {s.status === 'ACTIVE' ? (
                        <Badge tone="success">Activa</Badge>
                      ) : (
                        <Badge tone="neutral">
                          {STREAK_END_REASON_LABELS[s.endReason] ?? 'Terminada'}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
