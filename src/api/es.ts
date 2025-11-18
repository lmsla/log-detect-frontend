import { http } from '@/api/http'

export type ESStatistics = {
  total_monitors: number
  online_monitors: number
  offline_monitors: number
  warning_monitors?: number
  total_nodes?: number
  total_indices?: number
  total_documents?: number
  total_size_gb?: number
  avg_response_time?: number
  avg_cpu_usage?: number
  avg_memory_usage?: number
  active_alerts?: number
  last_update_time?: string
}

export type ESMonitorStatus = {
  monitor_id: number
  monitor_name: string
  host: string
  status: 'online' | 'offline' | 'warning' | 'error' | string
  cluster_status?: 'green' | 'yellow' | 'red' | string
  cluster_name?: string
  response_time?: number
  cpu_usage?: number
  memory_usage?: number
  disk_usage?: number
  node_count?: number
  active_shards?: number
  unassigned_shards?: number
  last_check_time?: string
  error_message?: string
  warning_message?: string
}

// unwrap helper: backend may return { success, msg, body } or direct data
function unwrap<T>(data: any): T {
  if (data && typeof data === 'object') {
    if ('body' in data) return data.body as T
    // 一些後端回傳使用大寫 Body
    if ('Body' in data) return (data as any).Body as T
    // 有些情況包在 data
    if ('data' in data) return (data as any).data as T
  }
  return data as T
}

export async function getEsStatistics(): Promise<ESStatistics> {
  const { data } = await http.get('/api/v1/elasticsearch/statistics')
  return unwrap<ESStatistics>(data)
}

export async function getEsStatus(params?: {
  page?: number
  page_size?: number
  q?: string
  status?: string[]
}): Promise<ESMonitorStatus[]> {
  const { data } = await http.get('/api/v1/elasticsearch/status', { params })
  const unwrapped = unwrap<ESMonitorStatus[] | any>(data)
  return Array.isArray(unwrapped) ? unwrapped : []
}

// Monitors CRUD
export type ESMonitor = {
  id?: number
  name: string
  host: string
  port: number
  enable_auth?: boolean
  username?: string
  password?: string
  check_type?: string // comma separated
  interval: number
  enable_monitor?: boolean
  receivers?: string[]
  subject?: string
  description?: string
  alert_threshold?: string
  alert_dedupe_window?: number
  // thresholds (optional, fallback to defaults on backend)
  cpu_usage_high?: number
  cpu_usage_critical?: number
  memory_usage_high?: number
  memory_usage_critical?: number
  disk_usage_high?: number
  disk_usage_critical?: number
  response_time_high?: number
  response_time_critical?: number
  unassigned_shards_threshold?: number
}

export async function listEsMonitors(): Promise<ESMonitor[]> {
  const { data } = await http.get('/api/v1/elasticsearch/monitors')
  const unwrapped = unwrap<ESMonitor[] | any>(data)
  return Array.isArray(unwrapped) ? unwrapped : []
}

export async function createEsMonitor(body: ESMonitor): Promise<ESMonitor> {
  const { data } = await http.post('/api/v1/elasticsearch/monitors', body)
  return unwrap<ESMonitor>(data)
}

export async function updateEsMonitor(body: ESMonitor): Promise<ESMonitor> {
  const { data } = await http.put('/api/v1/elasticsearch/monitors', body)
  return unwrap<ESMonitor>(data)
}

export async function deleteEsMonitor(id: number): Promise<void> {
  await http.delete(`/api/v1/elasticsearch/monitors/${id}`)
}

export async function toggleEsMonitor(id: number, enable: boolean): Promise<void> {
  await http.post(`/api/v1/elasticsearch/monitors/${id}/toggle`, { enable })
}

export async function testEsMonitor(id: number): Promise<any> {
  const { data } = await http.post(`/api/v1/elasticsearch/monitors/${id}/test`)
  return unwrap<any>(data)
}

export type ESAlert = {
  id: number
  time: string
  monitor_id: number
  monitor_name?: string
  alert_type: 'health' | 'performance' | 'capacity' | 'availability' | string
  severity: 'critical' | 'high' | 'medium' | 'low' | string
  message?: string
  status: 'active' | 'resolved' | 'acknowledged' | string
  resolved_at?: string | null
  resolution_note?: string | null
  resolved_by?: string | null
  acknowledged_by?: string | null
  acknowledged_at?: string | null
  acknowledgement_note?: string | null
}

export type ListEsAlertsParams = {
  status?: string[]
  severity?: string[]
  alert_type?: string[]
  monitor_id?: number
  start_time?: string
  end_time?: string
  page?: number
  page_size?: number
}

export type ESAlertListResult = {
  items: ESAlert[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function listEsAlerts(params: ListEsAlertsParams = {}): Promise<ESAlertListResult> {
  const query: Record<string, any> = {}
  if (params.page) query.page = params.page
  if (params.page_size) query.page_size = params.page_size
  if (params.monitor_id) query.monitor_id = params.monitor_id
  if (params.start_time) query.start_time = params.start_time
  if (params.end_time) query.end_time = params.end_time
  if (params.status?.length) query['status[]'] = params.status
  if (params.severity?.length) query['severity[]'] = params.severity
  if (params.alert_type?.length) query['alert_type[]'] = params.alert_type

  const { data } = await http.get('/api/v1/elasticsearch/alerts', { params: query })
  const body = unwrap<{ items?: ESAlert[]; pagination?: { page?: number; page_size?: number; total?: number; total_pages?: number } }>(data) || {}
  const items = Array.isArray(body.items) ? body.items : []
  const pagination = body.pagination || {}
  const pageSizeBase = pagination.page_size ?? params.page_size ?? (items.length || 20)
  const totalBase = pagination.total ?? items.length
  return {
    items,
    pagination: {
      page: pagination.page ?? params.page ?? 1,
      pageSize: pageSizeBase,
      total: totalBase,
      totalPages: pagination.total_pages ?? Math.max(1, Math.ceil(totalBase / Math.max(pageSizeBase, 1))),
    },
  }
}

export async function getEsAlert(id: number): Promise<ESAlert> {
  const { data } = await http.get(`/api/v1/elasticsearch/alerts/${id}`)
  return unwrap<ESAlert>(data)
}

export async function resolveEsAlert(id: number, resolutionNote?: string): Promise<void> {
  await http.post(`/api/v1/elasticsearch/alerts/${id}/resolve`, {
    resolution_note: resolutionNote,
  })
}

export async function acknowledgeEsAlert(id: number, acknowledgedBy?: string, note?: string): Promise<void> {
  await http.put(`/api/v1/elasticsearch/alerts/${id}/acknowledge`, {
    acknowledged_by: acknowledgedBy,
    note: note,
  })
}

export type ESMetricTimeSeries = {
  time: string
  cpu_usage?: number
  memory_usage?: number
  disk_usage?: number
  response_time?: number
  indexing_rate?: number
  search_rate?: number
  active_shards?: number
  unassigned_shards?: number
}

export type ESMonitorHistory = {
  monitor_id: number
  start_time: string
  end_time: string
  interval: string
  data: ESMetricTimeSeries[]
}

export async function getEsMonitorHistory(
  monitorId: number,
  params?: {
    hours?: number
    interval?: '1 minute' | '5 minutes' | '10 minutes' | '1 hour' | string
  }
): Promise<ESMonitorHistory> {
  const { data } = await http.get(`/api/v1/elasticsearch/status/${monitorId}/history`, {
    params,
  })
  return unwrap<ESMonitorHistory>(data)
}
