import './ErrorMessage.css'

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="error-message" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="error-message__retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
