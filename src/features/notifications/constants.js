import { ROUTES, challengePath, streakPath } from '../../constants/routes'

export const UNREAD_POLL_MS = 60_000

export const NOTIFICATION_TABS = [
  { value: '', label: 'Todas' },
  { value: 'HIGH', label: 'Mutuals' },
  { value: 'LOW', label: 'Novedades' },
]

// Ícono (nombre de <Icon>) por NotificationType
export const NOTIFICATION_ICONS = {
  NEW_FOLLOWER: 'userPlus',
  MUTUAL_CREATED: 'handshake',
  STREAK_INVITATION: 'envelope',
  STREAK_STARTED: 'flame',
  INTERACTION_PENDING: 'hourglass',
  INTERACTION_CONFIRMED: 'check',
  PROXIMITY_DETECTED: 'pin',
  STREAK_AT_RISK: 'alert',
  STREAK_BROKEN: 'heartCrack',
  STREAK_MILESTONE: 'medal',
  SHIELD_RECEIVED: 'gift',
  SHIELD_USED: 'shield',
  CHALLENGE_ASSIGNED: 'target',
  CHALLENGE_COMPLETED: 'trophy',
  ACHIEVEMENT_UNLOCKED: 'award',
  ACTIVITY_LIKED: 'heart',
  ACTIVITY_COMMENTED: 'chat',
  HIGHLIGHT: 'sparkle',
  WRAPPED_READY: 'gift',
  SUBSCRIPTION: 'crown',
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
      return referenceId ? challengePath(referenceId) : ROUTES.CHALLENGES
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
