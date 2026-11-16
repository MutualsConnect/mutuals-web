import { useState } from 'react'
import { Link } from 'react-router-dom'
import { activityService } from '../../services/activityService'
import { profilePath } from '../../../../constants/routes'
import { formatRelativeTime } from '../../../../utils/format'
import { ACTIVITY_TYPES } from '../../constants'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import LikeButton from '../LikeButton'
import CommentsSection from '../CommentsSection'
import './ActivityCard.css'

// Una novedad (ActivityResponse). onChange(updated) para actualizar la lista.
export default function ActivityCard({ activity, isMine = false, onChange }) {
  const [busy, setBusy] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [error, setError] = useState('')
  const type = ACTIVITY_TYPES[activity.type] ?? { icon: '✨', label: 'Novedad' }

  // Like optimista: se ve al instante y se revierte si falla
  const toggleLike = async () => {
    const before = activity
    const liked = !activity.likedByMe
    onChange({ ...activity, likedByMe: liked, likeCount: activity.likeCount + (liked ? 1 : -1) })
    setBusy(true)
    setError('')
    try {
      if (liked) onChange(await activityService.like(activity.id))
      else await activityService.unlike(activity.id)
    } catch {
      onChange(before)
      setError('No se pudo actualizar el me gusta')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="activity-card">
      <header className="activity-card__header">
        <Link to={profilePath(activity.actor.username)} className="activity-card__actor">
          <Avatar src={activity.actor.avatarUrl} name={activity.actor.displayName} size={40} />
          <span>
            <strong>{isMine ? 'Tú' : activity.actor.displayName}</strong>
            <span className="activity-card__time">{formatRelativeTime(activity.createdAt)}</span>
          </span>
        </Link>
        {activity.fromMutual && <Badge tone="primary">Mutual</Badge>}
      </header>

      <div className="activity-card__body">
        <span className="activity-card__icon" aria-hidden>
          {type.icon}
        </span>
        <div>
          <p className="activity-card__title">{activity.title}</p>
          <span className="activity-card__type">{type.label}</span>
        </div>
        {activity.value != null && <span className="activity-card__value">{activity.value}</span>}
      </div>

      <footer className="activity-card__footer">
        <LikeButton liked={activity.likedByMe} count={activity.likeCount} onToggle={toggleLike} disabled={busy} />
        <button
          type="button"
          className="activity-card__action"
          onClick={() => setShowComments((s) => !s)}
          aria-expanded={showComments}
        >
          💬 {activity.commentCount}
        </button>
        {error && <span className="field__error">{error}</span>}
      </footer>

      {showComments && (
        <CommentsSection
          activity={activity}
          onCommented={() => onChange({ ...activity, commentCount: activity.commentCount + 1 })}
        />
      )}
    </article>
  )
}
