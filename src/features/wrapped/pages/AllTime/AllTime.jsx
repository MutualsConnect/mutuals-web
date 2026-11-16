import { Link } from 'react-router-dom'
import { wrappedService } from '../../services/wrappedService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import WrappedStory from '../../components/WrappedStory'
import FriendSection from '../../components/FriendSection'
import { FREE_FRIEND_SECTIONS } from '../../constants'
import '../../components/WrappedPage.css'
import Icon from '../../../../components/common/Icon'

// Wrapped de siempre: se calcula al momento. Gratis: resumen y 3 amigos. Plus: todos.
export default function AllTime() {
  const { data, loading, error, run: reload } = useAsync(() => wrappedService.getAllTime(), [])

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section className="wrapped-page">
      <Link to={ROUTES.WRAPPED} className="wrapped-page__back">← Wrapped</Link>

      <WrappedStory title="De siempre" stats={data.overall} />

      <div>
        <h2 className="wrapped-page__section-title">Con cada amigo</h2>
        {!data.friends.length ? (
          <p className="wrapped-page__subtitle">Todavía no tienes historia con ningún mutual.</p>
        ) : (
          <div className="wrapped-page__list">
            {data.friends.map((section) => (
              <FriendSection key={section.friend.id} section={section} />
            ))}
          </div>
        )}
      </div>

      {!data.fullAccess && data.friends.length >= FREE_FRIEND_SECTIONS && (
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span>
            Con el plan gratis ves {FREE_FRIEND_SECTIONS} amigos. <strong>Plus</strong> te muestra tu historia
            con todos, incluso ex amigos.
          </span>
          <Link to={ROUTES.SUBSCRIPTION} className="btn btn--primary btn--sm">
            <Icon name="crown" size={14} /> Ver Plus
          </Link>
        </Card>
      )}
    </section>
  )
}
