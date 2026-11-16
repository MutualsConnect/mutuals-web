import { Link } from 'react-router-dom'
import { wrappedService } from '../../services/wrappedService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES, wrappedPath } from '../../../../constants/routes'
import { formatDate } from '../../../../utils/format'
import { periodLabel, previousMonthKey } from '../../constants'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import '../../components/WrappedPage.css'
import Icon from '../../../../components/common/Icon'

export default function WrappedHistory() {
  const { data: wrappeds, loading, error, run: reload } = useAsync(() => wrappedService.getMine(), [])
  // El Wrapped de la plataforma del mes pasado, si ya se publicó (si no, no se muestra)
  const platformKey = previousMonthKey()
  const platform = useAsync(() => wrappedService.getPlatform(platformKey).catch(() => null), [platformKey])

  return (
    <section className="wrapped-page">
      <header>
        <h1 className="wrapped-page__title">Tu Wrapped</h1>
        <p className="wrapped-page__subtitle">
          Cada mes (el día 1) y cada año te armamos un resumen de cómo conectaste con tus amigos.
        </p>
      </header>

      <Link to={ROUTES.WRAPPED_ALL_TIME} className="wrapped-item wrapped-item--alltime">
        <span className="wrapped-item__icon"><Icon name="infinity" size={24} /></span>
        <span className="wrapped-item__body">
          <span className="wrapped-item__title">De siempre</span>
          <span className="wrapped-item__meta">Tu historia completa y con cada amigo</span>
        </span>
        <Icon name="chevron" size={20} />
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !wrappeds?.length ? (
        <EmptyState
          title="Todavía no tienes Wrappeds"
          description="El primero llegará el día 1 del próximo mes. Mientras tanto, mira tu Wrapped de siempre."
        />
      ) : (
        <div className="wrapped-page__list">
          {wrappeds.map((w) => (
            <Link
              key={w.id}
              to={wrappedPath(w.periodKey)}
              className={`wrapped-item ${w.periodType === 'YEARLY' ? 'wrapped-item--yearly' : ''}`}
            >
              <span className="wrapped-item__icon">
                <Icon name={w.periodType === 'YEARLY' ? 'trophy' : 'gift'} size={24} />
              </span>
              <span className="wrapped-item__body">
                <span className="wrapped-item__title">{periodLabel(w.periodType, w.periodKey)}</span>
                <span className="wrapped-item__meta">
                  {w.stats?.interactions ?? 0} interacciones · listo el{' '}
                  {formatDate(w.generatedAt, { day: 'numeric', month: 'short' })}
                </span>
              </span>
              <Icon name="chevron" size={20} />
            </Link>
          ))}
        </div>
      )}

      {platform.data && (
        <Link to={wrappedPath(platform.data.periodKey, true)} className="wrapped-item wrapped-item--platform">
          <span className="wrapped-item__icon"><Icon name="globe" size={24} /></span>
          <span className="wrapped-item__body">
            <span className="wrapped-item__title">Mutuals en {periodLabel('MONTHLY', platform.data.periodKey).toLowerCase()}</span>
            <span className="wrapped-item__meta">Lo que hizo toda la comunidad</span>
          </span>
          <Icon name="chevron" size={20} />
        </Link>
      )}
    </section>
  )
}
