import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { userService } from '../../services/userService'
import { useAsync } from '../../../../hooks/useAsync'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import Button from '../../../../components/common/Button'
import EmptyState from '../../../../components/common/EmptyState'
import Loader from '../../../../components/common/Loader'
import ProfileHeader from '../../components/ProfileHeader'
import FollowButton from '../../../social/components/FollowButton'
import BlockButton from '../../../social/components/BlockButton'
import ReportModal from '../../../social/components/ReportModal'
import '../../components/UserPage.css'

// /profile → mi perfil. /u/:username → perfil de otra persona (o el mío si es mi username).
export default function Profile() {
  const { username } = useParams()
  const { user: me } = useAuth()
  const navigate = useNavigate()
  const isMe = !username || username.toLowerCase() === me?.username

  const { data: profile, loading, error, run: reload, setData } = useAsync(
    () => (isMe ? userService.getProfile(me.id) : userService.getProfileByUsername(username)),
    [username, isMe],
  )
  const [reportOpen, setReportOpen] = useState(false)

  if (loading) return <Loader />
  if (error) {
    return (
      <div className="user-page">
        <EmptyState
          title="No pudimos cargar este perfil"
          description={error}
          action={<Button onClick={reload}>Reintentar</Button>}
        />
      </div>
    )
  }

  // Actualiza el botón y el contador de seguidores sin recargar
  const onFollowChange = ({ following }) => {
    setData({
      ...profile,
      followedByMe: following,
      followers: profile.followers + (following ? 1 : -1),
    })
  }

  return (
    <section className="user-page">
      <ProfileHeader profile={profile} isMe={isMe}>
        {isMe ? (
          <>
            <Link to={ROUTES.EDIT_PROFILE} className="btn btn--primary btn--md">
              Editar perfil
            </Link>
            <Link to={ROUTES.SETTINGS} className="btn btn--secondary btn--md">
              Configuración
            </Link>
          </>
        ) : (
          <>
            <FollowButton
              userId={profile.id}
              displayName={profile.displayName}
              following={profile.followedByMe}
              followsMe={profile.followsMe}
              onChange={onFollowChange}
            />
            <BlockButton user={profile} onBlocked={() => navigate(ROUTES.BLOCKS)} />
            <Button variant="ghost" onClick={() => setReportOpen(true)}>
              Reportar
            </Button>
          </>
        )}
      </ProfileHeader>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} user={profile} />
    </section>
  )
}
