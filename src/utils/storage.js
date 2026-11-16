import { STORAGE_KEYS } from '../constants/storageKeys'

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // localStorage no disponible (modo privado, etc.)
  }
}

export const tokenStorage = {
  getAccessToken: () => read(STORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => read(STORAGE_KEYS.REFRESH_TOKEN),
  setTokens: ({ accessToken, refreshToken }) => {
    write(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    write(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },
  clear: () => {
    write(STORAGE_KEYS.ACCESS_TOKEN, null)
    write(STORAGE_KEYS.REFRESH_TOKEN, null)
  },
}
