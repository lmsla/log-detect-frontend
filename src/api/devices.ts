import { LogDetectApi, type Device as GenDevice, type DeviceCount, type DeviceGroup } from './openapiClient'
export type { DeviceCount, DeviceGroup } from './openapiClient'

export type Device = GenDevice

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export async function getAllDevices() {
  return api.deviceManagement.getApiV1DeviceGetAll()
}

export async function getDeviceGroups() {
  return api.deviceManagement.getApiV1DeviceGetGroup()
}

export async function getDeviceCounts() {
  return api.deviceManagement.getApiV1DeviceCount()
}

export async function createDevices(devices: Device[]) {
  return api.deviceManagement.postApiV1DeviceCreate(devices)
}

export async function updateDevice(device: Device) {
  return api.deviceManagement.putApiV1DeviceUpdate(device)
}

export async function deleteDevice(id: number) {
  const res = await api.deviceManagement.deleteApiV1DeviceDelete(id)
  return res.message
}
