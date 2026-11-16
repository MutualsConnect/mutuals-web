import { useState } from 'react'
import { Link } from 'react-router-dom'
import { streakService } from '../../services/streakService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import InvitationItem from '../../components/InvitationItem'
import '../../components/StreakPage.css'

const TABS = [
  { value: 'received', label: 'Recibidas' },
  { value: 'sent', label: 'Enviadas' },
]

export default function Invitations() {
  const [box, setBox] = useState('received')
  const { data: invitations, loading, error, run: reload, setData } = useAsync(
    () => streakService.getInvitations(box),
    [box],
  )
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const act = async (invitation, action) => {
    setBusyId(invitation.id)
    setActionError('')
    try {
      if (action === 'cancel') {
        await streakService.cancelInvitation(invitation.id)
        setData(invitations.map((i) => (i.id === invitation.id ? { ...i, status: 'CANCELED' } : i)))
      } else {
        const updated = await streakService.respondInvitation(invitation.id, action === 'accept')
        setData(invitations.map((i) => (i.id === invitation.id ? updated : i)))
      }
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo completar la acción'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="streak-page">
      <Link to={ROUTES.STREAKS} className="streak-page__back">
        ← Rachas
      </Link>
      <header>
        <h1 className="streak-page__title">Invitaciones a racha</h1>
        <p className="streak-page__subtitle">
          Para empezar una racha, invita a un mutual desde la lista de rachas.
        </p>
      </header>

      <Tabs tabs={TABS} value={box} onChange={setBox} />
      <ErrorMessage message={actionError} />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !invitations?.length ? (
        <EmptyState
          title={box === 'received' ? 'No tienes invitaciones' : 'No has enviado invitaciones'}
        />
      ) : (
        <div className="streak-page__list">
          {invitations.map((invitation) => (
            <InvitationItem
              key={invitation.id}
              invitation={invitation}
              box={box}
              busy={busyId === invitation.id}
              onAccept={(i) => act(i, 'accept')}
              onReject={(i) => act(i, 'reject')}
              onCancel={(i) => act(i, 'cancel')}
            />
          ))}
        </div>
      )}
    </section>
  )
}
