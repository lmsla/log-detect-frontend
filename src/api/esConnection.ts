import { LogDetectApi, type ESConnection, type ESConnectionSummary } from './openapiClient'

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export type { ESConnection, ESConnectionSummary }

// Get all ES connections
export async function getAllESConnections() {
  return api.esConnectionManagement.getApiV1EsConnectionGetAll()
}

// Get single ES connection by ID
export async function getESConnection(id: number) {
  return api.esConnectionManagement.getApiV1EsConnectionGet(id)
}

// Create new ES connection
export async function createESConnection(connection: Partial<ESConnection>) {
  return api.esConnectionManagement.postApiV1EsConnectionCreate(connection as any)
}

// Update ES connection
export async function updateESConnection(connection: Partial<ESConnection>) {
  return api.esConnectionManagement.putApiV1EsConnectionUpdate(connection as any)
}

// Delete ES connection
export async function deleteESConnection(id: number) {
  return api.esConnectionManagement.deleteApiV1EsConnectionDelete(id)
}

// Test ES connection
export async function testESConnection(connection: Partial<ESConnection>) {
  return api.esConnectionManagement.postApiV1EsConnectionTest(connection as any)
}

// Set default ES connection
export async function setDefaultESConnection(id: number) {
  return api.esConnectionManagement.putApiV1EsConnectionSetDefault(id)
}

// Reload single ES connection
export async function reloadESConnection(id: number) {
  return api.esConnectionManagement.putApiV1EsConnectionReload(id)
}

// Reload all ES connections
export async function reloadAllESConnections() {
  return api.esConnectionManagement.putApiV1EsConnectionReloadAll()
}
