import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

export const socialService = {
  // Devuelve { userId, following, mutual }
  follow: (userId) => axiosClient.post(`/users/${userId}/follow`).then(data),
  // Con racha activa responde 409 salvo que confirmStreakLoss sea true
  unfollow: (userId, confirmStreakLoss = false) =>
    axiosClient.delete(`/users/${userId}/follow`, { params: { confirmStreakLoss } }),

  block: (userId) => axiosClient.post(`/users/${userId}/block`),
  unblock: (userId) => axiosClient.delete(`/users/${userId}/block`),
  getBlocks: (page = 0, size = 20) =>
    axiosClient.get('/blocks', { params: { page, size } }).then(data),

  report: ({ reportedUserId, reason, description }) =>
    axiosClient
      .post('/reports', { reportedUserId, reason, description: description || null })
      .then(data),
}
