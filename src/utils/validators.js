// Mismas reglas que las validaciones del backend (RegisterRequest y @StrongPassword)

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export const PASSWORD_HINT =
  '8 a 72 caracteres, con mayúscula, minúscula, número y símbolo'

export function validateEmail(email) {
  if (!email?.trim()) return 'Ingresa tu correo'
  if (!EMAIL_REGEX.test(email)) return 'Correo no válido'
  return null
}

export function validateUsername(username) {
  if (!username) return 'Ingresa un nombre de usuario'
  if (!USERNAME_REGEX.test(username))
    return '3 a 30 caracteres: minúsculas, números, puntos o guiones bajos'
  return null
}

export function validateDisplayName(name) {
  if (!name?.trim()) return 'Ingresa tu nombre'
  if (name.length > 50) return 'Máximo 50 caracteres'
  return null
}

export function validateStrongPassword(password) {
  if (!password) return 'Ingresa una contraseña'
  if (!STRONG_PASSWORD_REGEX.test(password)) return `La contraseña debe tener ${PASSWORD_HINT}`
  return null
}

// Devuelve solo los campos con error: { email: '...', ... }
export function collectErrors(rules) {
  return Object.fromEntries(Object.entries(rules).filter(([, msg]) => msg))
}
