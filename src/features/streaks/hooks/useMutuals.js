import { useAsync } from '../../../hooks/useAsync'
import { streakService } from '../services/streakService'

export function useMutuals() {
  return useAsync(() => streakService.getMutuals(), [])
}
