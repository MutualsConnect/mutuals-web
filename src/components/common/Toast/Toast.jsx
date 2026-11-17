import Icon from '../Icon'
import './Toast.css'

const ICONS = { success: 'check', error: 'alert', info: 'sparkle' }

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <Icon name={ICONS[toast.type]} size={18} className="toast__icon" />
          <span className="toast__message">{toast.message}</span>
          <button type="button" className="toast__close" onClick={() => onDismiss(toast.id)} aria-label="Cerrar aviso">
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
