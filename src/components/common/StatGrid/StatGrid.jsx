import { formatNumber } from '../../../utils/format'
import './StatGrid.css'
import Icon from '../Icon'

// stats: [{ label, value, icon? (nombre de <Icon>), tone? }]
export default function StatGrid({ stats }) {
  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div key={s.label} className={`stat-grid__item ${s.tone ? `stat-grid__item--${s.tone}` : ''}`}>
          {s.icon && (
            <span className="stat-grid__icon">
              <Icon name={s.icon} size={20} />
            </span>
          )}
          <strong className="stat-grid__value">
            {typeof s.value === 'number' ? formatNumber(s.value) : (s.value ?? '—')}
          </strong>
          <span className="stat-grid__label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
