import { resolveMediaUrl } from '../../../../utils/media'
import { formatRelativeTime } from '../../../../utils/format'
import Avatar from '../../../../components/common/Avatar'
import './SubmissionCard.css'
import Icon from '../../../../components/common/Icon'

// La respuesta de una persona. Si todavía no se revela (revelación mutua), se muestra bloqueada.
// submission puede ser null cuando esa persona aún no responde.
// El backend siempre revela mi propia respuesta; waitingForFriend indica que el otro aún no la ve.
export default function SubmissionCard({ user, submission, isMe, waitingForFriend = false }) {
  const name = isMe ? 'Tú' : user.displayName

  return (
    <div className="submission-card">
      <div className="submission-card__header">
        <Avatar src={user.avatarUrl} name={user.displayName} size={32} />
        <strong>{name}</strong>
        {submission && (
          <span className="submission-card__time">{formatRelativeTime(submission.submittedAt)}</span>
        )}
      </div>

      {!submission ? (
        <p className="submission-card__empty">
          {isMe ? 'Todavía no respondes.' : 'Todavía no responde.'}
        </p>
      ) : !submission.revealed && !isMe ? (
        <p className="submission-card__locked">
          <Icon name="lock" size={16} /> Ya respondió. Su respuesta se revela cuando completes la tuya.
        </p>
      ) : (
        <>
          {submission.content && <p className="submission-card__content">{submission.content}</p>}
          {submission.photoUrl && (
            <a href={resolveMediaUrl(submission.photoUrl)} target="_blank" rel="noreferrer">
              <img
                className="submission-card__photo"
                src={resolveMediaUrl(submission.photoUrl)}
                alt={`Foto de ${name}`}
                loading="lazy"
              />
            </a>
          )}
          {isMe && waitingForFriend && (
            <p className="submission-card__hint">Tu amigo la verá cuando responda.</p>
          )}
        </>
      )}
    </div>
  )
}
