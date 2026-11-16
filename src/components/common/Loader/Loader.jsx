import './Loader.css'

export default function Loader({ fullScreen = false, label = 'Cargando...' }) {
  return (
    <div className={`loader ${fullScreen ? 'loader--full' : ''}`} role="status">
      <span className="loader__spinner" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  )
}
