import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

// WrappedResponse: { id, scope, periodType, periodKey, generatedAt, stats }
export const wrappedService = {
  // Mis Wrappeds generados (mensuales y anuales), del más nuevo al más viejo
  getMine: () => axiosClient.get('/wrapped').then(data),
  // periodKey: "2026-10" (mes) o "2026" (año). 404 si todavía no se generó
  getByPeriod: (periodKey) => axiosClient.get(`/wrapped/${periodKey}`).then(data),
  // { overall, fullAccess, friends } — en el plan gratis solo 3 amigos
  getAllTime: () => axiosClient.get('/wrapped/all-time').then(data),
  // Solo Plus
  getAllTimeWithFriend: (friendId) => axiosClient.get(`/wrapped/all-time/mutuals/${friendId}`).then(data),
  // Wrapped de toda la plataforma (público)
  getPlatform: (periodKey) => axiosClient.get(`/wrapped/platform/${periodKey}`).then(data),
}
