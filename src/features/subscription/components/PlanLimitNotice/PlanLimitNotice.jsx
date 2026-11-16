import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import './PlanLimitNotice.css'
import Icon from '../../../../components/common/Icon'

// Aviso cuando el plan gratis llega al límite de rachas activas
export default function PlanLimitNotice({ limit = 4 }) {
  return (
    <div className="plan-limit" role="alert">
      <span>
        El plan gratis permite hasta <strong>{limit} rachas activas</strong>.
      </span>
      <Link to={ROUTES.SUBSCRIPTION} className="btn btn--primary btn--sm">
        <Icon name="crown" size={14} /> Pásate a Plus
      </Link>
    </div>
  )
}
