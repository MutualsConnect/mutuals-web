import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { challengeService } from '../../services/challengeService'
import { useAsync } from '../../../../hooks/useAsync'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES, profilePath } from '../../../../constants/routes'
import { formatLocalDate } from '../../../../utils/format'
import Avatar from '../../../../components/common/Avatar'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import ChallengeBadges from '../../components/ChallengeBadges'
import SubmissionCard from '../../components/SubmissionCard'
import SubmitChallengeForm from '../../components/SubmitChallengeForm'
import '../../components/ChallengePage.css'
import './ChallengeDetail.css'

export default function ChallengeDetail() {
  const { challengeId } = useParams()
  const { user: me, refreshUser } = useAuth()
  const { data: challenge, loading, error, run: reload, setData } = useAsync(
    () => challengeService.getById(challengeId),
    [challengeId],
  )
  const [notice, setNotice] = useState('')

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const { template, friend } = challenge
  const mySubmission = challenge.submissions.find((s) => s.user.id === me.id) ?? null
  const friendSubmission = challenge.submissions.find((s) => s.user.id === friend.id) ?? null
  const canSubmit = challenge.status === 'OPEN' && !challenge.submittedByMe

  const onSubmitted = (updated) => {
    setData(updated)
    if (updated.status === 'COMPLETED') {
      setNotice(`¡Desafío completado! Ganaron ${template.rewardGems} gemas cada uno.`)
      refreshUser().catch(() => {}) // actualiza las gemas
    } else {
      setNotice(`Listo. Cuando ${friend.displayName} responda, verán las respuestas de los dos.`)
    }
  }

  return (
    <section className="challenge-page">
      <Link to={ROUTES.CHALLENGES} className="challenge-page__back">
        ← Desafíos
      </Link>

      <Card className="challenge-detail__hero">
        <Link to={profilePath(friend.username)} className="challenge-detail__friend">
          <Avatar src={friend.avatarUrl} name={friend.displayName} size={40} />
          <span>
            con <strong>{friend.displayName}</strong>
          </span>
        </Link>
        <h1 className="challenge-page__title">{template.title}</h1>
        <p className="challenge-detail__prompt">{template.prompt}</p>
        <ChallengeBadges challenge={challenge} />
        <span className="challenge-detail__week">
          Semana del {formatLocalDate(challenge.weekStart, { day: 'numeric', month: 'long' })}
        </span>
      </Card>

      {notice && <p className="challenge-page__notice">{notice}</p>}

      {canSubmit && (
        <Card>
          <SubmitChallengeForm challenge={challenge} onSubmitted={onSubmitted} />
        </Card>
      )}

      <div className="challenge-page__section">
        <h2 className="challenge-page__section-title">Respuestas</h2>
        <div className="challenge-detail__submissions">
          <SubmissionCard
            user={me}
            submission={mySubmission}
            isMe
            waitingForFriend={challenge.status === 'OPEN' && !friendSubmission}
          />
          <SubmissionCard user={friend} submission={friendSubmission} />
        </div>
        {challenge.status === 'EXPIRED' && (
          <p className="challenge-page__subtitle">Este desafío venció. El lunes llega uno nuevo.</p>
        )}
      </div>
    </section>
  )
}
