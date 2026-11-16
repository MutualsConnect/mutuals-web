import { INTERACTION_METHOD_LABELS } from '../../../streaks/constants'
import { formatNumber } from '../../../../utils/format'
import './MethodBars.css'
import Icon from '../../../../components/common/Icon'

const ICONS = { MANUAL: 'pen', QR: 'qr', PROXIMITY: 'pin' }

// interactionsByMethod: { MANUAL: 10, QR: 4, PROXIMITY: 2 }
export default function MethodBars({ byMethod }) {
  const entries = Object.entries(byMethod ?? {}).filter(([, n]) => n > 0)
  if (!entries.length) return null
  const max = Math.max(...entries.map(([, n]) => n))

  return (
    <ul className="method-bars">
      {entries
        .sort((a, b) => b[1] - a[1])
        .map(([method, count]) => (
          <li key={method}>
            <span className="method-bars__label">
              <Icon name={ICONS[method] ?? 'chat'} size={16} /> {INTERACTION_METHOD_LABELS[method] ?? method}
            </span>
            <span className="method-bars__track">
              <span className="method-bars__fill" style={{ width: `${(count / max) * 100}%` }} />
            </span>
            <strong className="method-bars__count">{formatNumber(count)}</strong>
          </li>
        ))}
    </ul>
  )
}
