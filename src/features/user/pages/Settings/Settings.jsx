import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../../services/userService'
import { useAsync } from '../../../../hooks/useAsync'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { LANGUAGES } from '../../constants'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Input from '../../../../components/common/Input'
import Loader from '../../../../components/common/Loader'
import Modal from '../../../../components/common/Modal'
import Select from '../../../../components/common/Select'
import Switch from '../../../../components/common/Switch'
import SettingsSection from '../../components/SettingsSection'
import '../../components/UserPage.css'

// Versión del texto de consentimiento de ubicación que se guarda al activarla
const LOCATION_CONSENT_VERSION = 'v1'

export default function Settings() {
  const { user, logout, clearSession } = useAuth()
  const navigate = useNavigate()
  const { data: prefs, loading, error, run: reload, setData } = useAsync(
    () => userService.getPreferences(),
    [],
  )
  const [saveError, setSaveError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Guarda un cambio al instante; si falla, vuelve al valor anterior
  const update = async (changes) => {
    const previous = prefs
    setData({ ...prefs, ...changes })
    setSaveError('')
    try {
      const payload = { ...changes }
      if (changes.locationSharingEnabled) payload.locationConsentVersion = LOCATION_CONSENT_VERSION
      setData(await userService.updatePreferences(payload))
    } catch (err) {
      setData(previous)
      setSaveError(getErrorMessage(err, 'No se pudo guardar el cambio'))
    }
  }

  const onLogout = async () => {
    await logout().catch(() => {})
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const onDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError('')
    try {
      await userService.deleteMe()
      clearSession()
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar la cuenta'))
      setDeleting(false)
    }
  }

  return (
    <section className="user-page">
      <Link to={ROUTES.PROFILE} className="user-page__back">
        ← Mi perfil
      </Link>
      <h1 className="user-page__title">Configuración</h1>
      <ErrorMessage message={saveError} />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : (
        <>
          <SettingsSection title="Notificaciones">
            <Switch
              label="Notificaciones push"
              description="Confirmaciones, invitaciones y rachas en riesgo"
              checked={prefs.pushEnabled}
              onChange={(v) => update({ pushEnabled: v })}
            />
            <Switch
              label="Correos"
              description="Resúmenes y avisos importantes por email"
              checked={prefs.emailNotificationsEnabled}
              onChange={(v) => update({ emailNotificationsEnabled: v })}
            />
            <Switch
              label="Silenciar destacados"
              description="No recibir avisos de rachas largas de perfiles que sigues"
              checked={prefs.muteHighlights}
              onChange={(v) => update({ muteHighlights: v })}
            />
          </SettingsSection>

          <SettingsSection
            title="Privacidad"
            description="Tu ubicación solo se usa para detectar a tus mutuals cerca. Se guarda la última posición y se borra a los 10 minutos."
          >
            <Switch
              label="Compartir ubicación"
              description="Te avisamos cuando un mutual con racha pendiente está cerca"
              checked={prefs.locationSharingEnabled}
              onChange={(v) => update({ locationSharingEnabled: v })}
            />
            <Link to={ROUTES.BLOCKS} className="settings-link">
              Usuarios bloqueados
            </Link>
          </SettingsSection>

          <SettingsSection title="General">
            <div style={{ padding: '12px 0' }}>
              <Select
                label="Idioma"
                options={LANGUAGES}
                value={prefs.language}
                onChange={(e) => update({ language: e.target.value })}
              />
            </div>
            <Link to={ROUTES.DEVICES} className="settings-link">
              Dispositivos conectados
            </Link>
          </SettingsSection>
        </>
      )}

      <SettingsSection title="Cuenta" description={user.email}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12 }}>
          <Button variant="secondary" onClick={onLogout}>
            Cerrar sesión
          </Button>
          <Button variant="ghost" onClick={() => setDeleteOpen(true)} style={{ color: 'var(--color-danger)' }}>
            Eliminar cuenta
          </Button>
        </div>
      </SettingsSection>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Eliminar cuenta"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              disabled={confirmText !== user.username}
              onClick={onDeleteAccount}
            >
              Eliminar definitivamente
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <ErrorMessage message={deleteError} />
          <p style={{ margin: 0 }}>
            Se terminarán todas tus rachas y tus datos se anonimizarán. En el historial de tus amigos
            aparecerás como cuenta eliminada. <strong>No se puede deshacer.</strong>
          </p>
          <Input
            label={`Escribe ${user.username} para confirmar`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
          />
        </div>
      </Modal>
    </section>
  )
}
