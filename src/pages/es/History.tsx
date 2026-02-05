import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Typography,
  message,
  type TableProps,
} from 'antd'
import dayjs from 'dayjs'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useThemeMode } from '@/theme/ThemeContext'
import PageHeader from '@/components/PageHeader'
import {
  getEsMonitorHistory,
  listEsMonitors,
  type ESMetricTimeSeries,
  type ESMonitor,
  type ESMonitorHistory,
} from '@/api/es'

type MetricPoint = { time: string; value: number }

type MetricSummary = {
  points: MetricPoint[]
  unit?: string
  color?: string
}

const HOURS_OPTIONS = [
  { label: '6 小時', value: 6 },
  { label: '24 小時', value: 24 },
  { label: '72 小時', value: 72 },
  { label: '7 天', value: 168 },
]

const INTERVAL_OPTIONS = [
  { label: '自動', value: 'auto' },
  { label: '1 分鐘', value: '1 minute' },
  { label: '5 分鐘', value: '5 minutes' },
  { label: '10 分鐘', value: '10 minutes' },
  { label: '1 小時', value: '1 hour' },
]

const CARD_LAYOUT = [
  { key: 'cpu', title: 'CPU 使用率 (%)', color: '#1677ff', unit: '%' },
  { key: 'memory', title: '記憶體使用率 (%)', color: '#36cfc9', unit: '%' },
  { key: 'disk', title: '磁碟使用率 (%)', color: '#9254de', unit: '%' },
  { key: 'response', title: '響應時間 (ms)', color: '#f759ab', unit: 'ms' },
  { key: 'indexing', title: '索引並發數', color: '#faad14', unit: '個' },
  { key: 'search', title: '搜尋並發數', color: '#5cdbd3', unit: '個' },
  { key: 'activeShards', title: 'Active Shards', color: '#ffa940' },
  { key: 'unassignedShards', title: 'Unassigned Shards', color: '#ff7875' },
]

type MetricSeries = Record<(typeof CARD_LAYOUT)[number]['key'], MetricSummary>

