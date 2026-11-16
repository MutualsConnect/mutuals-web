export function formatDate(value, options = { dateStyle: 'medium' }) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es', options).format(new Date(value))
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es').format(value ?? 0)
}
