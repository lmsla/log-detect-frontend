import { http } from '@/api/http'

export type DeviceGroupWithCount = {
  id?: number
  name?: string
  device_group?: string // 後端兼容舊欄位
  description?: string
  device_count?: number
}

// 取得群組列表（含設備數量），優先新端點
export async function getDeviceGroupsWithCount(): Promise<DeviceGroupWithCount[]> {
  const { data } = await http.get('/api/v1/DeviceGroup/GetAll')
  // 可能包在 body
  const body = data?.body ?? data?.Body ?? data
  if (Array.isArray(body)) return body as DeviceGroupWithCount[]
  return []
}

export async function createDeviceGroup(payload: { name: string; description?: string }): Promise<DeviceGroupWithCount> {
  const { data } = await http.post('/api/v1/DeviceGroup/Create', payload)
  const body = data?.body ?? data?.Body ?? data
  return body as DeviceGroupWithCount
}

export async function updateDeviceGroup(payload: { id: number; name: string; description?: string }): Promise<DeviceGroupWithCount> {
  const { data } = await http.put('/api/v1/DeviceGroup/Update', payload)
  const body = data?.body ?? data?.Body ?? data
  return body as DeviceGroupWithCount
}

export async function deleteDeviceGroup(id: number): Promise<void> {
  await http.delete(`/api/v1/DeviceGroup/Delete/${id}`)
}
