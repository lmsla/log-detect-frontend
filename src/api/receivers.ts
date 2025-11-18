import { LogDetectApi, type Receiver } from './openapiClient'
export type { Receiver } from './openapiClient'

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export async function getAllReceivers() {
  return api.receiverManagement.getApiV1ReceiverGetAll()
}

export async function createReceiver(receiver: Receiver) {
  return api.receiverManagement.postApiV1ReceiverCreate(receiver)
}

export async function updateReceiver(receiver: Receiver) {
  return api.receiverManagement.putApiV1ReceiverUpdate(receiver)
}

export async function deleteReceiver(id: number) {
  const res = await api.receiverManagement.deleteApiV1ReceiverDelete(id)
  return res.message
}
