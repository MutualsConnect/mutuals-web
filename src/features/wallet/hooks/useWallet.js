import { useCallback } from 'react'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../hooks/useAuth'
import { walletService } from '../services/walletService'

// Saldo de la billetera. Al cambiar, también actualiza gemas y escudos del usuario
// (los que se ven en la Navbar).
export function useWallet() {
  const { setUser } = useAuth()
  const wallet = useAsync(() => walletService.getWallet(), [])
  const { setData } = wallet

  const applyWallet = useCallback(
    (next) => {
      setData(next)
      setUser((u) => (u ? { ...u, gems: next.gems, shields: next.shields } : u))
    },
    [setData, setUser],
  )

  return { ...wallet, applyWallet }
}
