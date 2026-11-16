import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import { formatRelativeTime } from '../../../../utils/format'
import { INTERACTION_METHOD_LABELS, INTERACTION_STATUS_LABELS } from '../../constants'
import './InteractionItem.css'
import Icon from '../../../../components/common/Icon'

const STATUS_TONE = { PENDING: 'warning', CONFIRMED: 'success', EXPIRED: 'neutral', REJECTED: 'danger' }

// Una interacción (InteractionResponse). Si recibe onConfirm/onReject muestra los botones.
export default function InteractionItem({ interaction, onConfirm, onReject, busy = false }) {
  const { initiator, method, status, note, expiresAt, confirmedAt, streakLength } = interaction
  const isPending = status === 'PENDING'

  return (
    <div className="interaction-item">
      <Avatar src={initiator.avatarUrl} name={initiator.displayName} size={44} />
      <div className="interaction-item__body">
        <div className="interaction-item__title">
          <strong>{initiator.displayName}</strong>
          <span> registró una interacción</span>
        </div>
        {note && <p className="interaction-item__note">“{note}”</p>}
        <div className="interaction-item__meta">
          <Badge tone="primary">{INTERACTION_METHOD_LABELS[method] ?? method}</Badge>
          <Badge tone={STATUS_TONE[status]}>{INTERACTION_STATUS_LABELS[status] ?? status}</Badge>
          {isPending && expiresAt && <span>Vence {formatRelativeTime(expiresAt)}</span>}
          {confirmedAt && <span>{formatRelativeTime(confirmedAt)}</span>}
          {status === 'CONFIRMED' && streakLength != null && <span className="icon-text"><Icon name="flame" size={14} /> {streakLength}</span>}
        </div>
      </div>
      {isPending && (onConfirm || onReject) && (
        <div className="interaction-item__actions">
          <Button size="sm" onClick={() => onConfirm(interaction)} disabled={busy}>
            Confirmar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onReject(interaction)} disabled={busy}>
            Rechazar
          </Button>
        </div>
      )}
    </div>
  )
}
