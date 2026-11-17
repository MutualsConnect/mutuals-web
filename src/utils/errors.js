// El backend responde los errores con ErrorResponse:
// { timestamp, status, error, message, path, fieldErrors, details }
// Sus mensajes vienen en inglés: aquí se traducen y, si no se conocen,
// se usa un mensaje según el código HTTP.

const STATUS_MESSAGES = {
  400: 'Revisa los datos e inténtalo de nuevo.',
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para hacer esto.',
  404: 'No encontramos lo que buscas.',
  409: 'Esto choca con algo que ya existe.',
  413: 'El archivo es demasiado grande (máximo 5 MB).',
  429: 'Demasiados intentos. Espera un momento.',
  500: 'Algo falló en el servidor. Inténtalo en unos minutos.',
  502: 'El servidor no está disponible. Inténtalo en unos minutos.',
  503: 'El servidor no está disponible. Inténtalo en unos minutos.',
  504: 'El servidor tardó demasiado en responder.',
}

const EXACT_MESSAGES = {
  // Autenticación y cuenta
  'Invalid email or password': 'Correo o contraseña incorrectos.',
  'Email is already registered': 'Ese correo ya está registrado.',
  'Username is already taken': 'Ese nombre de usuario ya está en uso.',
  'This account is suspended': 'Esta cuenta está suspendida.',
  'Authentication required': 'Inicia sesión para continuar.',
  'Authenticated user no longer exists': 'Tu cuenta ya no existe.',
  'Refresh token has expired': 'Tu sesión expiró. Vuelve a iniciar sesión.',
  'Refresh token is invalid': 'Tu sesión expiró. Vuelve a iniciar sesión.',
  'Refresh token was already used; all sessions were revoked':
    'Por seguridad cerramos todas tus sesiones. Vuelve a iniciar sesión.',
  'Password reset token is invalid or expired': 'El enlace para cambiar la contraseña venció o no es válido.',
  'Invalid Google token': 'No se pudo verificar tu cuenta de Google.',
  'Google account email is not verified': 'Tu correo de Google no está verificado.',
  'Google login is not configured': 'El inicio con Google no está disponible por ahora.',

  // Social
  'User not found': 'No encontramos a ese usuario.',
  'You cannot follow yourself': 'No puedes seguirte a ti mismo.',
  'You already follow this user': 'Ya sigues a esta persona.',
  'You cannot block yourself': 'No puedes bloquearte a ti mismo.',
  'User is already blocked': 'Ya bloqueaste a esta persona.',
  'You cannot report yourself': 'No puedes reportarte a ti mismo.',
  'You already have a pending report for this user': 'Ya tienes un reporte pendiente sobre esta persona.',
  'This action is not available between these users': 'Esta acción no está disponible con esta persona.',
  'This action is only available between mutuals': 'Solo pueden hacer esto si se siguen mutuamente.',
  'You are no longer mutuals with this user': 'Ya no se siguen mutuamente.',
  'Only mutuals can comment on this activity': 'Solo los mutuals pueden comentar.',
  'You already liked this activity': 'Ya te gusta esta actividad.',

  // Rachas
  'You already have an active streak with this user': 'Ya tienes una racha activa con esta persona.',
  'There is already a pending streak invitation': 'Ya hay una invitación de racha pendiente.',
  'The inviter has reached the free plan streak limit':
    'Quien te invitó llegó al límite de rachas del plan gratis.',
  'Only the invited user can respond to this invitation': 'Solo la persona invitada puede responder.',
  'Only the inviter can cancel this invitation': 'Solo quien invitó puede cancelar la invitación.',
  'This invitation is no longer pending': 'Esta invitación ya no está pendiente.',
  'Streak is no longer active': 'Esta racha ya no está activa.',
  'You are not part of this streak': 'No formas parte de esta racha.',
  'There is already a pending interaction with this friend': 'Ya hay una interacción pendiente con esta persona.',
  "Today's interaction with this friend is already confirmed": 'Hoy ya sumaron su día con esta persona.',
  'You cannot confirm or reject your own interaction': 'No puedes confirmar tu propia interacción.',
  'You are not part of this interaction': 'No formas parte de esta interacción.',
  'QR code is invalid or expired': 'El código QR venció o no es válido. Pide uno nuevo.',
  'You cannot scan your own code': 'No puedes escanear tu propio código.',
  'Enable location sharing in your preferences first': 'Primero activa compartir ubicación en Configuración.',
  'Waiting for your friend to check in from their phone':
    'Listo. Ahora tu amigo tiene que enviar su ubicación en menos de 2 minutos.',
  'Check-in confirmed': '¡Check-in confirmado!',

  // Escudos y billetera
  'Shields can only protect active streaks': 'Los escudos solo protegen rachas activas.',
  'This streak already has an armed shield': 'Esta racha ya tiene un escudo activado.',
  'Only one shield per streak per week': 'Solo se puede usar un escudo por racha a la semana.',
  'You already own this item': 'Ya tienes este ítem.',
  'This item is exclusive to Mutuals Plus': 'Este ítem es exclusivo de Mutuals Plus.',
  'You can only pin achievements you have unlocked': 'Solo puedes destacar logros que ya desbloqueaste.',

  // Retos
  'This challenge is no longer open': 'Este desafío ya cerró.',
  'You already completed your part of this challenge': 'Ya completaste tu parte del desafío.',
  'You are not part of this challenge': 'No formas parte de este desafío.',
  'This challenge requires a photo': 'Este desafío necesita una foto.',
  'Add an answer or a photo to complete the challenge': 'Escribe una respuesta o sube una foto.',
  'Check in together by QR or proximity before completing this challenge':
    'Primero hagan check-in juntos (QR o cercanía) hoy.',

  // Suscripción
  'You already have an active Mutuals Plus subscription': 'Ya tienes Mutuals Plus activo.',
  'You have no active subscription': 'No tienes una suscripción activa.',

  // Archivos
  'Only JPEG, PNG or WEBP images are allowed': 'Solo se permiten imágenes JPEG, PNG o WEBP.',
  'The uploaded file is empty': 'El archivo está vacío.',
  'File exceeds the maximum allowed size': 'El archivo es demasiado grande (máximo 5 MB).',

  // Admin
  'A review must set status REVIEWED or DISMISSED': 'Elige si el reporte se revisó o se descarta.',
  'Use account deletion to delete users': 'Para borrar usuarios usa la eliminación de cuenta.',

  // Genéricos del backend
  'Validation failed': 'Revisa los campos marcados.',
  'Validation failed for request parameters': 'Revisa los datos e inténtalo de nuevo.',
  'Malformed JSON request body': 'Revisa los datos e inténtalo de nuevo.',
  'You do not have permission to perform this action': 'No tienes permiso para hacer esto.',
  'The request conflicts with existing data': 'Esto choca con algo que ya existe.',
  'Endpoint not found': 'No encontramos lo que buscas.',
  'An unexpected error occurred': 'Algo falló en el servidor. Inténtalo en unos minutos.',
}

