import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { getErrorMessage } from '../../../../utils/errors'
import { formatDate, formatLocalDate } from '../../../../utils/format'
import { INTERACTION_METHOD_LABELS } from '../../../streaks/constants'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Input from '../../../../components/common/Input'
import StatGrid from '../../../../components/common/StatGrid'
import Tabs from '../../../../components/common/Tabs'
import '../../components/AdminPage.css'

const PERIOD_TYPES = [
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
]

function defaultMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1) // el mes pasado ya está completo
  return d.toISOString().slice(0, 7)
}

const defaultYear = () => String(new Date().getFullYear() - 1)

// Wrapped de la plataforma: estadísticas agregadas y anónimas (lectura pública)
export default function Metrics() {
  const [type, setType] = useState('month')
  const [month, setMonth] = useState(defaultMonth)
  const [year, setYear] = useState(defaultYear)
  const [wrapped, setWrapped] = useState(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const periodKey = type === 'month' ? month : year
  const validKey = type === 'month' ? /^\d{4}-\d{2}$/.test(month) : /^\d{4}$/.test(year)

  const run = async (action) => {
    setBusy(action)
    setError('')
    try {
      setWrapped(
        action === 'generate'
          ? await adminService.generatePlatformWrapped(periodKey)
          : await adminService.getPlatformWrapped(periodKey),
      )
    } catch (err) {
      setWrapped(null)
      setError(
        err.response?.status === 404 && action === 'view'
          ? 'Todavía no se generó el Wrapped de ese periodo. Usa "Generar".'
          : getErrorMessage(err, 'No se pudo obtener el Wrapped'),
      )
    } finally {
      setBusy('')
    }
  }

  const s = wrapped?.stats
  const periodLabel =
    wrapped?.periodType === 'MONTHLY'
      ? formatLocalDate(`${wrapped.periodKey}-01`, { month: 'long', year: 'numeric' })
      : wrapped?.periodKey

  return (
    <section className="admin-page">
      <header>
        <h1 className="admin-page__title">Wrapped de Mutuals</h1>
        <p className="admin-page__subtitle">
          Estadísticas agregadas y anónimas de la plataforma. Una vez generado, cualquiera puede verlo.
        </p>
      </header>

      <Card style={{ display: 'grid', gap: 12 }}>
        <Tabs tabs={PERIOD_TYPES} value={type} onChange={setType} />
        {type === 'month' ? (
          <Input label="Mes" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        ) : (
          <Input label="Año" type="number" min={2020} max={2100} value={year} onChange={(e) => setYear(e.target.value)} />
        )}
        <div className="admin-page__actions">
          <Button variant="secondary" onClick={() => run('view')} loading={busy === 'view'} disabled={!validKey}>
            Ver
          </Button>
          <Button onClick={() => run('generate')} loading={busy === 'generate'} disabled={!validKey}>
            Generar
          </Button>
        </div>
        <ErrorMessage message={error} />
      </Card>

      {s && (
        <Card style={{ display: 'grid', gap: 14 }}>
          <div>
            <h2 className="admin-page__section-title" style={{ marginBottom: 2 }}>
              {periodLabel}
            </h2>
            <p className="admin-page__muted">
              Generado el {formatDate(wrapped.generatedAt, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <StatGrid
            stats={[
              { label: 'Interacciones', value: s.interactions, icon: '🤝' },
              { label: 'Usuarios activos', value: s.activeUsers, icon: '👥' },
              { label: 'Mutuals activos', value: s.activeMutuals, icon: '💞' },
              { label: 'Racha más larga', value: s.longestStreak, icon: '🔥' },
              { label: 'Escudos regalados', value: s.shieldsGifted, icon: '🎁' },
              {
                label: s.mostActiveDay ? `Día más activo (${s.mostActiveDayInteractions})` : 'Día más activo',
                value: s.mostActiveDay ? formatLocalDate(s.mostActiveDay, { day: 'numeric', month: 'short' }) : '—',
                icon: '📅',
              },
            ]}
          />
          {s.interactionsByMethod && Object.keys(s.interactionsByMethod).length > 0 && (
            <div>
              <h3 className="admin-page__section-title" style={{ fontSize: '1rem' }}>Por método</h3>
              <StatGrid
                stats={Object.entries(s.interactionsByMethod).map(([method, count]) => ({
                  label: INTERACTION_METHOD_LABELS[method] ?? method,
                  value: count,
                }))}
              />
            </div>
          )}
        </Card>
      )}
    </section>
  )
}
