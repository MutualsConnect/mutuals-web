import { useAsync } from '../../../hooks/useAsync'
import { streakService } from '../services/streakService'

// Contadores para los avisos: interacciones por confirmar e invitaciones recibidas
export function useStreakActivity() {
  return useAsync(async () => {
    const [pending, invitations] = await Promise.all([
      streakService.getPendingInteractions(),
      streakService.getInvitations('received'),
    ])
    return {
      pendingInteractions: pending.length,
      receivedInvitations: invitations.filter((i) => i.status === 'PENDING').length,
    }
  }, [])
}
