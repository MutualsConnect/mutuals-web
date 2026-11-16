import { formatDate, pluralize } from '../../../../utils/format'
import { CURRENCY_ICONS, CURRENCY_NAMES, TRANSACTION_TYPE_LABELS } from '../../constants'
import './TransactionItem.css'
import Icon from '../../../../components/common/Icon'

// Un movimiento (WalletTransactionResponse). amount ya viene con signo.
export default function TransactionItem({ transaction }) {
  const { currency, amount, type, reason, counterpartyUsername, createdAt } = transaction
  const positive = amount > 0
  const [singular, plural] = CURRENCY_NAMES[currency] ?? ['', '']

  return (
    <li className="transaction-item">
      <span className="transaction-item__icon" aria-hidden>
        <Icon name={CURRENCY_ICONS[currency]} size={20} />
      </span>
      <div className="transaction-item__body">
        <span className="transaction-item__title">
          {TRANSACTION_TYPE_LABELS[type] ?? type} {pluralize(Math.abs(amount), singular, plural)}
          {counterpartyUsername &&
            (type === 'GIFT_SENT' ? ` a @${counterpartyUsername}` : ` de @${counterpartyUsername}`)}
        </span>
        <span className="transaction-item__meta">
          {reason && `${reason} · `}
          {formatDate(createdAt, { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>
      <strong className={`transaction-item__amount ${positive ? 'is-positive' : 'is-negative'}`}>
        {positive ? '+' : '−'}
        {Math.abs(amount)}
      </strong>
    </li>
  )
}
