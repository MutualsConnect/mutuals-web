import { formatNumber } from '../../../utils/format'
import './StatGrid.css'

// stats: [{ label, value, icon?, tone? }]
export default function StatGrid({ stats }) {
  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div key={s.label} className={`stat-grid__item ${s.tone ? `stat-grid__item--${s.tone}` : ''}`}>
          {s.icon && (
            <span className="stat-grid__icon" aria-hidden>
              {s.icon}
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
