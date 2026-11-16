import { useAuth } from '../../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()
  return (
    <section>
      <h1>Hola, {user?.displayName} 👋</h1>
      <p>Racha personal: {user?.personalStreak ?? 0} días</p>
    </section>
  )
}
