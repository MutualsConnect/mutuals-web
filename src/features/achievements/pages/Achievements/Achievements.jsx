import { useState } from 'react'
import { achievementService } from '../../services/achievementService'
import { useAsync } from '../../../../hooks/useAsync'
import { ACHIEVEMENT_FILTERS, ACHIEVEMENT_TYPES, TYPE_ORDER } from '../../constants'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import AchievementBadge from '../../components/AchievementBadge'
import './Achievements.css'
import Icon from '../../../../components/common/Icon'

export default function Achievements() {
  const { data: catalog, loading, error, run: reload } = useAsync(() => achievementService.getCatalog(), [])
  const [filter, setFilter] = useState('all')

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const unlocked = catalog.filter((a) => a.unlocked)
  const gemsEarned = unlocked.reduce((sum, a) => sum + a.rewardGems, 0)
  const percent = catalog.length ? Math.round((unlocked.length / catalog.length) * 100) : 0

  const visible = catalog.filter((a) =>
    filter === 'unlocked' ? a.unlocked : filter === 'locked' ? !a.unlocked : true,
  )
  // Agrupa por tipo; dentro de cada grupo, de la meta más fácil a la más difícil
  const groups = TYPE_ORDER.map((type) => ({
    type,
    items: visible.filter((a) => a.type === type).sort((a, b) => a.threshold - b.threshold),
  })).filter((g) => g.items.length)
  const otherTypes = visible.filter((a) => !TYPE_ORDER.includes(a.type))
  if (otherTypes.length) groups.push({ type: 'OTHER', items: otherTypes })

  return (
    <section className="achievements-page">
      <header>
        <h1 className="achievements-page__title">Logros</h1>
        <p className="achievements-page__subtitle">
          Se desbloquean solos y te dan gemas. En tu perfil se muestran sin decir con quién fue la racha.
        </p>
      </header>

      <div className="achievements-page__summary">
        <div>
          <strong>
            {unlocked.length} de {catalog.length}
          </strong>
          <span>desbloqueados</span>
        </div>
        <div className="achievements-page__progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <div>
          <strong className="icon-text"><Icon name="gem" size={18} /> {gemsEarned}</strong>
          <span>ganadas</span>
        </div>
      </div>

      <Tabs tabs={ACHIEVEMENT_FILTERS} value={filter} onChange={setFilter} />

      {!groups.length ? (
        <EmptyState
          title={filter === 'unlocked' ? 'Todavía no desbloqueas logros' : '¡Los desbloqueaste todos!'}
        />
      ) : (
        groups.map((group) => (
          <div key={group.type} className="achievements-page__group">
            <h2 className="achievements-page__group-title">
              <Icon name={ACHIEVEMENT_TYPES[group.type]?.icon ?? 'trophy'} size={18} /> {ACHIEVEMENT_TYPES[group.type]?.label ?? 'Otros'}
            </h2>
            <div className="achievements-page__list">
              {group.items.map((a) => (
                <AchievementBadge key={a.code} achievement={a} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  )
}
