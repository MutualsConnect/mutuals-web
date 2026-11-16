const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export const env = {
  apiUrl,
  // Dominio del backend sin /api/v1 (para archivos subidos como /uploads/...)
  apiOrigin: new URL(apiUrl).origin,
  // OAuth Client ID de Google (vacío = sin botón de Google)
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
}
