import Button from '../../../../components/common/Button'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import UserListItem from '../UserListItem'
import './UserList.css'

// Lista paginada de usuarios. Recibe lo que devuelve usePaginated.
// renderAction(user) es opcional para poner un botón en cada fila.
export default function UserList({
  items,
  loading,
  loadingMore,
  error,
  hasMore,
  loadMore,
  reload,
  emptyTitle = 'No hay usuarios',
  emptyDescription,
  renderAction,
}) {
  if (loading) return <Loader />
  if (error && !items.length) return <ErrorMessage message={error} onRetry={reload} />
  if (!items.length) return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div className="user-list">
      {items.map((user) => (
        <UserListItem key={user.id} user={user} action={renderAction?.(user)} />
      ))}
      {error && <ErrorMessage message={error} onRetry={loadMore} />}
      {hasMore && (
        <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
          Ver más
        </Button>
      )}
    </div>
  )
}
