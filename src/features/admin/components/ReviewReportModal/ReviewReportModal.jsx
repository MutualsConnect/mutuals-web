import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { getErrorMessage } from '../../../../utils/errors'
import { RESOLUTION_NOTE_MAX } from '../../constants'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Modal from '../../../../components/common/Modal'
import Switch from '../../../../components/common/Switch'
import Tabs from '../../../../components/common/Tabs'
import Textarea from '../../../../components/common/Textarea'

const DECISIONS = [
  { value: 'REVIEWED', label: 'Tomar acción' },
  { value: 'DISMISSED', label: 'Descartar' },
]

export default function ReviewReportModal({ report, onClose, onReviewed }) {
  const [status, setStatus] = useState('REVIEWED')
  const [note, setNote] = useState('')
  const [suspendUser, setSuspendUser] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await adminService.reviewReport(report.id, {
        status,
        resolutionNote: note.trim(),
        suspendUser: status === 'REVIEWED' && suspendUser,
      })
      onReviewed(updated)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar la revisión'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={Boolean(report)}
      onClose={onClose}
      title="Revisar reporte"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={suspendUser && status === 'REVIEWED' ? 'danger' : 'primary'} loading={saving} onClick={save}>
            {status === 'DISMISSED' ? 'Descartar' : suspendUser ? 'Guardar y suspender' : 'Guardar'}
          </Button>
        </>
      }
    >
      {report && (
        <div style={{ display: 'grid', gap: 12 }}>
          <ErrorMessage message={error} />
          <p style={{ margin: 0 }}>
            Reporte contra <strong>@{report.reported.username}</strong>.
          </p>
          <Tabs tabs={DECISIONS} value={status} onChange={setStatus} />
          <Textarea
            label="Nota de resolución (opcional)"
            value={note}
            maxLength={RESOLUTION_NOTE_MAX}
            onChange={(e) => setNote(e.target.value)}
          />
          {status === 'REVIEWED' && (
            <Switch
              label="Suspender al usuario"
              description="No podrá iniciar sesión hasta que lo reactives"
              checked={suspendUser}
              onChange={setSuspendUser}
            />
          )}
        </div>
      )}
    </Modal>
  )
}
