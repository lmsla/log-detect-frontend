import { LogDetectApi, type LoginResponse } from './openapiClient'

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export type { LoginResponse }

export async function login(username: string, password: string): Promise<LoginResponse> {
  return api.authentication.postAuthLogin({ username, password })
}