function Sparkline({
  points,
  color = '#1677ff',
  unit,
  label,
}: {
  points: MetricPoint[]
  color?: string
  unit?: string
  label?: string
}) {
  const { isDark } = useThemeMode()

  if (!points || points.length === 0) {
    return <Typography.Text type="secondary">暫無資料</Typography.Text>
  }

  const data = points
    .sort((a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf())
    .map((p) => ({
      time: dayjs(p.time).format('YYYY-MM-DD HH:mm'),
      value: p.value,
    }))

  return (
    <ResponsiveContainer width="100%" height={42}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis dataKey="time" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
          }}
          labelStyle={{
            color: isDark ? 'rgba(255, 255, 255, 0.65)' : '#999',
            fontSize: '12px',
            marginBottom: '4px',
          }}
          itemStyle={{
            color: isDark ? '#fff' : '#000',
            fontWeight: 500,
            fontSize: '14px',
          }}
          formatter={(value: number) => {
            if (!unit) return value.toFixed(2)
            return unit === '%' ? `${value.toFixed(1)}${unit}` : `${value.toFixed(2)} ${unit}`
          }}
          labelFormatter={(label) => label}
        />
        <Line
          type="monotone"
          dataKey="value"
          name={label || '值'}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function average(points: { value: number }[], precision = 1): string {
  if (!points.length) return '-'
  const sum = points.reduce((acc, item) => acc + item.value, 0)
  const avg = sum / points.length
  return avg.toFixed(precision)
}

export default function EsHistory() {
  const [monitors, setMonitors] = useState<ESMonitor[]>([])
  const [selectedMonitorId, setSelectedMonitorId] = useState<number | undefined>(undefined)
  const [hours, setHours] = useState<number>(24)
  const [interval, setInterval] = useState<string | undefined>(undefined)
  const [history, setHistory] = useState<ESMonitorHistory | null>(null)
  const [loading, setLoading] = useState(false)
  const [msgApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const list = await listEsMonitors()
        setMonitors(list)
        if (list.length) {
          setSelectedMonitorId(list[0].id)
        }
      } catch (error: any) {
        msgApi.error(error?.message || '載入監控列表失敗')
      }
    }
    bootstrap()
  }, [msgApi])

  const loadHistory = useCallback(
    async (monitorId: number, hrs: number, selectedInterval?: string) => {
      setLoading(true)
      try {
        const params = {
          hours: hrs,
          interval: selectedInterval && selectedInterval !== 'auto' ? selectedInterval : undefined,
        }
        const result = await getEsMonitorHistory(monitorId, params)
        const sorted = [...(result.data ?? [])].sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf())
        result.data = sorted
        setHistory(result)
      } catch (error: any) {
        msgApi.error(error?.message || '載入歷史資料失敗')
      } finally {
        setLoading(false)
      }
    },
    [msgApi]
  )

  useEffect(() => {
    if (selectedMonitorId) {
      loadHistory(selectedMonitorId, hours, interval)
    }
  }, [selectedMonitorId, hours, interval, loadHistory])

  const metrics = useMemo<MetricSeries>(() => {
    const rows = history?.data ?? []
    const pick = (selector: (row: ESMetricTimeSeries) => number | undefined) =>
      rows
        .map((row) => {
          const value = selector(row)
          if (typeof value !== 'number' || !Number.isFinite(value)) return null
          return { time: row.time, value }
        })
        .filter((item): item is { time: string; value: number } => !!item)

    return {
      cpu: { points: pick((row) => row.cpu_usage), unit: '%', color: '#1677ff' },
      memory: { points: pick((row) => row.memory_usage), unit: '%', color: '#36cfc9' },
      disk: { points: pick((row) => row.disk_usage), unit: '%', color: '#9254de' },
      response: { points: pick((row) => row.response_time), unit: 'ms', color: '#f759ab' },
      indexing: { points: pick((row) => row.indexing_rate), unit: '個', color: '#faad14' },
      search: { points: pick((row) => row.search_rate), unit: '個', color: '#5cdbd3' },
      activeShards: { points: pick((row) => row.active_shards), color: '#ffa940' },
      unassignedShards: { points: pick((row) => row.unassigned_shards), color: '#ff7875' },
    }
  }, [history])

  const columns = useMemo<TableProps<ESMetricTimeSeries>['columns']>(
    () => [
      {
        title: '時間',
        dataIndex: 'time',
        width: 200,
        render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
        sorter: (a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf(),
      },
      { title: 'CPU (%)', dataIndex: 'cpu_usage', width: 110, align: 'right' },
      { title: '記憶體 (%)', dataIndex: 'memory_usage', width: 110, align: 'right' },
      { title: '磁碟 (%)', dataIndex: 'disk_usage', width: 110, align: 'right' },
      { title: '響應時間 (ms)', dataIndex: 'response_time', width: 140, align: 'right' },
      { title: '索引並發數', dataIndex: 'indexing_rate', width: 120, align: 'right' },
      { title: '搜尋並發數', dataIndex: 'search_rate', width: 120, align: 'right' },
      { title: 'Active Shards', dataIndex: 'active_shards', width: 130, align: 'right' },
      { title: 'Unassigned Shards', dataIndex: 'unassigned_shards', width: 160, align: 'right' },
    ],
    []
  )

  const monitorOptions = useMemo(
    () =>
      monitors.map((monitor) => ({
        value: monitor.id,
        label: monitor.name || (monitor.es_connection ? `${monitor.es_connection.host}:${monitor.es_connection.port}` : `ID: ${monitor.id}`),
      })),
    [monitors]
  )

  const timespanText = useMemo(() => {
    if (!history) return '-'
    return `${dayjs(history.start_time).format('YYYY-MM-DD HH:mm')} ~ ${dayjs(history.end_time).format('YYYY-MM-DD HH:mm')}（${history.interval}）`
  }, [history])

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      {contextHolder}
      <PageHeader
        title="Elasticsearch 歷史視覺化"
        extra={
          <Button
            onClick={() => {
              if (selectedMonitorId) {
                loadHistory(selectedMonitorId, hours, interval)
              }
            }}
            loading={loading}
          >
            重新整理
          </Button>
        }
      />

      <Card size="small">
        <Space wrap>
          <Select
            placeholder="選擇監控器"
            options={monitorOptions}
            value={selectedMonitorId}
            style={{ width: 280 }}
            onChange={(value) => setSelectedMonitorId(value)}
            showSearch
            optionFilterProp="label"
          />
          <Segmented options={HOURS_OPTIONS} value={hours} onChange={(value) => setHours(Number(value))} />
            <Select
              value={interval ?? 'auto'}
              style={{ width: 160 }}
              options={INTERVAL_OPTIONS}
              onChange={(value) => setInterval(value === 'auto' ? undefined : value)}
            />
          <Typography.Text type="secondary">資料區間：{timespanText}</Typography.Text>
        </Space>
      </Card>

      {!selectedMonitorId ? (
        <Card>
          <Empty description="請先選擇監控器" />
        </Card>
      ) : (
        <>
          <Spin spinning={loading}>
            <Row gutter={[12, 12]}>
              {CARD_LAYOUT.map((config) => {
                const summary = metrics[config.key as keyof MetricSeries]
                const avgText = summary ? average(summary.points, config.unit === '%' ? 1 : 2) : '-'
                return (
                  <Col xs={24} sm={12} lg={6} key={config.key}>
                    <Card size="small" title={config.title}>
                      <Sparkline
                        points={summary.points}
                        color={config.color}
                        unit={config.unit}
                        label={config.title}
                      />
                      <Typography.Text type="secondary">
                        平均值：{avgText}
                        {avgText !== '-' && config.unit ? ` ${config.unit}` : ''}
                      </Typography.Text>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Spin>

          <Card>
            <Table<ESMetricTimeSeries>
              rowKey={(record) => record.time}
              columns={columns}
              dataSource={history?.data ?? []}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </>
      )}
    </Space>
  )
}
