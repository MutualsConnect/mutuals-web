import { Link } from 'react-router-dom'
import { achievementService } from '../../services/achievementService'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import Card from '../../../../components/common/Card'
import Loader from '../../../../components/common/Loader'
import AchievementBadge from '../AchievementBadge'
import './ProfileAchievements.css'

const MAX_VISIBLE = 8

// Logros desbloqueados en un perfil. Nunca dicen con quién fue la racha.
export default function ProfileAchievements({ userId, isMe = false }) {
  const { data, loading, error } = useAsync(() => achievementService.getUnlockedBy(userId), [userId])

  if (error) return null
  const unlocked = [...(data ?? [])].sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))

  return (
    <Card id="logros" className="profile-achievements">
      <div className="profile-achievements__header">
        <h2 className="profile-achievements__title">Logros</h2>
        {isMe && <Link to={ROUTES.ACHIEVEMENTS}>Ver todos</Link>}
      </div>
      {loading ? (
        <Loader />
      ) : !unlocked.length ? (
        <p className="profile-achievements__empty">
          {isMe ? 'Todavía no desbloqueas logros. ¡Mantén tus rachas!' : 'Todavía no tiene logros.'}
        </p>
      ) : (
        <div className="profile-achievements__grid">
          {unlocked.slice(0, MAX_VISIBLE).map((a) => (
            <AchievementBadge key={a.code} achievement={a} compact />
          ))}
        </div>
      )}
      {unlocked.length > MAX_VISIBLE && (
        <p className="profile-achievements__empty">y {unlocked.length - MAX_VISIBLE} más</p>
      )}
    </Card>
  )
}
