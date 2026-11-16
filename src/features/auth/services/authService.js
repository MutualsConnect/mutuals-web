import axiosClient from '../../../api/axiosClient'

// Endpoints de /api/v1/auth. login, register y refresh devuelven AuthResponse:
// { accessToken, refreshToken, tokenType, expiresIn, user }
export const authService = {
  login: (credentials) =>
    axiosClient.post('/auth/login', credentials).then((r) => r.data),

  register: (payload) =>
    axiosClient.post('/auth/register', payload).then((r) => r.data),

  // idToken = credential que entrega Google Identity Services
  loginWithGoogle: (idToken) =>
    axiosClient.post('/auth/google', { idToken }).then((r) => r.data),

  logout: (refreshToken) => axiosClient.post('/auth/logout', { refreshToken }),

  requestPasswordReset: (email) =>
    axiosClient.post('/auth/password-reset', { email }).then((r) => r.data),

  confirmPasswordReset: (token, newPassword) =>
    axiosClient.post('/auth/password-reset/confirm', { token, newPassword }),

  getMe: () => axiosClient.get('/users/me').then((r) => r.data),
}
