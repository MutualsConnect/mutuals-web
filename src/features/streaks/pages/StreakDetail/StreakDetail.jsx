import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { streakService } from '../../services/streakService'
import { useAsync } from '../../../../hooks/useAsync'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { formatLocalDate, pluralize } from '../../../../utils/format'
import { STREAK_END_REASON_LABELS } from '../../constants'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Modal from '../../../../components/common/Modal'
import StreakFlame from '../../components/StreakFlame'
import RegisterInteractionModal from '../../components/RegisterInteractionModal'
import FriendChallenge from '../../../challenges/components/FriendChallenge'
import '../../components/StreakPage.css'
import './StreakDetail.css'
import Icon from '../../../../components/common/Icon'
import { useToast } from '../../../../hooks/useToast'

export default function StreakDetail() {
  const { streakId } = useParams()
  const { user, refreshUser } = useAuth()
  const { data: streak, loading, error, run: reload, setData } = useAsync(
    () => streakService.getDetail(streakId),
    [streakId],
  )

  const [interactionOpen, setInteractionOpen] = useState(false)
  const [shieldOpen, setShieldOpen] = useState(false)
  const [arming, setArming] = useState(false)
  const [actionError, setActionError] = useState('')
  const toast = useToast()

  const onArmShield = async () => {
    setArming(true)
    setActionError('')
    try {
      setData(await streakService.armShield(streakId))
      await refreshUser()
      toast.success('Escudo activado: protegerá esta racha si un día no se ven.')
      setShieldOpen(false)
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo activar el escudo'))
      setShieldOpen(false)
    } finally {
      setArming(false)
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const isActive = streak.status === 'ACTIVE'
  const atRisk = isActive && !streak.countedToday

  return (
    <section className="streak-page">
      <Link to={ROUTES.STREAKS} className="streak-page__back">
        ← Rachas
      </Link>

      <Card className="streak-detail__hero">
        <Avatar src={streak.friend.avatarUrl} name={streak.friend.displayName} size={88} />
        <div>
          <h1 className="streak-page__title">{streak.friend.displayName}</h1>
          <p className="streak-page__subtitle">@{streak.friend.username}</p>
        </div>
        <StreakFlame
          days={streak.currentLength}
          atRisk={atRisk || !isActive}
          shieldArmed={streak.shieldArmed}
          size="lg"
        />
        <div className="streak-detail__badges">
          {isActive ? (
            streak.countedToday ? (
              <Badge tone="success">Hoy ya contó</Badge>
            ) : (
              <Badge tone="warning">Todavía no cuenta hoy</Badge>
            )
          ) : (
            <Badge tone="danger">Racha terminada</Badge>
          )}
          {streak.pure && <Badge tone="primary"><Icon name="sparkle" size={12} /> Racha pura</Badge>}
          {streak.shieldArmed && <Badge tone="primary"><Icon name="shield" size={12} /> Escudo activo</Badge>}
        </div>
      </Card>

      <ErrorMessage message={actionError} />

      {isActive && (
        <div className="streak-detail__actions">
          <Link to={ROUTES.STREAKS_CHECK_IN} className="btn btn--primary btn--md">
            Check-in con QR
          </Link>
          <Button variant="secondary" onClick={() => setInteractionOpen(true)}>
            Registrar interacción
          </Button>
          {!streak.shieldArmed && (
            <Button variant="secondary" onClick={() => setShieldOpen(true)}>
              Activar escudo
            </Button>
          )}
        </div>
      )}

      {isActive && <FriendChallenge friendId={streak.friend.id} />}

      <Card>
        <dl className="streak-detail__stats">
          <div>
            <dt>Inicio</dt>
            <dd>{formatLocalDate(streak.startDate)}</dd>
          </div>
          <div>
            <dt>Último día activo</dt>
            <dd>{streak.lastActiveDate ? formatLocalDate(streak.lastActiveDate) : '—'}</dd>
          </div>
          <div>
            <dt>Escudos usados</dt>
            <dd>{streak.shieldsUsed}</dd>
          </div>
          {!isActive && (
            <>
              <div>
                <dt>Terminó</dt>
                <dd>{formatLocalDate(streak.endDate)}</dd>
              </div>
              <div>
                <dt>Motivo</dt>
                <dd>{STREAK_END_REASON_LABELS[streak.endReason] ?? streak.endReason}</dd>
              </div>
            </>
          )}
        </dl>
      </Card>

      <RegisterInteractionModal
        open={interactionOpen}
        onClose={() => setInteractionOpen(false)}
        friend={streak.friend}
        onCreated={() =>
          toast.success(`Interacción registrada. Falta que ${streak.friend.displayName} la confirme.`)
        }
      />

      <Modal
        open={shieldOpen}
        onClose={() => setShieldOpen(false)}
        title="Activar escudo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShieldOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onArmShield} loading={arming} disabled={!user?.shields}>
              Activar
            </Button>
          </>
        }
      >
        <p style={{ marginTop: 0 }}>
          El escudo protege la racha si un día no tienen interacción. Se descuenta en este momento y
          solo se puede usar uno por racha por semana.
        </p>
        <p style={{ marginBottom: 0 }}>
          Tienes <strong>{pluralize(user?.shields ?? 0, 'escudo')}</strong>.
          {!user?.shields && (
            <>
              {' '}
              <Link to={ROUTES.WALLET_SHIELDS}>Comprar escudos</Link>
            </>
          )}
        </p>
      </Modal>
    </section>
  )
}
