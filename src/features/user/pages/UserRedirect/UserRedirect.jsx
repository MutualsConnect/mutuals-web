import { Navigate, useParams } from 'react-router-dom'
import { userService } from '../../services/userService'
import { useAsync } from '../../../../hooks/useAsync'
import { profilePath } from '../../../../constants/routes'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'

export default function UserRedirect() {
  const { userId } = useParams()
  const { data, loading, error, run } = useAsync(() => userService.getProfile(userId), [userId])

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={run} />
  return <Navigate to={profilePath(data.username)} replace />
}
