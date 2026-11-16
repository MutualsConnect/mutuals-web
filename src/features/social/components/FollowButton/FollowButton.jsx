import { useState } from 'react'
import { socialService } from '../../services/socialService'
import { getErrorMessage } from '../../../../utils/errors'
import { pluralize } from '../../../../utils/format'
import Button from '../../../../components/common/Button'
import Modal from '../../../../components/common/Modal'

// Seguir / dejar de seguir.
// Si hay racha activa, el backend responde 409 con { streakId, currentLength }
// y se pide confirmación antes de reintentar con confirmStreakLoss=true.
export default function FollowButton({ userId, displayName, following, followsMe, onChange, size = 'md' }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [streakConflict, setStreakConflict] = useState(null)

  const follow = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await socialService.follow(userId)
      onChange?.({ following: true, mutual: res.mutual })
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo seguir'))
    } finally {
      setBusy(false)
    }
  }

  const unfollow = async (confirmStreakLoss = false) => {
    setBusy(true)
    setError('')
    try {
      await socialService.unfollow(userId, confirmStreakLoss)
      setStreakConflict(null)
      onChange?.({ following: false, mutual: false })
    } catch (err) {
      if (err.response?.status === 409) {
        setStreakConflict(err.response.data?.details ?? {})
      } else {
        setError(getErrorMessage(err, 'No se pudo dejar de seguir'))
      }
    } finally {
      setBusy(false)
    }
  }

  const label = following ? 'Siguiendo' : followsMe ? 'Seguir de vuelta' : 'Seguir'

  return (
    <>
      <Button
        size={size}
        variant={following ? 'secondary' : 'primary'}
        loading={busy && !streakConflict}
        onClick={() => (following ? unfollow(false) : follow())}
        title={following ? 'Dejar de seguir' : undefined}
      >
        {label}
      </Button>
      {error && (
        <span role="alert" className="field__error">
          {error}
        </span>
      )}

      <Modal
        open={Boolean(streakConflict)}
        onClose={() => setStreakConflict(null)}
        title="Tienen una racha activa"
        footer={
          <>
            <Button variant="ghost" onClick={() => setStreakConflict(null)}>
              Mantener racha
            </Button>
            <Button variant="danger" loading={busy} onClick={() => unfollow(true)}>
              Dejar de seguir
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Si dejas de seguir a {displayName}, se romperá su racha
          {streakConflict?.currentLength != null &&
            ` de ${pluralize(streakConflict.currentLength, 'día')}`}
          . Esta acción no se puede deshacer.
        </p>
      </Modal>
    </>
  )
}
