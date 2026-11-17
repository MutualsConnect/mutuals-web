import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToastContext } from './ToastContext'
import ToastViewport from '../components/common/Toast'

const DURATION_MS = 4000
const MAX_TOASTS = 4

// Mensajes cortos que aparecen y se van solos (éxito, error o información)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (type, message) => {
      if (!message) return
      const id = ++nextId.current
      setToasts((list) => [...list, { id, type, message }].slice(-MAX_TOASTS))
      timers.current.set(id, setTimeout(() => dismiss(id), DURATION_MS))
    },
    [dismiss],
  )

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const value = useMemo(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
      dismiss,
    }),
    [show, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
