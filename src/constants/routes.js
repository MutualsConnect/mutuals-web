export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  USER_PROFILE: '/u/:username',
  USER_BY_ID: '/users/:userId',
  USER_FOLLOWERS: '/u/:username/followers',
  USER_FOLLOWING: '/u/:username/following',
  SETTINGS: '/settings',
  DEVICES: '/settings/devices',
  BLOCKS: '/settings/blocks',
  SEARCH: '/search',
  MUTUALS: '/mutuals',
  STREAKS: '/streaks',
  STREAK_DETAIL: '/streaks/:streakId',
  STREAKS_INVITATIONS: '/streaks/invitations',
  STREAKS_PENDING: '/streaks/pending',
  STREAKS_CHECK_IN: '/streaks/check-in',
  STREAKS_HISTORY: '/streaks/history',
  CHALLENGES: '/challenges',
  ACHIEVEMENTS: '/achievements',
  TIMELINE: '/timeline',
  WALLET: '/wallet',
  WALLET_TRANSACTIONS: '/wallet/transactions',
  WALLET_SHIELDS: '/wallet/shields',
  AVATAR: '/avatar',
  NOTIFICATIONS: '/notifications',
  SUBSCRIPTION: '/subscription',
  WRAPPED: '/wrapped',

  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_CHALLENGE_TEMPLATES: '/admin/challenge-templates',
  ADMIN_METRICS: '/admin/metrics',
}

// Helpers para armar rutas con parámetros
export const profilePath = (username) => `/u/${encodeURIComponent(username)}`
export const followersPath = (username) => `${profilePath(username)}/followers`
export const followingPath = (username) => `${profilePath(username)}/following`
export const streakPath = (streakId) => `/streaks/${streakId}`
