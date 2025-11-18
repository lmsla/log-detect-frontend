const TOKEN_KEY = 'ld_token'
const PROFILE_KEY = 'ld_profile'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function setAuth(token: string, profile?: any) {
  localStorage.setItem(TOKEN_KEY, token)
  if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(PROFILE_KEY)
}

export function getUserProfile<T = any>(): T | null {
  const raw = localStorage.getItem(PROFILE_KEY)
  return raw ? (JSON.parse(raw) as T) : null
}

