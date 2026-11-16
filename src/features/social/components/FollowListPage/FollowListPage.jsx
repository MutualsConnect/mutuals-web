import { Link, useNavigate, useParams } from 'react-router-dom'
import { userService } from '../../../user/services/userService'
import { useAsync } from '../../../../hooks/useAsync'
import { usePaginated } from '../../../../hooks/usePaginated'
import { followersPath, followingPath, profilePath } from '../../../../constants/routes'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import UserList from '../UserList'
import '../../../user/components/UserPage.css'

// type: 'followers' | 'following'. Las listas son públicas.
export default function FollowListPage({ type }) {
  const { username } = useParams()
  const navigate = useNavigate()
  const { data: profile, loading, error, run: reload } = useAsync(
    () => userService.getProfileByUsername(username),
    [username],
  )

  const fetcher = type === 'followers' ? userService.getFollowers : userService.getFollowing
  const list = usePaginated((page) => fetcher(profile.id, page), [profile?.id, type], {
    enabled: Boolean(profile),
  })

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section className="user-page">
      <Link to={profilePath(username)} className="user-page__back">
        ← {profile.displayName}
      </Link>

      <Tabs
        value={type}
        onChange={(t) => navigate(t === 'followers' ? followersPath(username) : followingPath(username), { replace: true })}
        tabs={[
          { value: 'followers', label: `Seguidores (${profile.followers})` },
          { value: 'following', label: `Siguiendo (${profile.following})` },
        ]}
      />

      <UserList
        {...list}
        emptyTitle={type === 'followers' ? 'Todavía no tiene seguidores' : 'Todavía no sigue a nadie'}
      />
    </section>
  )
}
