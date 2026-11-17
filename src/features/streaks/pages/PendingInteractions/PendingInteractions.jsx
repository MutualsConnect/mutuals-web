import { useState } from 'react'
import { Link } from 'react-router-dom'
import { streakService } from '../../services/streakService'
import { useAsync } from '../../../../hooks/useAsync'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import InteractionItem from '../../components/InteractionItem'
import '../../components/StreakPage.css'
import { useToast } from '../../../../hooks/useToast'

// Interacciones manuales que mis mutuals registraron y que debo confirmar o rechazar
export default function PendingInteractions() {
  const toast = useToast()
  const { refreshUser } = useAuth()
  const { data: interactions, loading, error, run: reload, setData } = useAsync(
    () => streakService.getPendingInteractions(),
    [],
  )
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const act = async (interaction, confirm) => {
    setBusyId(interaction.id)
    setActionError('')
    try {
      const updated = confirm
        ? await streakService.confirmInteraction(interaction.id)
        : await streakService.rejectInteraction(interaction.id)
      setData(interactions.map((i) => (i.id === interaction.id ? updated : i)))
      // Confirmar suma a la racha personal
      if (confirm) refreshUser().catch(() => {})
      toast.success(confirm ? '¡Interacción confirmada! Suma a su racha.' : 'Interacción rechazada.')
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
        <h1 className="streak-page__title">Por confirmar</h1>
        <p className="streak-page__subtitle">
          Confirma solo si de verdad se vieron o hablaron. Vencen a las 24 horas.
        </p>
      </header>

      <ErrorMessage message={actionError} />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !interactions?.length ? (
        <EmptyState title="Nada por confirmar" description="Estás al día." />
      ) : (
        <div className="streak-page__list">
          {interactions.map((interaction) => (
            <InteractionItem
              key={interaction.id}
              interaction={interaction}
              busy={busyId === interaction.id}
              onConfirm={(i) => act(i, true)}
              onReject={(i) => act(i, false)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
