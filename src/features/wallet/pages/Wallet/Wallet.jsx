import { useState } from 'react'
import { Link } from 'react-router-dom'
import { walletService } from '../../services/walletService'
import { useWallet } from '../../hooks/useWallet'
import { useAsync } from '../../../../hooks/useAsync'
import { ROUTES } from '../../../../constants/routes'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import BalanceCard from '../../components/BalanceCard'
import GiftShieldModal from '../../components/GiftShieldModal'
import TransactionItem from '../../components/TransactionItem'
import '../../components/WalletPage.css'
import '../../components/TransactionItem/TransactionItem.css'

const RECENT_COUNT = 5

export default function Wallet() {
  const { data: wallet, loading, error, run: reload, applyWallet } = useWallet()
  const recent = useAsync(() => walletService.getTransactions(0, RECENT_COUNT), [])
  const [giftOpen, setGiftOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const onGifted = (next, name) => {
    applyWallet(next)
    setNotice(`Le regalaste un escudo a ${name} 🛡️`)
    recent.run().catch(() => {})
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section className="wallet-page">
      <header>
        <h1 className="wallet-page__title">Billetera</h1>
        <p className="wallet-page__subtitle">
          Gana gemas con tus rachas, retos y logros. Úsalas para escudos e ítems de avatar.
        </p>
      </header>

      <BalanceCard gems={wallet.gems} shields={wallet.shields} />
      {notice && <p className="wallet-page__notice">{notice}</p>}

      <div className="wallet-page__actions">
        <Link to={ROUTES.WALLET_SHIELDS} className="btn btn--primary btn--md">
          Comprar escudos
        </Link>
        <Button variant="secondary" onClick={() => setGiftOpen(true)} disabled={wallet.shields < 1}>
          Regalar escudo
        </Button>
      </div>

      <Card>
        <div className="wallet-page__section-header">
          <h2 className="wallet-page__section-title">Últimos movimientos</h2>
          <Link to={ROUTES.WALLET_TRANSACTIONS}>Ver todos</Link>
        </div>
        {recent.loading ? (
          <Loader />
        ) : recent.error ? (
          <ErrorMessage message={recent.error} onRetry={recent.run} />
        ) : !recent.data?.content.length ? (
          <EmptyState title="Todavía no hay movimientos" />
        ) : (
          <ul className="transaction-list">
            {recent.data.content.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </ul>
        )}
      </Card>

      <GiftShieldModal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        shields={wallet.shields}
        onGifted={onGifted}
      />
    </section>
  )
}
