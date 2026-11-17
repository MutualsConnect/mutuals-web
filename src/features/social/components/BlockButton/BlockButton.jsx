import { useState } from 'react'
import { socialService } from '../../services/socialService'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Modal from '../../../../components/common/Modal'
import { useToast } from '../../../../hooks/useToast'

// Bloquear pide confirmación porque borra los follows y rompe la racha.
export default function BlockButton({ user, onBlocked, size = 'md' }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const block = async () => {
    setBusy(true)
    setError('')
    try {
      await socialService.block(user.id)
      setOpen(false)
      toast.success(`Bloqueaste a ${user.displayName ?? 'esta persona'}.`)
      onBlocked?.()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo bloquear'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button size={size} variant="ghost" onClick={() => setOpen(true)}>
        Bloquear
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`¿Bloquear a ${user.displayName}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={busy} onClick={block}>
              Bloquear
            </Button>
          </>
        }
      >
        <ErrorMessage message={error} />
        <p style={{ marginBottom: 0 }}>
          Dejarán de seguirse, se terminará su mutual y, si tienen una racha, se romperá. No podrán
          volver a seguirse mientras esté bloqueado.
        </p>
      </Modal>
    </>
  )
}
