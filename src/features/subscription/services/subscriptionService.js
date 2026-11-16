import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

// SubscriptionResponse: { plan, status, startedAt, expiresAt, maxActiveStreaks, benefits }
export const subscriptionService = {
  getCurrent: () => axiosClient.get('/subscriptions/me').then(data),
  // billingPeriod: 'MONTHLY' | 'YEARLY' (pago simulado)
  subscribe: (billingPeriod) => axiosClient.post('/subscriptions', { billingPeriod }).then(data),
  // Cancela la renovación; los beneficios siguen hasta expiresAt
  cancel: () => axiosClient.delete('/subscriptions/me').then(data),
}
