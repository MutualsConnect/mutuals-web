import { challengeService } from '../../services/challengeService'
import { useAsync } from '../../../../hooks/useAsync'
import ChallengeCard from '../ChallengeCard'

// Desafío de esta semana con un amigo en particular (para el detalle de la racha).
// Si no hay, no muestra nada.
export default function FriendChallenge({ friendId, title = 'Desafío de la semana' }) {
  const { data } = useAsync(() => challengeService.getWeekly(), [])
  const challenge = data?.find((c) => c.friend.id === friendId)
  if (!challenge) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2 style={{ margin: 0, fontSize: '1.05rem' }}>{title}</h2>
      <ChallengeCard challenge={challenge} />
    </div>
  )
}
