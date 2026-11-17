import { useState } from 'react'
import { Link } from 'react-router-dom'
import { socialService } from '../../services/socialService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import UserList from '../../components/UserList'
import '../../../user/components/UserPage.css'
import { useToast } from '../../../../hooks/useToast'

export default function Blocks() {
  const toast = useToast()
  const list = usePaginated((page) => socialService.getBlocks(page), [])
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const unblock = async (user) => {
    setBusyId(user.id)
    setActionError('')
    try {
      await socialService.unblock(user.id)
      list.setItems(list.items.filter((u) => u.id !== user.id))
      toast.success(`Desbloqueaste a ${user.displayName ?? 'esta persona'}.`)
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo desbloquear'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="user-page">
      <Link to={ROUTES.SETTINGS} className="user-page__back">
        ← Configuración
      </Link>
      <header>
        <h1 className="user-page__title">Usuarios bloqueados</h1>
        <p className="user-page__subtitle">
          Al desbloquear no se recuperan los follows ni las rachas anteriores.
        </p>
      </header>
      <ErrorMessage message={actionError} />

      <UserList
        {...list}
        emptyTitle="No has bloqueado a nadie"
        renderAction={(user) => (
          <Button size="sm" variant="secondary" loading={busyId === user.id} onClick={() => unblock(user)}>
            Desbloquear
          </Button>
        )}
      />
    </section>
  )
}
