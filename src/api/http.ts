import axios from 'axios'
import { getToken, setAuth, clearAuth } from '@/store/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006',
  timeout: 20000
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

let refreshing = false
let subscribers: Array<(token: string) => void> = []

function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token))
  subscribers = []
}

http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error.config
    if (error?.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve) => {
          subscribers.push((token: string) => {
            original.headers['Authorization'] = `Bearer ${token}`
            resolve(http(original))
          })
        })
      }

      original._retry = true
      refreshing = true
      try {
        const res = await http.post('/api/v1/auth/refresh')
        const newToken = res.data?.token
        if (newToken) {
          setAuth(newToken)
          onRefreshed(newToken)
          original.headers['Authorization'] = `Bearer ${newToken}`
          return http(original)
        }
      } catch (_) {
        clearAuth()
        // fall through
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(error)
  }
)

