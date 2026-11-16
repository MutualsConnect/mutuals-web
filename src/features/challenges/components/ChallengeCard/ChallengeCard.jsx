import { Link } from 'react-router-dom'
import { challengePath } from '../../../../constants/routes'
import Avatar from '../../../../components/common/Avatar'
import ChallengeBadges from '../ChallengeBadges'
import './ChallengeCard.css'

function myStatusText(challenge) {
  if (challenge.status === 'COMPLETED') return '¡Completado por los dos! Ya pueden ver sus respuestas.'
  if (challenge.status === 'EXPIRED') return 'La semana terminó sin que ambos respondieran.'
  if (challenge.submittedByMe) return `Ya respondiste. Falta ${challenge.friend.displayName}.`
  const friendDone = challenge.submissions.some((s) => s.user.id === challenge.friend.id)
  return friendDone
    ? `${challenge.friend.displayName} ya respondió. ¡Te toca!`
    : 'Te toca responder.'
}

export default function ChallengeCard({ challenge }) {
  const { template, friend } = challenge
  const pending = challenge.status === 'OPEN' && !challenge.submittedByMe

  return (
    <Link to={challengePath(challenge.id)} className={`challenge-card ${pending ? 'challenge-card--todo' : ''}`}>
      <div className="challenge-card__header">
        <Avatar src={friend.avatarUrl} name={friend.displayName} size={36} />
        <span className="challenge-card__friend">con {friend.displayName}</span>
      </div>
      <h3 className="challenge-card__title">{template.title}</h3>
      <p className="challenge-card__prompt">{template.prompt}</p>
      <ChallengeBadges challenge={challenge} />
      <p className="challenge-card__status">{myStatusText(challenge)}</p>
    </Link>
  )
}
