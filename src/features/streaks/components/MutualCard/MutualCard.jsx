import { Link } from 'react-router-dom'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import StreakFlame from '../StreakFlame'
import './MutualCard.css'

// Tarjeta de un mutual (MutualCardResponse): con racha, con invitación pendiente o sin racha
export default function MutualCard({ mutual, onInvite, inviting = false }) {
  const { friend, streak, invitationPending } = mutual

  const content = (
    <>
      <Avatar src={friend.avatarUrl} name={friend.displayName} size={64} />
      <div className="mutual-card__name">{friend.displayName}</div>
      <div className="mutual-card__username">@{friend.username}</div>
    </>
  )

  if (streak) {
    return (
      <Link
        to={`/streaks/${streak.id}`}
        className={`mutual-card mutual-card--link ${streak.atRisk ? 'mutual-card--risk' : ''}`}
      >
        {content}
        <StreakFlame days={streak.currentLength} atRisk={streak.atRisk} shieldArmed={streak.shieldArmed} />
        {streak.atRisk && <Badge tone="warning">Vence hoy</Badge>}
      </Link>
    )
  }

  return (
    <div className="mutual-card">
      {content}
      {invitationPending ? (
        <Badge>Invitación pendiente</Badge>
      ) : (
        <Button size="sm" variant="secondary" loading={inviting} onClick={() => onInvite?.(friend)}>
          Invitar a racha
        </Button>
      )}
    </div>
  )
}
