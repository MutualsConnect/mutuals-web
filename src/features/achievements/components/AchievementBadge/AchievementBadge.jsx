import { resolveMediaUrl } from '../../../../utils/media'
import { formatDate } from '../../../../utils/format'
import { ACHIEVEMENT_TYPES, goalText } from '../../constants'
import './AchievementBadge.css'
import Icon from '../../../../components/common/Icon'

// Un logro. compact: versión pequeña para el perfil.
export default function AchievementBadge({ achievement, compact = false }) {
  const { name, description, rewardGems, iconUrl, unlocked, unlockedAt } = achievement
  const type = ACHIEVEMENT_TYPES[achievement.type]

  const icon = iconUrl ? (
    <img src={resolveMediaUrl(iconUrl)} alt="" className="achievement__img" />
  ) : (
    <Icon name={type?.icon ?? 'trophy'} size={compact ? 22 : 26} />
  )

  if (compact) {
    return (
      <div className="achievement achievement--compact" title={description}>
        <span className="achievement__icon">{icon}</span>
        <span className="achievement__name">{name}</span>
      </div>
    )
  }

  return (
    <div className={`achievement ${unlocked ? 'achievement--unlocked' : 'achievement--locked'}`}>
      <span className="achievement__icon">{unlocked ? icon : <Icon name="lock" size={22} />}</span>
      <div className="achievement__body">
        <strong className="achievement__name">{name}</strong>
        <span className="achievement__description">{description}</span>
        <span className="achievement__meta">
          {unlocked && unlockedAt
            ? `Desbloqueado el ${formatDate(unlockedAt, { day: 'numeric', month: 'short', year: 'numeric' })}`
            : goalText(achievement)}
        </span>
      </div>
      {rewardGems > 0 && (
        <span className={`achievement__reward ${unlocked ? 'is-earned' : ''}`}><Icon name="gem" size={14} /> {rewardGems}</span>
      )}
    </div>
  )
}
