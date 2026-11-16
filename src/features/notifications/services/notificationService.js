import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

export const notificationService = {
  // priority: 'HIGH' | 'LOW' | undefined (todas)
  list: (priority, page = 0, size = 20) =>
    axiosClient
      .get('/notifications', { params: { priority: priority || undefined, page, size } })
      .then(data),
  // { total, high, low }
  getUnreadCount: () => axiosClient.get('/notifications/unread-count').then(data),
  markRead: (id) => axiosClient.patch(`/notifications/${id}/read`).then(data),
  markAllRead: () => axiosClient.patch('/notifications/read-all').then(data),
}
