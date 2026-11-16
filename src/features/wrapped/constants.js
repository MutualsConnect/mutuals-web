import { formatLocalDate } from '../../utils/format'

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// "2026-10" → "Octubre de 2026"; "2026" → "2026"
export function periodLabel(periodType, periodKey) {
  if (periodType === 'MONTHLY' || /^\d{4}-\d{2}$/.test(periodKey)) {
    return capitalize(formatLocalDate(`${periodKey}-01`, { month: 'long', year: 'numeric' }))
  }
  if (periodType === 'ALL_TIME') return 'De siempre'
  return periodKey
}

export function previousMonthKey() {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const FREE_FRIEND_SECTIONS = 3

// Colores de las tarjetas de la "historia"
export const STORY_COLORS = ['violet', 'orange', 'pink', 'teal', 'blue']
