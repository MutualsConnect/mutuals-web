import { useState } from 'react'
import { subscriptionService } from '../../services/subscriptionService'
import { useAsync } from '../../../../hooks/useAsync'
import { useAuth } from '../../../../hooks/useAuth'
import { getErrorMessage } from '../../../../utils/errors'
import { formatDate } from '../../../../utils/format'
import { BILLING_PERIODS, STATUS_LABELS, isUnlimited, translateBenefit } from '../../constants'
import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Modal from '../../../../components/common/Modal'
import PlanComparison from '../../components/PlanComparison'
import './Subscription.css'

const fmt = (d) => formatDate(d, { day: 'numeric', month: 'long', year: 'numeric' })

export default function Subscription() {
  const { refreshUser } = useAuth()
  const { data: sub, loading, error, run: reload, setData } = useAsync(
    () => subscriptionService.getCurrent(),
    [],
  )
  const [period, setPeriod] = useState('MONTHLY')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const [cancelOpen, setCancelOpen] = useState(false)

  const subscribe = async () => {
    setBusy(true)
    setActionError('')
    try {
      const next = await subscriptionService.subscribe(period)
      setData(next)
      setNotice('¡Bienvenido a Mutuals Plus! Te regalamos un escudo de bienvenida 🛡️')
      refreshUser().catch(() => {}) // rol PREMIUM y escudo nuevo
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo activar Plus'))
    } finally {
      setBusy(false)
    }
  }

  const cancel = async () => {
    setBusy(true)
    setActionError('')
    try {
      setData(await subscriptionService.cancel())
      setCancelOpen(false)
      setNotice('Cancelaste la renovación. Seguirás con Plus hasta la fecha de vencimiento.')
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo cancelar'))
      setCancelOpen(false)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const isPlus = sub.plan === 'PLUS'
  const canceled = sub.status === 'CANCELED'
  const streakLimit = isUnlimited(sub.maxActiveStreaks) ? 'Ilimitadas' : `Hasta ${sub.maxActiveStreaks}`

  return (
    <section className="subscription-page">
      <header>
        <h1 className="subscription-page__title">Mutuals Plus</h1>
        <p className="subscription-page__subtitle">Más rachas, escudos todos los meses y tu Wrapped completo.</p>
      </header>

      {notice && <p className="subscription-page__notice">{notice}</p>}
      <ErrorMessage message={actionError} />

      <Card className={`subscription-page__current ${isPlus ? 'is-plus' : ''}`}>
        <div className="subscription-page__current-head">
          <div>
            <span className="subscription-page__label">Tu plan</span>
            <h2 className="subscription-page__plan">{isPlus ? '✦ Plus' : 'Gratis'}</h2>
          </div>
          {isPlus && <Badge tone={canceled ? 'warning' : 'success'}>{STATUS_LABELS[sub.status] ?? sub.status}</Badge>}
        </div>

        {isPlus && (
          <p className="subscription-page__dates">
            {canceled
              ? `No se renovará. Tus beneficios siguen hasta el ${fmt(sub.expiresAt)}.`
              : `Activa desde el ${fmt(sub.startedAt)}. Vence el ${fmt(sub.expiresAt)}.`}
          </p>
        )}

        <p className="subscription-page__limit">
          Rachas activas: <strong>{streakLimit}</strong>
        </p>
        <ul className="subscription-page__benefits">
          {sub.benefits.map((b) => (
            <li key={b}>✓ {translateBenefit(b)}</li>
          ))}
        </ul>

        {isPlus && !canceled && (
          <Button variant="ghost" onClick={() => setCancelOpen(true)}>
            Cancelar renovación
          </Button>
        )}
      </Card>

      {(!isPlus || canceled) && (
        <Card className="subscription-page__upgrade">
          <h2 className="subscription-page__section-title">{canceled ? 'Renovar Plus' : 'Pásate a Plus'}</h2>
          <div className="subscription-page__periods" role="radiogroup" aria-label="Periodo">
            {BILLING_PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={period === p.value}
                className={`subscription-page__period ${period === p.value ? 'is-selected' : ''}`}
                onClick={() => setPeriod(p.value)}
              >
                <strong>{p.label}</strong>
                <span>{p.description}</span>
              </button>
            ))}
          </div>
          <Button fullWidth size="lg" onClick={subscribe} loading={busy}>
            ✦ Activar Plus
          </Button>
          <p className="subscription-page__hint">
            El pago es simulado: no se cobra nada. Los escudos nunca se venden con dinero real.
          </p>
        </Card>
      )}

      <div>
        <h2 className="subscription-page__section-title">Comparar planes</h2>
        <PlanComparison currentPlan={sub.plan} />
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="¿Cancelar la renovación?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Mantener Plus
            </Button>
            <Button variant="danger" loading={busy} onClick={cancel}>
              Cancelar renovación
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Seguirás con Plus hasta el {fmt(sub.expiresAt)}. Después volverás al plan gratis, con un
          máximo de 4 rachas activas.
        </p>
      </Modal>
    </section>
  )
}
