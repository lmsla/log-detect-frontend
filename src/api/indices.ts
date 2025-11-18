import { LogDetectApi, type Index, type LogName } from './openapiClient'
export type { Index, LogName } from './openapiClient'

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export async function getAllIndices() {
  return api.indicesManagement.getApiV1IndicesGetAll()
}

export async function getIndicesByLogname(logname: string) {
  return api.indicesManagement.getApiV1IndicesGetIndicesByLogname(logname)
}

export async function getLognames() {
  return api.indicesManagement.getApiV1IndicesGetLogname()
}

export async function createIndex(body: Index) {
  // 後端已統一由 Target 控制啟用狀態，不傳送 enable
  const { enable, ...rest } = body as any
  return api.indicesManagement.postApiV1IndicesCreate(rest as Index)
}

export async function updateIndex(body: Index) {
  // 後端已統一由 Target 控制啟用狀態，不傳送 enable
  const { enable, ...rest } = body as any
  return api.indicesManagement.putApiV1IndicesUpdate(rest as Index)
}

export async function deleteIndex(id: number) {
  const res = await api.indicesManagement.deleteApiV1IndicesDelete(id)
  return res.message
}
