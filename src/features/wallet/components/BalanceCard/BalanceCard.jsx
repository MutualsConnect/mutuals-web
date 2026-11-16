import { formatNumber } from '../../../../utils/format'
import './BalanceCard.css'
import Icon from '../../../../components/common/Icon'

export default function BalanceCard({ gems, shields }) {
  return (
    <div className="balance-card">
      <div className="balance-card__item balance-card__item--gems">
        <span className="balance-card__icon">
          <Icon name="gem" size={28} />
        </span>
        <strong className="balance-card__value">{formatNumber(gems)}</strong>
        <span className="balance-card__label">gemas</span>
      </div>
      <div className="balance-card__item balance-card__item--shields">
        <span className="balance-card__icon">
          <Icon name="shield" size={28} />
        </span>
        <strong className="balance-card__value">{formatNumber(shields)}</strong>
        <span className="balance-card__label">escudos</span>
      </div>
    </div>
  )
}
