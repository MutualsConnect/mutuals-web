import { ROUTES, streakPath } from '../../constants/routes'

export const UNREAD_POLL_MS = 60_000

export const NOTIFICATION_TABS = [
  { value: '', label: 'Todas' },
  { value: 'HIGH', label: 'Mutuals' },
  { value: 'LOW', label: 'Novedades' },
]

// Ícono por NotificationType
export const NOTIFICATION_ICONS = {
  NEW_FOLLOWER: '👋',
  MUTUAL_CREATED: '🤝',
  STREAK_INVITATION: '✉️',
  STREAK_STARTED: '🔥',
  INTERACTION_PENDING: '⏳',
  INTERACTION_CONFIRMED: '✅',
  PROXIMITY_DETECTED: '📍',
  STREAK_AT_RISK: '⚠️',
  STREAK_BROKEN: '💔',
  STREAK_MILESTONE: '🏅',
  SHIELD_RECEIVED: '🎁',
  SHIELD_USED: '🛡️',
  CHALLENGE_ASSIGNED: '🎯',
  CHALLENGE_COMPLETED: '🏆',
  ACHIEVEMENT_UNLOCKED: '🏆',
  ACTIVITY_LIKED: '❤️',
  ACTIVITY_COMMENTED: '💬',
  HIGHLIGHT: '✨',
  WRAPPED_READY: '🎁',
  SUBSCRIPTION: '✦',
}

// A dónde lleva cada notificación según referenceType / referenceId del backend
export function getNotificationLink({ type, referenceType, referenceId }) {
  switch (referenceType) {
    case 'USER':
      return referenceId ? `/users/${referenceId}` : null
    case 'STREAK':
      return referenceId ? streakPath(referenceId) : ROUTES.STREAKS
    case 'INTERACTION':
      return type === 'INTERACTION_PENDING' ? ROUTES.STREAKS_PENDING : ROUTES.STREAKS
    case 'STREAK_INVITATION':
      return ROUTES.STREAKS_INVITATIONS
    case 'CHALLENGE':
      return referenceId ? `${ROUTES.CHALLENGES}/${referenceId}` : ROUTES.CHALLENGES
    case 'ACTIVITY':
      return ROUTES.TIMELINE
    case 'WRAPPED':
      return ROUTES.WRAPPED
    case 'ACHIEVEMENT':
      return ROUTES.ACHIEVEMENTS
    case 'SUBSCRIPTION':
      return ROUTES.SUBSCRIPTION
    default:
      return null
  }
}
