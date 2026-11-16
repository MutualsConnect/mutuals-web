import './StreakFlame.css'
import Icon from '../../../../components/common/Icon'

// Fueguito con los días de racha. Gris si está en riesgo (no contó hoy).
export default function StreakFlame({ days, atRisk = false, shieldArmed = false, size = 'md' }) {
  return (
    <span
      className={`streak-flame streak-flame--${size} ${atRisk ? 'streak-flame--risk' : ''}`}
      title={atRisk ? 'Todavía no cuenta hoy' : 'Hoy ya contó'}
    >
      <Icon name="flame" className="streak-flame__icon" size="1.1em" filled />
      <span className="streak-flame__days">{days}</span>
      {shieldArmed && (
        <Icon name="shield" className="streak-flame__shield" size="0.85em" label="Escudo activo" />
      )}
    </span>
  )
}
