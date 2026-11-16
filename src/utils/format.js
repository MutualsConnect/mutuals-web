export function formatDate(value, options = { dateStyle: 'medium' }) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es', options).format(new Date(value))
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es').format(value ?? 0)
}

// Fechas sin hora del backend (LocalDate "2026-11-15"): se leen como fecha local
// para que no se corran un día por la zona horaria.
export function formatLocalDate(value, options = { dateStyle: 'medium' }) {
  if (!value) return ''
  const [y, m, d] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es', options).format(new Date(y, m - 1, d))
}

export function formatRelativeTime(value) {
  if (!value) return ''
  const diffSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
  const units = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) return rtf.format(Math.round(diffSeconds / seconds), unit)
  }
  return rtf.format(diffSeconds, 'second')
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}
