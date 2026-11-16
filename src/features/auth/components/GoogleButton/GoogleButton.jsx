import { useEffect, useRef, useState } from 'react'
import { env } from '../../../../config/env'
import './GoogleButton.css'

const GSI_SRC = 'https://accounts.google.com/gsi/client'
let scriptPromise

// Carga una sola vez el script de Google Identity Services
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GSI_SRC
      script.async = true
      script.defer = true
      script.onload = resolve
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('No se pudo cargar Google'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

/**
 * Botón oficial "Continuar con Google". Google devuelve un ID token (credential)
 * que se manda al backend en POST /auth/google.
 * Si no hay VITE_GOOGLE_CLIENT_ID configurado, no se muestra.
 */
export default function GoogleButton({ onCredential, text = 'continue_with', disabled = false }) {
  const containerRef = useRef(null)
  const callbackRef = useRef(onCredential)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    callbackRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    if (!env.googleClientId) return
    let cancelled = false
    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        window.google.accounts.id.initialize({
          client_id: env.googleClientId,
          callback: (response) => callbackRef.current?.(response.credential),
          ux_mode: 'popup',
        })
        const width = Math.min(containerRef.current.offsetWidth || 360, 400)
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text,
          locale: 'es',
          width,
        })
      })
      .catch((err) => !cancelled && setLoadError(err.message))
    return () => {
      cancelled = true
    }
  }, [text])

  if (!env.googleClientId) {
    // En producción no se muestra; en desarrollo avisa qué falta configurar
    if (!import.meta.env.DEV) return null
    return (
      <div className="google-auth">
        <div className="google-auth__divider">
          <span>o</span>
        </div>
        <button type="button" className="google-auth__placeholder" disabled>
          <span className="google-auth__g" aria-hidden="true">G</span>
          Continuar con Google
        </button>
        <p className="google-auth__hint">
          Falta <code>VITE_GOOGLE_CLIENT_ID</code> en <code>.env.local</code> (reinicia <code>npm run dev</code>).
        </p>
      </div>
    )
  }

  return (
    <div className="google-auth">
      <div className="google-auth__divider">
        <span>o</span>
      </div>
      <div
        ref={containerRef}
        className={`google-auth__button${disabled ? ' google-auth__button--disabled' : ''}`}
      />
      {loadError && <p className="google-auth__error">{loadError}</p>}
    </div>
  )
}
