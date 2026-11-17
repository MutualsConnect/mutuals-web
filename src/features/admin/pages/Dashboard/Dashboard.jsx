import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import StatGrid from '../../../../components/common/StatGrid'
import '../../components/AdminPage.css'
import { useToast } from '../../../../hooks/useToast'

export default function Dashboard() {
  const { data: m, loading, error, run: reload } = useAsync(() => adminService.getMetrics(), [])
  const [assigning, setAssigning] = useState(false)
  const toast = useToast()
  const [actionError, setActionError] = useState('')

  const assign = async () => {
    setAssigning(true)
    setActionError('')
    try {
      const res = await adminService.assignWeeklyChallenges()
      // El backend responde "N challenges assigned for this week"
      const count = res.message?.match(/\d+/)?.[0]
      toast.success(count != null ? `Se asignaron ${count} desafíos para esta semana.` : res.message)
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudieron asignar los desafíos'))
    } finally {
      setAssigning(false)
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard</h1>
          <p className="admin-page__subtitle">Estado general de la plataforma.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={reload}>
          Actualizar
        </Button>
      </header>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : (
        <StatGrid
          stats={[
            { label: 'Usuarios activos', value: m.activeUsers, icon: 'users' },
            { label: 'Usuarios suspendidos', value: m.suspendedUsers, icon: 'ban', tone: m.suspendedUsers ? 'danger' : undefined },
            { label: 'Mutuals activos', value: m.activeMutuals, icon: 'handshake' },
            { label: 'Rachas activas', value: m.activeStreaks, icon: 'flame' },
            { label: 'Rachas rotas', value: m.brokenStreaks, icon: 'heartCrack' },
            { label: 'Reportes pendientes', value: m.pendingReports, icon: 'flag', tone: m.pendingReports ? 'warning' : undefined },
            { label: 'Suscriptores Plus', value: m.plusSubscribers, icon: 'crown', tone: 'primary' },
          ]}
        />
      )}

      {m?.pendingReports > 0 && (
        <Card className="admin-page__row" style={{ justifyContent: 'space-between' }}>
          <span>
            Hay <strong>{m.pendingReports}</strong> reportes esperando revisión.
          </span>
          <Link to={ROUTES.ADMIN_REPORTS} className="btn btn--primary btn--sm">
            Revisar reportes
          </Link>
        </Card>
      )}

      <Card>
        <h2 className="admin-page__section-title">Acciones</h2>
        <ErrorMessage message={actionError} />
        <div className="admin-page__row" style={{ marginTop: 8 }}>
          <Button onClick={assign} loading={assigning}>
            Asignar desafíos de esta semana
          </Button>
          <p className="admin-page__muted">
            Normalmente corre solo cada lunes a las 00:10. Úsalo si agregaste plantillas o parejas nuevas.
          </p>
        </div>
      </Card>
    </section>
  )
}
