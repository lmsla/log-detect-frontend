import { LogDetectApi, type User } from './openapiClient'

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export type { User }

export async function getUsers() {
  return api.userManagement.getApiV1AuthUsers()
}

export async function getUser(id: number) {
  return api.userManagement.getApiV1AuthUsers1(id)
}

export async function updateUser(user: Partial<User> & { id: number }) {
  // 後端 Update 使用 User 結構，這裡直接傳送（由後端決定可更新欄位）
  return api.userManagement.putApiV1AuthUsers(user.id, user as User)
}

export async function deleteUser(id: number) {
  const res = await api.userManagement.deleteApiV1AuthUsers(id)
  return res.message
}

export async function registerUser(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
  // 依 OpenAPI 規格，register 接受 User 結構（此規格未含密碼欄位）
  return api.authentication.postApiV1AuthRegister(user as any)
}

