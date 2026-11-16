import { env } from '../config/env'

// El backend guarda los archivos locales como "/uploads/...". Con S3 devuelve la URL completa.
export function resolveMediaUrl(url) {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  return `${env.apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`
}
