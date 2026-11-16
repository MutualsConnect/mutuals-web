import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Modal from '../../../../components/common/Modal'

// Cambia el estado de una cuenta. target: { user, status: 'SUSPENDED' | 'ACTIVE' }
export default function SuspendUserModal({ target, onClose, onDone }) {
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const suspending = target?.status === 'SUSPENDED'
  const name = target?.user.username ? `@${target.user.username}` : `el usuario #${target?.user.id}`

  const confirm = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await adminService.updateUserStatus(target.user.id, target.status)
      onDone(updated, target.status)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cambiar el estado'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={Boolean(target)}
      onClose={onClose}
      title={suspending ? 'Suspender cuenta' : 'Reactivar cuenta'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={suspending ? 'danger' : 'primary'} loading={saving} onClick={confirm}>
            {suspending ? 'Suspender' : 'Reactivar'}
          </Button>
        </>
      }
    >
      <ErrorMessage message={error} />
      <p style={{ marginBottom: 0 }}>
        {suspending
          ? `${name} no podrá iniciar sesión ni aparecerá en búsquedas hasta que lo reactives.`
          : `${name} podrá volver a usar Mutuals.`}
      </p>
    </Modal>
  )
}
