// Enum ChallengeType (icon = nombre de <Icon>)
export const CHALLENGE_TYPES = {
  REMOTE: { label: 'A distancia', icon: 'chat' },
  IN_PERSON: { label: 'En persona', icon: 'handshake' },
  CREATIVE: { label: 'Creativo', icon: 'palette' },
}

// Enum ChallengeStatus
export const CHALLENGE_STATUS = {
  OPEN: { label: 'Abierto', tone: 'primary' },
  COMPLETED: { label: 'Completado', tone: 'success' },
  EXPIRED: { label: 'Vencido', tone: 'neutral' },
}

// Mismas reglas que el backend (@Size(max = 1000), ImageValidator y multipart de 5 MB)
export const CONTENT_MAX_LENGTH = 1000
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const PHOTO_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validatePhoto(file) {
  if (!file) return null
  if (!PHOTO_ACCEPTED_TYPES.includes(file.type)) return 'La foto debe ser JPEG, PNG o WEBP'
  if (file.size > PHOTO_MAX_BYTES) return 'La foto no puede pesar más de 5 MB'
  return null
}

// Agrupa los desafíos de la semana para la lista
export function groupChallenges(challenges) {
  return {
    todo: challenges.filter((c) => c.status === 'OPEN' && !c.submittedByMe),
    waiting: challenges.filter((c) => c.status === 'OPEN' && c.submittedByMe),
    completed: challenges.filter((c) => c.status === 'COMPLETED'),
    expired: challenges.filter((c) => c.status === 'EXPIRED'),
  }
}
