import { useState } from 'react'
import { streakService } from '../../services/streakService'
import { getErrorMessage } from '../../../../utils/errors'
import Modal from '../../../../components/common/Modal'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import ErrorMessage from '../../../../components/common/ErrorMessage'

const MAX_NOTE = 140

// Interacción MANUAL: uno la registra y el amigo tiene 24 h para confirmarla
export default function RegisterInteractionModal({ open, onClose, friend, onCreated }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    setNote('')
    setError('')
    onClose()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const interaction = await streakService.createInteraction(friend.id, note.trim())
      onCreated?.(interaction)
      close()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo registrar la interacción'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={`Registrar interacción con ${friend?.displayName ?? ''}`}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" form="register-interaction" loading={submitting}>
            Registrar
          </Button>
        </>
      }
    >
      <form id="register-interaction" onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          {friend?.displayName} tendrá 24 horas para confirmarla. Si se ven en persona, usen el
          check-in con QR: cuenta al instante.
        </p>
        <ErrorMessage message={error} />
        <Input
          label="Nota (opcional)"
          placeholder="¿Qué hicieron?"
          value={note}
          maxLength={MAX_NOTE}
          onChange={(e) => setNote(e.target.value)}
          hint={`${note.length}/${MAX_NOTE}`}
        />
      </form>
    </Modal>
  )
}
