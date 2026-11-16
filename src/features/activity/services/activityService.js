import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

export const activityService = {
  // Feed de novedades: mis mutuals, los perfiles que sigo y yo
  getFeed: (page = 0, size = 20) =>
    axiosClient.get('/activities', { params: { page, size } }).then(data),

  like: (activityId) => axiosClient.post(`/activities/${activityId}/likes`).then(data),
  unlike: (activityId) => axiosClient.delete(`/activities/${activityId}/likes`),

  getComments: (activityId, page = 0, size = 20) =>
    axiosClient.get(`/activities/${activityId}/comments`, { params: { page, size } }).then(data),
  // Solo entre mutuals (canComment)
  comment: (activityId, content) =>
    axiosClient.post(`/activities/${activityId}/comments`, { content }).then(data),
}
