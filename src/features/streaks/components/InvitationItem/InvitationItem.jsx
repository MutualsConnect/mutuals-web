import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import { formatRelativeTime } from '../../../../utils/format'
import { INVITATION_STATUS_LABELS } from '../../constants'
import './InvitationItem.css'

const STATUS_TONE = { PENDING: 'warning', ACCEPTED: 'success', REJECTED: 'danger', CANCELED: 'neutral' }

// box: 'received' muestra aceptar/rechazar; 'sent' muestra cancelar
export default function InvitationItem({ invitation, box, onAccept, onReject, onCancel, busy = false }) {
  const person = box === 'received' ? invitation.inviter : invitation.invitee
  const isPending = invitation.status === 'PENDING'

  return (
    <div className="invitation-item">
      <Avatar src={person.avatarUrl} name={person.displayName} size={44} />
      <div className="invitation-item__body">
        <div>
          <strong>{person.displayName}</strong>{' '}
          <span className="invitation-item__username">@{person.username}</span>
        </div>
        <div className="invitation-item__meta">
          <Badge tone={STATUS_TONE[invitation.status]}>
            {INVITATION_STATUS_LABELS[invitation.status] ?? invitation.status}
          </Badge>
          <span>{formatRelativeTime(invitation.createdAt)}</span>
        </div>
      </div>
      {isPending && box === 'received' && (
        <div className="invitation-item__actions">
          <Button size="sm" onClick={() => onAccept(invitation)} disabled={busy}>
            Aceptar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onReject(invitation)} disabled={busy}>
            Rechazar
          </Button>
        </div>
      )}
      {isPending && box === 'sent' && (
        <Button size="sm" variant="secondary" onClick={() => onCancel(invitation)} disabled={busy}>
          Cancelar
        </Button>
      )}
    </div>
  )
}