const RESOURCE_NAMES = {
  User: 'el usuario',
  Streak: 'la racha',
  'Streak invitation': 'la invitación',
  Interaction: 'la interacción',
  Challenge: 'el desafío',
  'Challenge template': 'la plantilla',
  Activity: 'la actividad',
  Comment: 'el comentario',
  Notification: 'la notificación',
  Report: 'el reporte',
  Device: 'el dispositivo',
  'Avatar item': 'el ítem',
}

const CURRENCIES = { GEMS: 'gemas', SHIELDS: 'escudos' }

// Mensajes que llevan datos dentro
const PATTERNS = [
  [/^Free plan allows up to (\d+) active streaks/, (m) =>
    `El plan gratis permite hasta ${m[1]} rachas activas. Pásate a Plus para tener ilimitadas.`],
  [/^Insufficient (\w+) balance/, (m) => `No tienes suficientes ${CURRENCIES[m[1]] ?? m[1].toLowerCase()}.`],
  [/^You are (\d+) m apart; get within (\d+) m/, (m) =>
    `Están a ${m[1]} m. Acérquense a menos de ${m[2]} m para hacer check-in.`],
  [/^You have an active streak with this user/, () =>
    'Tienes una racha activa con esta persona. Si dejas de seguirla, se perderá.'],
  [/^You do not follow user/, () => 'No sigues a esta persona.'],
  [/^You do not own avatar item/, () => 'No tienes este ítem.'],
  [/^You have no history with user/, () => 'Todavía no tienes historia con esta persona.'],
  [/^Unlock the achievement/, () => 'Desbloquea el logro para obtener este ítem.'],
  [/^Wrapped for period .* not found/, () => 'Ese Wrapped todavía no está disponible.'],
  [/^(.+?) not found/, (m) => (RESOURCE_NAMES[m[1]] ? `No encontramos ${RESOURCE_NAMES[m[1]]}.` : null)],
]

