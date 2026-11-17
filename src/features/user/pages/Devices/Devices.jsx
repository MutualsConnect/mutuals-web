import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../services/userService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { formatRelativeTime } from '../../../../utils/format'
import { DEVICE_PLATFORM_LABELS } from '../../constants'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import '../../components/UserPage.css'
import Icon from '../../../../components/common/Icon'
import { useToast } from '../../../../hooks/useToast'

const PLATFORM_ICONS = { ANDROID: 'android', IOS: 'phone', WEB: 'monitor' }

// Dispositivos registrados para notificaciones push
export default function Devices() {
  const toast = useToast()
  const { data: devices, loading, error, run: reload, setData } = useAsync(
    () => userService.getDevices(),
    [],
  )
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const remove = async (device) => {
    setBusyId(device.id)
    setActionError('')
    try {
      await userService.deleteDevice(device.id)
      setData(devices.filter((d) => d.id !== device.id))
      toast.success('Dispositivo eliminado.')
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo eliminar el dispositivo'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="user-page">
      <Link to={ROUTES.SETTINGS} className="user-page__back">
        ← Configuración
      </Link>
      <header>
        <h1 className="user-page__title">Dispositivos</h1>
        <p className="user-page__subtitle">Donde recibes notificaciones push.</p>
      </header>
      <ErrorMessage message={actionError} />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !devices?.length ? (
        <EmptyState
          title="No hay dispositivos"
          description="Se registran solos cuando activas las notificaciones en la app."
        />
      ) : (
        <div className="user-page__list">
          {devices.map((device) => (
            <Card key={device.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name={PLATFORM_ICONS[device.platform] ?? 'phone'} size={26} />
              <div style={{ flex: 1 }}>
                <strong>{DEVICE_PLATFORM_LABELS[device.platform] ?? device.platform}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Último uso {formatRelativeTime(device.lastSeenAt)}
                </div>
              </div>
              <Button size="sm" variant="ghost" loading={busyId === device.id} onClick={() => remove(device)}>
                Quitar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
