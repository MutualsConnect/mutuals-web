import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

// WalletResponse: { gems, shields, shieldPriceGems }
export const walletService = {
  getWallet: () => axiosClient.get('/wallet').then(data),
  getTransactions: (page = 0, size = 20) =>
    axiosClient.get('/wallet/transactions', { params: { page, size } }).then(data),
  purchaseShields: (quantity) => axiosClient.post('/shields/purchase', { quantity }).then(data),
  giftShield: (friendId) => axiosClient.post('/shields/gifts', { friendId }).then(data),
}
