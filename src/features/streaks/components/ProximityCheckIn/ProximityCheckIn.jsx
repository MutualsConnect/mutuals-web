import { useState } from 'react'
import { streakService } from '../../services/streakService'
import { useMutuals } from '../../hooks/useMutuals'
import { getErrorMessage, translateServerMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import './ProximityCheckIn.css'

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Tu navegador no permite ubicación'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => reject(new Error('No se pudo obtener tu ubicación. Revisa los permisos.')),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
}

// Ambos envían su ubicación con menos de 2 min de diferencia y a menos de 100 m
export default function ProximityCheckIn({ onCheckedIn }) {
  const { data: mutuals, loading, error: loadError } = useMutuals()
  const [friendId, setFriendId] = useState('')
  const [error, setError] = useState('')
  const [waiting, setWaiting] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const withStreak = (mutuals ?? []).filter((m) => m.streak)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setWaiting('')
    try {
      const position = await getPosition()
      const res = await streakService.checkInByProximity({ friendId: Number(friendId), ...position })
      if (res.status === 'CONFIRMED') onCheckedIn?.(res.interaction)
      else setWaiting(translateServerMessage(res.message) ?? 'Listo. Ahora tu amigo tiene que hacer lo mismo en menos de 2 minutos.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />
  if (loadError) return <ErrorMessage message={loadError} />
  if (!withStreak.length) {
    return <p className="proximity__hint">Necesitas una racha activa para hacer check-in.</p>
  }

  return (
    <form className="proximity" onSubmit={onSubmit}>
      <p className="proximity__hint">
        Estando juntos, los dos tocan el botón con menos de 2 minutos de diferencia.
      </p>
      <ErrorMessage message={error} />
      {waiting && <p className="proximity__waiting">⏳ {waiting}</p>}

      <label className="field__label" htmlFor="proximity-friend">
        ¿Con quién estás?
      </label>
      <select
        id="proximity-friend"
        className="field__input"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        required
      >
        <option value="" disabled>
          Elige un mutual
        </option>
        {withStreak.map((m) => (
          <option key={m.friend.id} value={m.friend.id}>
            {m.friend.displayName} · racha de {m.streak.currentLength}
          </option>
        ))}
      </select>

      <Button type="submit" fullWidth loading={submitting} disabled={!friendId}>
        Enviar mi ubicación
      </Button>
    </form>
  )
}
