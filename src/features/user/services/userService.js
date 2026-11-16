import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

// Endpoints de /api/v1/users
export const userService = {
  // Mi cuenta
  getMe: () => axiosClient.get('/users/me').then(data),
  updateMe: (payload) => axiosClient.patch('/users/me', payload).then(data),
  deleteMe: () => axiosClient.delete('/users/me'),

  getPreferences: () => axiosClient.get('/users/me/preferences').then(data),
  updatePreferences: (payload) => axiosClient.patch('/users/me/preferences', payload).then(data),

  getDevices: () => axiosClient.get('/users/me/devices').then(data),
  deleteDevice: (deviceId) => axiosClient.delete(`/users/me/devices/${deviceId}`),

  // Perfiles públicos
  getProfile: (userId) => axiosClient.get(`/users/${userId}`).then(data),
  getProfileByUsername: (username) =>
    axiosClient.get(`/users/by-username/${encodeURIComponent(username)}`).then(data),

  // Listas paginadas (PageResponse: { content, page, size, totalElements, totalPages, last })
  search: (q, page = 0, size = 20) =>
    axiosClient.get('/users/search', { params: { q, page, size } }).then(data),
  getFollowers: (userId, page = 0, size = 20) =>
    axiosClient.get(`/users/${userId}/followers`, { params: { page, size } }).then(data),
  getFollowing: (userId, page = 0, size = 20) =>
    axiosClient.get(`/users/${userId}/following`, { params: { page, size } }).then(data),
}
