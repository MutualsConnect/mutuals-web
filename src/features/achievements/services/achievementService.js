import axiosClient from '../../../api/axiosClient'

const data = (r) => r.data

export const achievementService = {
  // Catálogo completo con mi progreso (unlocked / unlockedAt)
  getCatalog: () => axiosClient.get('/achievements').then(data),
  // Solo los desbloqueados de un usuario (perfil público)
  getUnlockedBy: (userId) => axiosClient.get(`/users/${userId}/achievements`).then(data),
}
