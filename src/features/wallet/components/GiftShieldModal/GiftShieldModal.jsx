import { useState } from 'react'
import { walletService } from '../../services/walletService'
import { useMutuals } from '../../../streaks/hooks/useMutuals'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Modal from '../../../../components/common/Modal'
import Select from '../../../../components/common/Select'
import Icon from '../../../../components/common/Icon'

// Regalar 1 escudo a un mutual. Si se pasa `friend`, no se muestra el selector.
export default function GiftShieldModal({ open, onClose, shields, friend, onGifted }) {
  const { data: mutuals, loading } = useMutuals()
  const [friendId, setFriendId] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const selectedId = friend?.id ?? Number(friendId)
  const selectedName =
    friend?.displayName ?? mutuals?.find((m) => m.friend.id === selectedId)?.friend.displayName

  const close = () => {
    setFriendId('')
    setError('')
    onClose()
  }

  const send = async () => {
    setSending(true)
    setError('')
    try {
      const next = await walletService.giftShield(selectedId)
      onGifted?.(next, selectedName)
      close()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo regalar el escudo'))
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Regalar un escudo"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={send} loading={sending} disabled={!selectedId || shields < 1}>
            <Icon name="shield" size={16} /> Regalar
          </Button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <ErrorMessage message={error} />
        {shields < 1 ? (
          <p style={{ margin: 0 }}>No tienes escudos para regalar. Compra uno primero.</p>
        ) : friend ? (
          <p style={{ margin: 0 }}>
            Le regalarás 1 escudo a <strong>{friend.displayName}</strong> para que proteja sus
            rachas. Te quedarán {shields - 1}.
          </p>
        ) : loading ? (
          <Loader />
        ) : !mutuals?.length ? (
          <p style={{ margin: 0 }}>Solo puedes regalar escudos a tus mutuals, y todavía no tienes.</p>
        ) : (
          <>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              Solo puedes regalar escudos a tus mutuals. Te quedarán {shields - 1}.
            </p>
            <Select
              label="¿A quién?"
              placeholder="Elige un mutual"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              options={mutuals.map((m) => ({ value: String(m.friend.id), label: `${m.friend.displayName} (@${m.friend.username})` }))}
            />
          </>
        )}
      </div>
    </Modal>
  )
}
