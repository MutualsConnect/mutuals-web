import { useState } from 'react'
import { userService } from '../../../user/services/userService'
import { useDebounce } from '../../../../hooks/useDebounce'
import { usePaginated } from '../../../../hooks/usePaginated'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import Input from '../../../../components/common/Input'
import UserList from '../../../social/components/UserList'
import SuspendUserModal from '../../components/SuspendUserModal'
import '../../components/AdminPage.css'
import { useToast } from '../../../../hooks/useToast'

export default function Users() {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query.trim().replace(/^@/, '').toLowerCase())
  const results = usePaginated((page) => userService.search(debounced, page), [debounced], {
    enabled: debounced.length >= 2,
  })
  const [target, setTarget] = useState(null)
  const [reactivateId, setReactivateId] = useState('')
  const toast = useToast()

  const onDone = (updated, status) => {
    setTarget(null)
    setReactivateId('')
    if (status === 'SUSPENDED') {
      // La búsqueda solo muestra cuentas activas
      results.setItems((items) => items.filter((u) => u.id !== updated.id))
      toast.success(`@${updated.username} fue suspendido.`)
    } else {
      toast.success(`@${updated.username} fue reactivado.`)
    }
  }

  return (
    <section className="admin-page">
      <header>
        <h1 className="admin-page__title">Usuarios</h1>
        <p className="admin-page__subtitle">Busca por nombre de usuario para suspender una cuenta.</p>
      </header>


      <Input
        type="search"
        placeholder="Buscar por nombre de usuario"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar usuarios"
      />
      {debounced.length >= 2 ? (
        <UserList
          {...results}
          emptyTitle={`No hay usuarios activos que empiecen con "${debounced}"`}
          renderAction={(user) => (
            <Button size="sm" variant="ghost" onClick={() => setTarget({ user, status: 'SUSPENDED' })}>
              Suspender
            </Button>
          )}
        />
      ) : (
        <p className="admin-page__muted">Escribe al menos 2 letras.</p>
      )}

      <Card>
        <h2 className="admin-page__section-title">Reactivar una cuenta</h2>
        <p className="admin-page__muted" style={{ marginBottom: 12 }}>
          Las cuentas suspendidas no salen en la búsqueda. Reactívalas por su ID (lo ves en el reporte
          o en la base de datos).
        </p>
        <form
          className="admin-page__row"
          onSubmit={(e) => {
            e.preventDefault()
            setTarget({ user: { id: Number(reactivateId) }, status: 'ACTIVE' })
          }}
        >
          <Input
            type="number"
            min={1}
            placeholder="ID de usuario"
            value={reactivateId}
            onChange={(e) => setReactivateId(e.target.value)}
            aria-label="ID de usuario"
          />
          <Button type="submit" variant="secondary" disabled={!reactivateId}>
            Reactivar
          </Button>
        </form>
      </Card>

      <SuspendUserModal target={target} onClose={() => setTarget(null)} onDone={onDone} />
    </section>
  )
}
