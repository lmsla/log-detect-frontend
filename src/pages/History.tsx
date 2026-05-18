import { Button, Input, Select, Space, Tag, Typography, message, Tabs } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getHistoryData, getHistoryLognameData, type HistoryData, type HistoryLogname } from '@/api/history'
import { getAllDevices, type Device } from '@/api/devices'
import dayjs from 'dayjs'
import HistoryTimeline from '@/components/HistoryTimeline'
import useDebouncedValue from '@/hooks/useDebouncedValue'
// auto rows removed; manual rows per page only

export default function History() {
  const [lognames, setLognames] = useState<HistoryLogname[]>([])
  const [selectedLogname, setSelectedLogname] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<HistoryData[]>([])
  const [keyword, setKeyword] = useState('')
  const debouncedKw = useDebouncedValue(keyword, 300)
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const QUICK_KEY = 'ld_history_quick'
  const [quick, setQuick] = useState<'1h' | '3h' | '6h' | 'all' | null>(() => {
    const saved = localStorage.getItem(QUICK_KEY)
    return saved === '1h' || saved === '3h' || saved === '6h' || saved === 'all' ? (saved as any) : null
  })
  const [msgApi, contextHolder] = message.useMessage()
  const [tabPage, setTabPage] = useState<string>('1')
  const ROWS_MANUAL_KEY = 'ld_history_rows_manual'
  const [rowsManual, setRowsManual] = useState<number>(() => {
    const v = parseInt(localStorage.getItem(ROWS_MANUAL_KEY) || '40', 10)
    return Number.isFinite(v) ? v : 40
  })
  const rowsPerTab = rowsManual

  const loadLognames = async () => {
    try {
      const [list, deviceList] = await Promise.all([getHistoryLognameData(), getAllDevices()])
      setLognames(list)
      setDevices(deviceList || [])
      if (!selectedLogname && list.length) setSelectedLogname(list[0].name)
    } catch (e: any) {
      msgApi.error(e?.message || '讀取 Logname 失敗')
    }
  }

  useEffect(() => {
    loadLognames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getQuickHours = (value: '1h' | '3h' | '6h' | 'all' | null) => {
    if (value === '1h') return 1
    if (value === '3h') return 3
    if (value === '6h') return 6
    return undefined
  }

  const buildRange = (value: '1h' | '3h' | '6h' | 'all') => {
    const now = dayjs()
    if (value === 'all') {
      return [now.hour(0).minute(0).second(0), now.hour(23).minute(59)] as [dayjs.Dayjs, dayjs.Dayjs]
    }
    const hours = value === '1h' ? 1 : value === '3h' ? 3 : 6
    return [now.subtract(hours, 'hour'), now] as [dayjs.Dayjs, dayjs.Dayjs]
  }

  const search = async (overrideQuick?: '1h' | '3h' | '6h' | 'all' | null) => {
    if (!selectedLogname) return
    setLoading(true)
    try {
      const saved = localStorage.getItem(QUICK_KEY)
      const effectiveQuick = overrideQuick || quick || (saved === '1h' || saved === '3h' || saved === '6h' || saved === 'all' ? saved : '1h')
      const res = await getHistoryData(selectedLogname, getQuickHours(effectiveQuick))
      let filtered = res
      setQuick(effectiveQuick)
      setRange(buildRange(effectiveQuick))
      localStorage.setItem(QUICK_KEY, effectiveQuick)
      if (debouncedKw.trim()) {
        const kw = debouncedKw.trim().toLowerCase()
        filtered = filtered.filter((d) => d.name.toLowerCase().includes(kw))
      }
      setData(filtered)
    } catch (e: any) {
      msgApi.error(e?.message || '查詢失敗')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const header = ['name', 'time', 'lost']
    const lines = data.map((d) => [d.name, d.time, d.lost])
    const csv = [header, ...lines].map((row) => row.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `history_${selectedLogname || 'all'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const summary = useMemo(() => {
    const deduped = new Map<string, HistoryData>()
    data.forEach((item) => {
      deduped.set(`${item.name}::${item.time}`, item)
    })
    const points = Array.from(deduped.values())
    const total = points.length
    const lost = points.filter((d) => d.lost === 'true').length
    const ok = points.filter((d) => d.lost === 'false').length
    const none = points.filter((d) => d.lost === 'none').length
    return { total, lost, ok, none }
  }, [data])

  // Tab 分頁（大量設備避免圖表被截斷）
  const deviceNames = useMemo(() => Array.from(new Set(data.map((d) => d.name))), [data])
  const deviceMeta = useMemo(() => {
    const map: Record<string, { haGroup?: string }> = {}
    devices.forEach((device) => {
      map[device.name] = { haGroup: device.ha_group || undefined }
    })
    return map
  }, [devices])
  const pageCount = Math.max(1, Math.ceil(deviceNames.length / Math.max(1, rowsPerTab)))
  useEffect(() => {
    // 當資料或 rowsPerTab 改變時，若目前頁超出範圍則回到最後一頁
    const curr = parseInt(tabPage, 10)
    if (curr > pageCount) setTabPage(String(pageCount))
  }, [pageCount, tabPage])
  const currentIndex = Math.min(pageCount, Math.max(1, parseInt(tabPage, 10))) - 1
  const currentNames = useMemo(() => deviceNames.slice(currentIndex * rowsPerTab, (currentIndex + 1) * rowsPerTab), [deviceNames, currentIndex, rowsPerTab])
  const visibleData = useMemo(() => {
    if (pageCount <= 1) return data
    const set = new Set(currentNames)
    return data.filter((d) => set.has(d.name))
  }, [data, currentNames, pageCount])

  // 快捷區間（近 N 小時 / 全天）
  const quickRange = (hours?: number) => {
    if (!Number.isFinite(hours)) {
      setQuick('all')
      setRange(buildRange('all'))
      localStorage.setItem(QUICK_KEY, 'all')
      search('all')
      return
    }
    const q = hours === 1 ? '1h' : hours === 3 ? '3h' : '6h'
    setQuick(q)
    setRange(buildRange(q))
    localStorage.setItem(QUICK_KEY, q)
    search(q)
  }

  // 當選擇不同的 logname 時，自動觸發查詢
  useEffect(() => {
    if (selectedLogname) {
      search()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLogname])

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {contextHolder}
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Typography.Title level={4}>歷史紀錄</Typography.Title>
        <Space>
          <Select
            showSearch
            placeholder="選擇 Logname"
            style={{ width: 220 }}
            value={selectedLogname}
            onChange={setSelectedLogname}
            optionFilterProp="label"
            options={lognames.map((l) => ({
              label: l.name,
              value: l.name
            }))}
          />
          <Space.Compact>
            <Button type={quick === '1h' ? 'primary' : 'default'} onClick={() => quickRange(1)}>近 1 小時</Button>
            <Button type={quick === '3h' ? 'primary' : 'default'} onClick={() => quickRange(3)}>近 3 小時</Button>
            <Button type={quick === '6h' ? 'primary' : 'default'} onClick={() => quickRange(6)}>近 6 小時</Button>
            <Button type={quick === 'all' ? 'primary' : 'default'} onClick={() => quickRange(undefined)}>全天</Button>
          </Space.Compact>
          <Input allowClear placeholder="搜尋設備（輸入關鍵字）" onChange={(e) => setKeyword(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" onClick={() => search()} loading={loading}>
            查詢
          </Button>
          <Button onClick={exportCSV} disabled={!data.length}>
            匯出 CSV
          </Button>
        </Space>
      </Space>

      <Space>
        <Tag color="blue">總數：{summary.total}</Tag>
        <Tag color="green">正常：{summary.ok}</Tag>
        <Tag color="gold">無資料：{summary.none}</Tag>
        <Tag color="red">異常：{summary.lost}</Tag>
      </Space>

      {!!data.length && (
        <>
          {/* 讓頁籤與每頁列數控制在有資料時始終顯示，即使只有 1 頁也顯示範圍，避免 UI 閃爍 */}
          <div>
            {deviceNames.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <Tabs
                  activeKey={tabPage}
                  onChange={setTabPage}
                  items={Array.from({ length: pageCount }).map((_, i) => {
                    const start = i * rowsPerTab + 1
                    const end = Math.min(deviceNames.length, (i + 1) * rowsPerTab)
                    return { key: String(i + 1), label: `${start}-${end}` }
                  })}
                />
                <Select
                  value={rowsManual}
                  style={{ width: 140 }}
                  onChange={(v) => {
                    setRowsManual(v)
                    localStorage.setItem(ROWS_MANUAL_KEY, String(v))
                  }}
                  options={[10, 20].map((n) => ({ label: `每頁 ${n} 列`, value: n }))}
                />
              </div>
            )}
            <HistoryTimeline
              data={visibleData.map((d) => ({ name: d.name, time: d.time, lost: d.lost }))}
              deviceMeta={deviceMeta}
              heightPerRow={26}
              cellWidth={8}
              cellGap={2}
              majorTickMinutes={60}
              minorTickMinutes={30}
              showTickLines
              autoFit
              minCellWidth={4}
              maxCellWidth={14}
              leftLabelWidth={160}
            />
          </div>
        </>
      )}
      
    </Space>
  )
}
