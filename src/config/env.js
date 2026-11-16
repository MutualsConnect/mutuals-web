const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export const env = {
  apiUrl,
  // Dominio del backend sin /api/v1 (para archivos subidos como /uploads/...)
  apiOrigin: new URL(apiUrl).origin,
}
