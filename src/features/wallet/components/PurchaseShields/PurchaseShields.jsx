import { useState } from 'react'
import { walletService } from '../../services/walletService'
import { getErrorMessage } from '../../../../utils/errors'
import { pluralize } from '../../../../utils/format'
import { MAX_SHIELD_PURCHASE, MIN_SHIELD_PURCHASE } from '../../constants'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import './PurchaseShields.css'
import Icon from '../../../../components/common/Icon'

// Compra de escudos con gemas (nunca con dinero real)
export default function PurchaseShields({ wallet, onPurchased }) {
  const [quantity, setQuantity] = useState(1)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const total = quantity * wallet.shieldPriceGems
  const canAfford = wallet.gems >= total
  const maxAffordable = Math.floor(wallet.gems / wallet.shieldPriceGems)

  const buy = async () => {
    setBuying(true)
    setError('')
    setNotice('')
    try {
      const next = await walletService.purchaseShields(quantity)
      onPurchased(next)
      setNotice(`¡Listo! Compraste ${pluralize(quantity, 'escudo')}.`)
      setQuantity(1)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo completar la compra'))
    } finally {
      setBuying(false)
    }
  }

  return (
    <Card className="purchase-shields">
      <div className="purchase-shields__header">
        <h2 className="purchase-shields__title">Comprar escudos</h2>
        <span className="purchase-shields__price"><Icon name="gem" size={14} /> {wallet.shieldPriceGems} c/u</span>
      </div>

      <ErrorMessage message={error} />
      {notice && <p className="purchase-shields__notice">{notice}</p>}

      <div className="purchase-shields__row">
        <div className="stepper" role="group" aria-label="Cantidad de escudos">
          <button
            type="button"
            className="stepper__btn"
            onClick={() => setQuantity((q) => Math.max(MIN_SHIELD_PURCHASE, q - 1))}
            disabled={quantity <= MIN_SHIELD_PURCHASE}
            aria-label="Uno menos"
          >
            −
          </button>
          <span className="stepper__value" aria-live="polite">
            <Icon name="shield" size={16} /> {quantity}
          </span>
          <button
            type="button"
            className="stepper__btn"
            onClick={() => setQuantity((q) => Math.min(MAX_SHIELD_PURCHASE, q + 1))}
            disabled={quantity >= MAX_SHIELD_PURCHASE}
            aria-label="Uno más"
          >
            +
          </button>
        </div>
        <Button onClick={buy} loading={buying} disabled={!canAfford}>
          Comprar por <Icon name="gem" size={16} /> {total}
        </Button>
      </div>

      <p className="purchase-shields__hint">
        {canAfford
          ? `Hasta ${MAX_SHIELD_PURCHASE} por compra.`
          : maxAffordable > 0
            ? `Te alcanza para ${pluralize(maxAffordable, 'escudo')}.`
            : `Te faltan ${total - wallet.gems} gemas. Gana gemas manteniendo tus rachas y completando retos.`}
      </p>
    </Card>
  )
}
