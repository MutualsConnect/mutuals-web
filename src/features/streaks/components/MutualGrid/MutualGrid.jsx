import { useState } from 'react'
import { Link } from 'react-router-dom'
import { streakService } from '../../services/streakService'
import { useMutuals } from '../../hooks/useMutuals'
import { getErrorMessage } from '../../../../utils/errors'
import { ROUTES } from '../../../../constants/routes'
import Loader from '../../../../components/common/Loader'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import MutualCard from '../MutualCard'
import PlanLimitNotice from '../../../subscription/components/PlanLimitNotice'
import { isPlanLimitError } from '../../../subscription/constants'
import './MutualGrid.css'
import { useToast } from '../../../../hooks/useToast'

// Grid de mutuals con su racha. El backend ya los manda ordenados (primero los que vencen hoy).
export default function MutualGrid() {
  const toast = useToast()
  const { data: mutuals, loading, error, run: reload, setData } = useMutuals()
  const [invitingId, setInvitingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [planLimit, setPlanLimit] = useState(null)

  const onInvite = async (friend) => {
    setInvitingId(friend.id)
    setActionError('')
    setPlanLimit(null)
    try {
      await streakService.invite(friend.id)
      setData(mutuals.map((m) => (m.friend.id === friend.id ? { ...m, invitationPending: true } : m)))
      toast.success(`Invitación de racha enviada a ${friend.displayName}.`)
    } catch (err) {
      if (isPlanLimitError(err)) setPlanLimit(err.response.data.details.limit)
      else setActionError(getErrorMessage(err, 'No se pudo enviar la invitación'))
    } finally {
      setInvitingId(null)
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />
  if (!mutuals?.length) {
    return (
      <EmptyState
        title="Todavía no tienes mutuals"
        description="Cuando sigas a alguien y te siga de vuelta, aparecerá aquí y podrán empezar una racha."
        action={<Link to={ROUTES.SEARCH}>Buscar amigos</Link>}
      />
    )
  }

  return (
    <div className="mutual-grid__wrapper">
      <ErrorMessage message={actionError} />
      {planLimit && <PlanLimitNotice limit={planLimit} />}
      <div className="mutual-grid">
        {mutuals.map((mutual) => (
          <MutualCard
            key={mutual.mutualId}
            mutual={mutual}
            onInvite={onInvite}
            inviting={invitingId === mutual.friend.id}
          />
        ))}
      </div>
    </div>
  )
}
