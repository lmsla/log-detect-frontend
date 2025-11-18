import { Button, Input, Select, Space, Tag, Typography, message, Tabs } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getHistoryData, getHistoryLognameData, type HistoryData, type HistoryLogname } from '@/api/history'
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
      const list = await getHistoryLognameData()
      setLognames(list)
      if (!selectedLogname && list.length) setSelectedLogname(list[0].name)
    } catch (e: any) {
      msgApi.error(e?.message || '讀取 Logname 失敗')
    }
  }

  useEffect(() => {
    loadLognames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMinutes = (t: string) => {
    const [hh, mm] = t.split(':').map((x) => parseInt(x, 10))
    if (Number.isFinite(hh) && Number.isFinite(mm)) return hh * 60 + mm
    return NaN
  }

  const search = async (overrideRange?: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (!selectedLogname) return
    setLoading(true)
    try {
      const res = await getHistoryData(selectedLogname)
      // 日期範圍與關鍵字：由前端過濾（僅比較時分，忽略日期）
      let filtered = res
      let r = (overrideRange === undefined ? range : overrideRange) as any
      let hasValidRange = Array.isArray(r) && r.length === 2 && r[0] && r[1] && typeof r[0].hour === 'function' && typeof r[1].hour === 'function'
      if (!hasValidRange) {
        // 預設採用上次的快捷區間（若無則 1 小時）
        const saved = quick || (localStorage.getItem(QUICK_KEY) as any)
        const now = dayjs()
        let start = now.subtract(1, 'hour')
        let end = now
        let q: '1h' | '3h' | '6h' | 'all' = '1h'
        if (saved === '3h') { start = now.subtract(3, 'hour'); q = '3h' }
        else if (saved === '6h') { start = now.subtract(6, 'hour'); q = '6h' }
        else if (saved === 'all') { start = now.hour(0).minute(0).second(0); end = now.hour(23).minute(59); q = 'all' }
        r = [start, end]
        setRange(r)
        setQuick(q)
        localStorage.setItem(QUICK_KEY, q)
        hasValidRange = true
      }
      if (hasValidRange) {
        const sMin = r[0].hour() * 60 + r[0].minute()
        const eMin = r[1].hour() * 60 + r[1].minute()
        filtered = filtered.filter((d) => {
          const tMin = getMinutes(d.time)
          return Number.isFinite(tMin) && tMin >= sMin && tMin <= eMin
        })
      }
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
    const total = data.length
    const lost = data.filter((d) => d.lost === 'true').length
    const ok = data.filter((d) => d.lost === 'false').length
    const none = data.filter((d) => d.lost === 'none').length
    return { total, lost, ok, none }
  }, [data])

  // Tab 分頁（大量設備避免圖表被截斷）
  const deviceNames = useMemo(() => Array.from(new Set(data.map((d) => d.name))), [data])
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
    const now = dayjs()
    if (!Number.isFinite(hours)) {
      // 全天
      const start = now.hour(0).minute(0).second(0)
      const end = now.hour(23).minute(59)
      setRange([start, end])
      setQuick('all')
      localStorage.setItem(QUICK_KEY, 'all')
      search([start, end])
      return
    }
    const nowMin = now.hour() * 60 + now.minute()
    const startMin = Math.max(0, nowMin - (hours as number) * 60)
    const start = now.hour(Math.floor(startMin / 60)).minute(startMin % 60)
    const end = now
    setRange([start, end])
    const q = hours === 1 ? '1h' : hours === 3 ? '3h' : '6h'
    setQuick(q)
    localStorage.setItem(QUICK_KEY, q)
    search([start, end])
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
            options={lognames.map((l) => ({ label: `${l.name} (${l.lost === 'true' ? '異常' : '正常'})`, value: l.name }))}
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
