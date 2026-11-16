import { Link } from 'react-router-dom'
import { walletService } from '../../services/walletService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { ROUTES } from '../../../../constants/routes'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import TransactionItem from '../../components/TransactionItem'
import '../../components/WalletPage.css'
import '../../components/TransactionItem/TransactionItem.css'

export default function Transactions() {
  const { items, loading, loadingMore, error, hasMore, loadMore, reload } = usePaginated(
    (page) => walletService.getTransactions(page),
    [],
  )

  return (
    <section className="wallet-page">
      <Link to={ROUTES.WALLET} className="wallet-page__back">
        ← Billetera
      </Link>
      <h1 className="wallet-page__title">Movimientos</h1>

      {loading ? (
        <Loader />
      ) : error && !items.length ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : !items.length ? (
        <EmptyState title="Todavía no hay movimientos" />
      ) : (
        <Card>
          <ul className="transaction-list">
            {items.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </ul>
          {error && <ErrorMessage message={error} onRetry={loadMore} />}
          {hasMore && (
            <Button variant="secondary" fullWidth onClick={loadMore} loading={loadingMore}>
              Ver más
            </Button>
          )}
        </Card>
      )}
    </section>
  )
}
