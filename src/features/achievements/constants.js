import { pluralize } from '../../utils/format'

// Enum AchievementType: ícono por defecto (si el logro no trae iconUrl) y cómo leer la meta
export const ACHIEVEMENT_TYPES = {
  STREAK: { label: 'Rachas', icon: '🔥', unit: ['día de racha', 'días de racha'] },
  PERSONAL_STREAK: { label: 'Racha personal', icon: '⚡', unit: ['día seguido', 'días seguidos'] },
  CHALLENGE: { label: 'Desafíos', icon: '🎯', unit: ['desafío', 'desafíos'] },
  SOCIAL: { label: 'Social', icon: '🤝', unit: ['mutual', 'mutuals'] },
  MONTHLY_MEDAL: { label: 'Medallas', icon: '🏅', unit: ['mes', 'meses'] },
}

export const TYPE_ORDER = ['STREAK', 'PERSONAL_STREAK', 'CHALLENGE', 'SOCIAL', 'MONTHLY_MEDAL']

export function goalText(achievement) {
  const type = ACHIEVEMENT_TYPES[achievement.type]
  if (!type) return `Meta: ${achievement.threshold}`
  return `Meta: ${pluralize(achievement.threshold, type.unit[0], type.unit[1])}`
}

export const ACHIEVEMENT_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'unlocked', label: 'Desbloqueados' },
  { value: 'locked', label: 'Por desbloquear' },
]
