// El backend responde los errores con ErrorResponse:
// { timestamp, status, error, message, path, fieldErrors, details }

export function getErrorMessage(error, fallback = 'Ocurrió un error inesperado') {
  if (!error) return fallback
  if (error.response?.data?.message) return error.response.data.message
  if (error.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor'
  return error.message || fallback
}

export function getFieldErrors(error) {
  return error?.response?.data?.fieldErrors ?? {}
}
