import './StreakFlame.css'

// Fueguito con los días de racha. Gris si está en riesgo (no contó hoy).
export default function StreakFlame({ days, atRisk = false, shieldArmed = false, size = 'md' }) {
  return (
    <span
      className={`streak-flame streak-flame--${size} ${atRisk ? 'streak-flame--risk' : ''}`}
      title={atRisk ? 'Todavía no cuenta hoy' : 'Hoy ya contó'}
    >
      <span className="streak-flame__icon" aria-hidden>
        🔥
      </span>
      <span className="streak-flame__days">{days}</span>
      {shieldArmed && (
        <span className="streak-flame__shield" title="Escudo activo" aria-label="Escudo activo">
          🛡️
        </span>
      )}
    </span>
  )
}
