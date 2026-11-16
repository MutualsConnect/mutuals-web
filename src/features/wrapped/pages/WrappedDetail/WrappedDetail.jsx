import { Link, useParams, useSearchParams } from 'react-router-dom'
import { wrappedService } from '../../services/wrappedService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import { formatDate, formatLocalDate, formatNumber } from '../../../../utils/format'
import { periodLabel } from '../../constants'
import EmptyState from '../../../../components/common/EmptyState'
import Loader from '../../../../components/common/Loader'
import WrappedStory from '../../components/WrappedStory'
import MethodBars from '../../components/MethodBars'
import ShareButton from '../../components/ShareButton'
import '../../components/WrappedPage.css'
import '../../components/WrappedStory/WrappedStory.css'

const VALID_KEY = /^\d{4}(-\d{2})?$/

// /wrapped/2026-10 → mi Wrapped. /wrapped/2026-10?platform=1 → el de toda la plataforma.
export default function WrappedDetail() {
  const { periodKey } = useParams()
  const [searchParams] = useSearchParams()
  const isPlatform = searchParams.has('platform')
  const valid = VALID_KEY.test(periodKey)

  const { data: wrapped, loading, error, run } = useAsync(
    () => {
      if (!valid) return Promise.reject(new Error('Periodo no válido'))
      return isPlatform ? wrappedService.getPlatform(periodKey) : wrappedService.getByPeriod(periodKey)
    },
    [periodKey, isPlatform],
  )

  const label = periodLabel(null, periodKey)

  if (loading) return <Loader />
  if (error) {
    return (
      <section className="wrapped-page">
        <Link to={ROUTES.WRAPPED} className="wrapped-page__back">← Wrapped</Link>
        <EmptyState
          title={valid ? 'Este Wrapped todavía no está listo' : 'Periodo no válido'}
          description={valid ? `El de ${label.toLowerCase()} se genera al terminar el periodo.` : 'Usa el formato 2026-10 o 2026.'}
          action={valid ? <button className="btn btn--secondary btn--sm" onClick={run}>Reintentar</button> : null}
        />
      </section>
    )
  }

  const s = wrapped.stats ?? {}

  return (
    <section className="wrapped-page">
      <Link to={ROUTES.WRAPPED} className="wrapped-page__back">← Wrapped</Link>

      {isPlatform ? (
        <div className="wrapped-story">
          <section className="story-card story-card--violet">
            <span className="story-card__kicker">Mutuals Wrapped</span>
            <strong className="story-card__value">{label}</strong>
            <p className="story-card__caption">Lo que hizo toda la comunidad 🌎</p>
          </section>
          <section className="story-card story-card--orange">
            <span className="story-card__kicker">Interacciones</span>
            <strong className="story-card__value">{formatNumber(s.interactions ?? 0)}</strong>
            <p className="story-card__caption">entre {formatNumber(s.activeUsers ?? 0)} personas activas</p>
          </section>
          <section className="story-card story-card--pink">
            <span className="story-card__kicker">La racha más larga</span>
            <strong className="story-card__value">🔥 {s.longestStreak ?? 0}</strong>
            {s.mostActiveDay && (
              <p className="story-card__caption">
                El día más activo fue el {formatLocalDate(s.mostActiveDay, { day: 'numeric', month: 'long' })}
              </p>
            )}
          </section>
          {s.interactionsByMethod && (
            <section className="story-card story-card--blue">
              <span className="story-card__kicker">Cómo se encontraron</span>
              <MethodBars byMethod={s.interactionsByMethod} />
            </section>
          )}
        </div>
      ) : (
        <WrappedStory title={periodLabel(wrapped.periodType, wrapped.periodKey)} stats={s} />
      )}

      <div className="wrapped-page__actions">
        <ShareButton
          title="Mi Wrapped de Mutuals"
          text={
            isPlatform
              ? `Mutuals en ${label.toLowerCase()}: ${s.interactions ?? 0} interacciones 🌎`
              : `Mi Wrapped de ${label.toLowerCase()} en Mutuals: ${s.interactions ?? 0} interacciones y una racha de ${s.longestStreak ?? 0} días 🔥`
          }
        />
      </div>
      <p className="wrapped-page__subtitle" style={{ textAlign: 'center', fontSize: '0.8rem' }}>
        Generado el {formatDate(wrapped.generatedAt, { dateStyle: 'long' })}
      </p>
    </section>
  )
}
