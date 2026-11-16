import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import EmptyState from '../../components/common/EmptyState'

export default function NotFound() {
  return (
    <EmptyState
      title="Página no encontrada"
      description="La página que buscas no existe."
      action={<Link to={ROUTES.HOME}>Volver al inicio</Link>}
    />
  )
}
