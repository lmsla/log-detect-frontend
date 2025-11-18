import { LogDetectApi, type Target } from './openapiClient'
export type { Target } from './openapiClient'

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export async function getAllTargets() {
  return api.targetManagement.getApiV1TargetGetAll()
}

export async function createTarget(body: Target) {
  return api.targetManagement.postApiV1TargetCreate(body)
}

export async function updateTarget(body: Target) {
  return api.targetManagement.putApiV1TargetUpdate(body)
}

export async function deleteTarget(id: number) {
  const res = await api.targetManagement.deleteApiV1TargetDelete(id)
  return res.message
}
