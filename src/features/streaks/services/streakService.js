import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

export const streakService = {
  // Grid del Home: mis mutuals con su racha (primero las que vencen hoy)
  getMutuals: () => axiosClient.get('/mutuals').then(data),

  // Rachas
  getHistory: (includeBlocked = false) =>
    axiosClient.get('/streaks/history', { params: { includeBlocked } }).then(data),
  getDetail: (streakId) => axiosClient.get(`/streaks/${streakId}`).then(data),
  armShield: (streakId) => axiosClient.post(`/streaks/${streakId}/shield`).then(data),

  // Invitaciones a racha
  getInvitations: (box = 'received') =>
    axiosClient.get('/streak-invitations', { params: { box } }).then(data),
  invite: (friendId) => axiosClient.post('/streak-invitations', { friendId }).then(data),
  respondInvitation: (invitationId, accept) =>
    axiosClient.patch(`/streak-invitations/${invitationId}`, { accept }).then(data),
  cancelInvitation: (invitationId) => axiosClient.delete(`/streak-invitations/${invitationId}`),

  // Interacciones
  createInteraction: (friendId, note) =>
    axiosClient.post('/interactions', { friendId, note: note || null }).then(data),
  confirmInteraction: (id) => axiosClient.post(`/interactions/${id}/confirm`).then(data),
  rejectInteraction: (id) => axiosClient.post(`/interactions/${id}/reject`).then(data),
  getPendingInteractions: () => axiosClient.get('/interactions/pending').then(data),
  getTimeline: (page = 0, size = 20) =>
    axiosClient.get('/interactions/timeline', { params: { page, size } }).then(data),

  // Check-ins
  getMyQrCode: () => axiosClient.get('/qr-codes/me').then(data),
  checkInWithQr: (token) => axiosClient.post('/check-ins/qr', { token }).then(data),
  checkInByProximity: ({ friendId, latitude, longitude }) =>
    axiosClient.post('/check-ins/proximity', { friendId, latitude, longitude }).then(data),
}
