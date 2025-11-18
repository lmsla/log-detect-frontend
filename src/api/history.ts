import { LogDetectApi, type HistoryData } from './openapiClient'
export type { HistoryData }

export type HistoryLogname = {
  name: string
  lost: string
}

const api = new LogDetectApi({ BASE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006' })

export async function getHistoryData(logname: string) {
  return api.history.getApiV1HistoryGetData(logname)
}

export async function getHistoryLognameData(): Promise<HistoryLogname[]> {
  const raw: any[] = (await api.history.getApiV1HistoryGetLognameData()) as any[]
  return (raw || []).map((d) => ({
    name: d?.name ?? d?.Name ?? d?.logname ?? d?.Logname ?? '',
    // 若無 lost 欄位，保守視為 'false'（正常），以維持現有 UI 體驗
    lost: d?.lost ?? d?.Lost ?? 'false'
  }))
}
