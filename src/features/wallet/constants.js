// Igual que PurchaseShieldsRequest (@Min(1) @Max(5))
export const MIN_SHIELD_PURCHASE = 1
export const MAX_SHIELD_PURCHASE = 5

export const CURRENCY_ICONS = { GEM: '💎', SHIELD: '🛡️' }
export const CURRENCY_NAMES = { GEM: ['gema', 'gemas'], SHIELD: ['escudo', 'escudos'] }

// Enum WalletTransactionType
export const TRANSACTION_TYPE_LABELS = {
  EARN: 'Ganaste',
  SPEND: 'Gastaste',
  GIFT_SENT: 'Regalaste',
  GIFT_RECEIVED: 'Te regalaron',
  USED: 'Se usó',
  GRANT: 'Recibiste',
}
