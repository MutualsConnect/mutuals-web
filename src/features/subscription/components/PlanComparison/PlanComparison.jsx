import { PLAN_COMPARISON } from '../../constants'
import './PlanComparison.css'
import Icon from '../../../../components/common/Icon'

export default function PlanComparison({ currentPlan }) {
  return (
    <div className="plan-comparison" role="table" aria-label="Comparación de planes">
      <div className="plan-comparison__row plan-comparison__row--head" role="row">
        <span role="columnheader" />
        <span role="columnheader" className={currentPlan === 'FREE' ? 'is-current' : ''}>
          Gratis
        </span>
        <span role="columnheader" className={`plan-comparison__plus ${currentPlan === 'PLUS' ? 'is-current' : ''}`}>
          <Icon name="crown" size={14} /> Plus
        </span>
      </div>
      {PLAN_COMPARISON.map((row) => (
        <div key={row.feature} className="plan-comparison__row" role="row">
          <span role="rowheader" className="plan-comparison__feature">
            {row.feature}
          </span>
          <span role="cell">{row.free}</span>
          <span role="cell" className="plan-comparison__plus-cell">
            {row.plus}
          </span>
        </div>
      ))}
    </div>
  )
}
