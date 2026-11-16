import { Link } from 'react-router-dom'
import { useStreakActivity } from '../../hooks/useStreakActivity'
import { ROUTES } from '../../../../constants/routes'
import { pluralize } from '../../../../utils/format'
import './StreakActivityBanner.css'

// Avisos de cosas por responder: interacciones por confirmar e invitaciones recibidas
export default function StreakActivityBanner() {
  const { data } = useStreakActivity()
  if (!data || (!data.pendingInteractions && !data.receivedInvitations)) return null

  return (
    <div className="streak-activity">
      {data.pendingInteractions > 0 && (
        <Link to={ROUTES.STREAKS_PENDING} className="streak-activity__item">
          ⏳ {pluralize(data.pendingInteractions, 'interacción por confirmar', 'interacciones por confirmar')}
        </Link>
      )}
      {data.receivedInvitations > 0 && (
        <Link to={ROUTES.STREAKS_INVITATIONS} className="streak-activity__item">
          ✉️ {pluralize(data.receivedInvitations, 'invitación a racha', 'invitaciones a racha')}
        </Link>
      )}
    </div>
  )
}
