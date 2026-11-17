import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../../hooks/useWallet'
import { ROUTES } from '../../../../constants/routes'
import { pluralize } from '../../../../utils/format'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import BalanceCard from '../../components/BalanceCard'
import GiftShieldModal from '../../components/GiftShieldModal'
import PurchaseShields from '../../components/PurchaseShields'
import '../../components/WalletPage.css'
import { useToast } from '../../../../hooks/useToast'

export default function Shields() {
  const { data: wallet, loading, error, run: reload, applyWallet } = useWallet()
  const [giftOpen, setGiftOpen] = useState(false)
  const toast = useToast()

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section className="wallet-page">
      <Link to={ROUTES.WALLET} className="wallet-page__back">
        ← Billetera
      </Link>
      <header>
        <h1 className="wallet-page__title">Escudos</h1>
        <p className="wallet-page__subtitle">Protegen tus rachas los días que no pueden verse.</p>
      </header>

      <BalanceCard gems={wallet.gems} shields={wallet.shields} />

      <PurchaseShields wallet={wallet} onPurchased={applyWallet} />

      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 className="wallet-page__section-title">Regalar a un mutual</h2>
          <p className="wallet-page__subtitle">
            Tienes {pluralize(wallet.shields, 'escudo')} para regalar.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setGiftOpen(true)} disabled={wallet.shields < 1}>
          Regalar escudo
        </Button>
      </Card>

      <Card>
        <h2 className="wallet-page__section-title" style={{ marginBottom: 12 }}>
          ¿Cómo funcionan?
        </h2>
        <ul className="wallet-page__rules">
          <li>
            Se <strong>activan desde el detalle de una racha</strong>. Si ese día no tienen
            interacción, el escudo se consume y la racha sigue.
          </li>
          <li>
            Solo se puede usar <strong>1 escudo por racha por semana</strong>.
          </li>
          <li>
            Al activarlo se descuenta en el momento. Si la racha termina por unfollow o bloqueo, se
            devuelve.
          </li>
          <li>
            Una racha que nunca usó escudo es una <strong>racha pura</strong>.
          </li>
          <li>
            Los escudos <strong>nunca se venden con dinero real</strong>: solo con gemas, regalos de
            mutuals o el beneficio mensual de Plus.
          </li>
        </ul>
      </Card>

      <GiftShieldModal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        shields={wallet.shields}
        onGifted={(next, name) => {
          applyWallet(next)
          toast.success(`Le regalaste un escudo a ${name}.`)
        }}
      />
    </section>
  )
}
