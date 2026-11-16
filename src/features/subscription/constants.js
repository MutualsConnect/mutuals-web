export const BILLING_PERIODS = [
  { value: 'MONTHLY', label: 'Mensual', description: '1 mes de Plus' },
  { value: 'YEARLY', label: 'Anual', description: '12 meses de Plus' },
]

export const STATUS_LABELS = {
  ACTIVE: 'Activa',
  CANCELED: 'Cancelada',
  EXPIRED: 'Vencida',
}

// El backend manda los beneficios en inglés; aquí su traducción.
// Si llega uno nuevo que no esté en la lista, se muestra tal cual.
const BENEFIT_TRANSLATIONS = {
  'Unlimited active streaks': 'Rachas activas ilimitadas',
  '1 free shield every month': '1 escudo gratis cada mes',
  'Recover a broken streak once a month': 'Recuperar una racha rota una vez al mes',
  'Full all-time Wrapped by friend': 'Wrapped histórico completo, por amigo',
  'Exclusive avatar items': 'Ítems de avatar exclusivos',
  'Profile themes, banner, fire styles and app icons': 'Temas, banner, estilos del fueguito e íconos de la app',
  'Home screen widgets': 'Widgets en la pantalla de inicio',
  'Unlimited followers and mutuals': 'Seguidores y mutuals ilimitados',
  'Up to 4 active streaks': 'Hasta 4 rachas activas',
  'Monthly and yearly Wrapped': 'Wrapped mensual y anual',
}

export const translateBenefit = (benefit) => BENEFIT_TRANSLATIONS[benefit] ?? benefit

// Comparación de planes (de docs/MUTUALS.md, sección 3.5)
export const PLAN_COMPARISON = [
  { feature: 'Rachas activas', free: 'Hasta 4', plus: 'Ilimitadas' },
  { feature: 'Escudo mensual', free: '—', plus: '1 al mes + 1 de bienvenida' },
  { feature: 'Wrapped histórico', free: 'Resumen y 3 amigos', plus: 'Completo, por amigo' },
  { feature: 'Personalización', free: 'Tema por defecto', plus: 'Temas, banner, fueguito, ícono' },
  { feature: 'Avatar', free: 'Tienda con gemas', plus: 'Además, ítems exclusivos' },
]

// Java manda Integer.MAX_VALUE para "sin límite"
export const isUnlimited = (n) => n >= 2_147_483_647

// 403 del backend cuando el plan gratis llegó al límite de rachas
export const isPlanLimitError = (err) =>
  err?.response?.status === 403 && err.response.data?.details?.upgrade === 'PLUS'
