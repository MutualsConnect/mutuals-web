import { useState } from 'react'
import { socialService } from '../../services/socialService'
import { getErrorMessage } from '../../../../utils/errors'
import { REPORT_REASONS } from '../../constants'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Modal from '../../../../components/common/Modal'
import Select from '../../../../components/common/Select'
import Textarea from '../../../../components/common/Textarea'
import { useToast } from '../../../../hooks/useToast'

const DESCRIPTION_MAX = 500

export default function ReportModal({ open, onClose, user }) {
  const toast = useToast()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    setReason('')
    setDescription('')
    setError('')
    setSent(false)
    onClose()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await socialService.report({ reportedUserId: user.id, reason, description: description.trim() })
      setSent(true)
      toast.success('Reporte enviado. Gracias por avisarnos.')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo enviar el reporte'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={`Reportar a ${user?.displayName ?? ''}`}
      footer={
        sent ? (
          <Button onClick={close}>Cerrar</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" form="report-form" variant="danger" loading={submitting} disabled={!reason}>
              Enviar reporte
            </Button>
          </>
        )
      }
    >
      {sent ? (
        <p style={{ margin: 0 }}>Gracias. Nuestro equipo revisará el reporte.</p>
      ) : (
        <form id="report-form" onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <ErrorMessage message={error} />
          <Select
            label="Motivo"
            placeholder="Elige un motivo"
            options={REPORT_REASONS}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <Textarea
            label="Detalles (opcional)"
            value={description}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      )}
    </Modal>
  )
}