// Traduce un mensaje del backend. Devuelve null si no se conoce.
export function translateServerMessage(message) {
  if (!message) return null
  const text = message.trim()
  if (EXACT_MESSAGES[text]) return EXACT_MESSAGES[text]
  for (const [regex, build] of PATTERNS) {
    const match = text.match(regex)
    if (match) {
      const translated = build(match)
      if (translated) return translated
    }
  }
  return null
}

export function getErrorStatus(error) {
  return error?.response?.status ?? null
}

const DEFAULT_ERROR = 'Ocurrió un error inesperado.'

export function getErrorMessage(error, fallback) {
  if (!error) return fallback ?? DEFAULT_ERROR
  if (error.code === 'ERR_CANCELED') return null
  if (error.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder. Inténtalo de nuevo.'
  if (error.code === 'ERR_NETWORK' || (error.request && !error.response)) {
    return typeof navigator !== 'undefined' && navigator.onLine === false
      ? 'No tienes conexión a internet.'
      : 'No se pudo conectar con el servidor.'
  }

  const status = getErrorStatus(error)
  // Errores propios de la app (ubicación, cámara...) ya vienen en español
  if (!status) return (!error.isAxiosError && error.message) || (fallback ?? DEFAULT_ERROR)

  const translated = translateServerMessage(error.response.data?.message)
  if (translated) return translated
  // Errores del servidor: nunca mostrar detalles técnicos
  if (status >= 500) return STATUS_MESSAGES[status] ?? STATUS_MESSAGES[500]
  // 400 y 409 dependen de la acción: mejor el mensaje de la pantalla si lo hay
  if ((status === 400 || status === 409) && fallback) return fallback
  return STATUS_MESSAGES[status] ?? fallback ?? DEFAULT_ERROR
}

// Validaciones de Spring (fieldErrors) traducidas
const FIELD_MESSAGES = [
  [/^must not be blank$|^must not be null$|^must not be empty$/, 'Este campo es obligatorio.'],
  [/^must be a well-formed email address$/, 'Ingresa un correo válido.'],
  [/^size must be between (\d+) and (\d+)$/, (m) => `Debe tener entre ${m[1]} y ${m[2]} caracteres.`],
  [/^must be greater than or equal to (\d+)$/, (m) => `Debe ser al menos ${m[1]}.`],
  [/^must be less than or equal to (\d+)$/, (m) => `Debe ser como máximo ${m[1]}.`],
  [/^must be greater than 0$|^must be positive$/, 'Debe ser mayor que 0.'],
  [/^Username must be/, 'Usa de 3 a 30 letras minúsculas, números, puntos o guiones bajos.'],
  [/^Password must/, 'Usa al menos 8 caracteres con mayúscula, minúscula, número y símbolo.'],
]

function translateFieldMessage(message) {
  for (const [regex, result] of FIELD_MESSAGES) {
    const match = message?.match(regex)
    if (match) return typeof result === 'function' ? result(match) : result
  }
  return translateServerMessage(message) ?? message
}

export function getFieldErrors(error) {
  const fieldErrors = error?.response?.data?.fieldErrors ?? {}
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, message]) => [field, translateFieldMessage(message)]),
  )
}
