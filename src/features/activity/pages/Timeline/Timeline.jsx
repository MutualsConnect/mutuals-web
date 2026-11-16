import { useState } from 'react'
import { Link } from 'react-router-dom'
import { activityService } from '../../services/activityService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import Button from '../../../../components/common/Button'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import ActivityCard from '../../components/ActivityCard'
import './Timeline.css'

const FILTERS = [
  { value: 'all', label: 'Todo' },
  { value: 'mutuals', label: 'Mutuals' },
]

// Feed de novedades. Los logros nunca dicen con quién es la racha.
export default function Timeline() {
  const { user } = useAuth()
  const feed = usePaginated((page) => activityService.getFeed(page), [])
  const [filter, setFilter] = useState('all')

  const updateItem = (updated) =>
    feed.setItems((items) => items.map((a) => (a.id === updated.id ? updated : a)))

  // El backend no filtra, así que "Mutuals" filtra lo que ya está cargado
  const visible =
    filter === 'mutuals' ? feed.items.filter((a) => a.fromMutual || a.actor.id === user.id) : feed.items

  return (
    <section className="timeline">
      <header>
        <h1 className="timeline__title">Novedades</h1>
        <p className="timeline__subtitle">Logros y rachas de tus mutuals y de los perfiles que sigues.</p>
      </header>

      <Tabs tabs={FILTERS} value={filter} onChange={setFilter} />

      {feed.loading ? (
        <Loader />
      ) : feed.error && !feed.items.length ? (
        <ErrorMessage message={feed.error} onRetry={feed.reload} />
      ) : !visible.length ? (
        <EmptyState
          title="Todavía no hay novedades"
          description="Sigue a más personas para ver sus logros y rachas aquí."
          action={<Link to={ROUTES.SEARCH}>Buscar amigos</Link>}
        />
      ) : (
        <div className="timeline__list">
          {visible.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isMine={activity.actor.id === user.id}
              onChange={updateItem}
            />
          ))}
          {feed.error && <ErrorMessage message={feed.error} onRetry={feed.loadMore} />}
          {feed.hasMore && (
            <Button variant="secondary" onClick={feed.loadMore} loading={feed.loadingMore}>
              Ver más
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
