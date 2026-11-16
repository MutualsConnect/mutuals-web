import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

// Endpoints de /api/v1/admin (requieren rol ADMIN)
export const adminService = {
  // { activeUsers, suspendedUsers, activeMutuals, activeStreaks, brokenStreaks, pendingReports, plusSubscribers }
  getMetrics: () => axiosClient.get('/admin/metrics').then(data),

  // Reportes: status = PENDING | REVIEWED | DISMISSED
  getReports: (status = 'PENDING', page = 0, size = 20) =>
    axiosClient.get('/admin/reports', { params: { status, page, size } }).then(data),
  reviewReport: (reportId, { status, resolutionNote, suspendUser }) =>
    axiosClient
      .patch(`/admin/reports/${reportId}`, { status, resolutionNote: resolutionNote || null, suspendUser })
      .then(data),

  // Usuarios: status = ACTIVE | SUSPENDED
  updateUserStatus: (userId, status) =>
    axiosClient.patch(`/admin/users/${userId}/status`, { status }).then(data),

  hideComment: (commentId) => axiosClient.delete(`/admin/comments/${commentId}`),

  // Plantillas de desafíos
  getTemplates: (page = 0, size = 50) =>
    axiosClient.get('/admin/challenge-templates', { params: { page, size } }).then(data),
  createTemplate: (payload) => axiosClient.post('/admin/challenge-templates', payload).then(data),
  updateTemplate: (id, payload) => axiosClient.put(`/admin/challenge-templates/${id}`, payload).then(data),
  deactivateTemplate: (id) => axiosClient.delete(`/admin/challenge-templates/${id}`),
  assignWeeklyChallenges: () => axiosClient.post('/admin/challenges/assign').then(data),

  // Wrapped de la plataforma: periodKey = "2026-11" (mes) o "2026" (año)
  generatePlatformWrapped: (periodKey) =>
    axiosClient.post(`/admin/wrapped/platform/${periodKey}`).then(data),
  getPlatformWrapped: (periodKey) => axiosClient.get(`/wrapped/platform/${periodKey}`).then(data),
}
