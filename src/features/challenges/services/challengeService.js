import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

export const challengeService = {
  // Desafíos de esta semana con mis mutuals
  getWeekly: () => axiosClient.get('/challenges').then(data),
  getById: (challengeId) => axiosClient.get(`/challenges/${challengeId}`).then(data),

  // multipart/form-data: content (texto, opcional) y photo (archivo, opcional)
  submit: (challengeId, { content, photo }) => {
    const form = new FormData()
    if (content?.trim()) form.append('content', content.trim())
    if (photo) form.append('photo', photo)
    // Con FormData, axios deja que el navegador ponga el Content-Type con su boundary
    return axiosClient.post(`/challenges/${challengeId}/submissions`, form).then(data)
  },
}
