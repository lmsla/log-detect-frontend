import { Card, Col, Empty, Input, Row, Space, Table, Tag, Typography, message, Button, Select, Switch } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getEsStatistics, getEsStatus, type ESMonitorStatus, type ESStatistics } from '@/api/es'
import PageHeader from '@/components/PageHeader'
import useInterval from '@/hooks/useInterval'

function StatusTag({ value }: { value?: string }) {
  const v = (value || '').toLowerCase()
  const color = v === 'online' ? 'green' : v === 'warning' ? 'gold' : v === 'error' ? 'red' : v === 'offline' ? 'red' : 'default'
  const text = v ? v.toUpperCase() : '-'
  return <Tag color={color}>{text}</Tag>
}

function ClusterTag({ value }: { value?: string }) {
  const v = (value || '').toLowerCase()
  const color = v === 'green' ? 'green' : v === 'yellow' ? 'gold' : v === 'red' ? 'red' : 'default'
  return <Tag color={color}>{value || '-'}</Tag>
}

export default function EsOverview() {
  const [stats, setStats] = useState<ESStatistics | null>(null)
  const [list, setList] = useState<ESMonitorStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [msgApi, contextHolder] = message.useMessage()
  const [auto, setAuto] = useState(true)
  const [intervalMs, setIntervalMs] = useState(30000)

  const load = async () => {
    setLoading(true)
    try {
      const [s, l] = await Promise.all([getEsStatistics(), getEsStatus()])
      setStats(s)
      setList(l)
    } catch (e: any) {
      msgApi.error(e?.message || '讀取 ES 總覽失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useInterval(() => { if (auto) load() }, auto ? intervalMs : null)

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return list.filter((it) => {
      const byKw = kw ? (it.monitor_name?.toLowerCase().includes(kw) || it.host?.toLowerCase().includes(kw)) : true
      const byStatus = status ? (it.status?.toLowerCase() === status) : true
      return byKw && byStatus
    })
  }, [list, q, status])

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      {contextHolder}
      <PageHeader
        title="Elasticsearch 總覽"
        extra={
          <Space>
            <Input allowClear placeholder="搜尋叢集/主機" style={{ width: 260 }} onChange={(e) => setQ(e.target.value)} />
            <Select
              allowClear
              placeholder="狀態"
              style={{ width: 140 }}
              value={status}
              onChange={(v) => setStatus(v)}
              options={[
                { label: 'ONLINE', value: 'online' },
                { label: 'WARNING', value: 'warning' },
                { label: 'ERROR', value: 'error' },
                { label: 'OFFLINE', value: 'offline' }
              ]}
            />
            <Space>
              <Switch checked={auto} onChange={setAuto} />
              <Select
                value={intervalMs}
                style={{ width: 120 }}
                onChange={setIntervalMs}
                options={[
                  { label: '15s', value: 15000 },
                  { label: '30s', value: 30000 },
                  { label: '60s', value: 60000 }
                ]}
              />
            </Space>
            <Button onClick={load} loading={loading}>刷新</Button>
          </Space>
        }
      />

      {/* 概覽卡片 */}
      <Row gutter={[12, 12]}>
        <Col xs={12} md={6}>
          <Card loading={loading}>
            <Typography.Text type="secondary">監控總數</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>{stats?.total_monitors ?? '-'}</Typography.Title>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card loading={loading}>
            <Typography.Text type="secondary">在線</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>{stats?.online_monitors ?? '-'}</Typography.Title>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card loading={loading}>
            <Typography.Text type="secondary">離線</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>{stats?.offline_monitors ?? '-'}</Typography.Title>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card loading={loading}>
            <Typography.Text type="secondary">平均 RT (ms)</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>{stats?.avg_response_time ?? '-'}</Typography.Title>
          </Card>
        </Col>
      </Row>

      {/* 清單表 */}
      <Table<ESMonitorStatus>
        rowKey={(r) => String(r.monitor_id)}
        dataSource={filtered}
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        columns={[
          { title: '名稱', dataIndex: 'monitor_name' },
          { title: 'Host', dataIndex: 'host' },
          { title: '狀態', dataIndex: 'status', render: (v) => <StatusTag value={v} /> },
          { title: 'Cluster', dataIndex: 'cluster_name' },
          { title: '健康', dataIndex: 'cluster_status', render: (v) => <ClusterTag value={v} /> },
          { title: 'RT(ms)', dataIndex: 'response_time', width: 100 },
          { title: 'CPU(%)', dataIndex: 'cpu_usage', width: 100 },
          { title: 'Mem(%)', dataIndex: 'memory_usage', width: 100 },
          { title: 'Disk(%)', dataIndex: 'disk_usage', width: 100 },
          { title: 'Nodes', dataIndex: 'node_count', width: 90 },
          { title: 'Active Shards', dataIndex: 'active_shards', width: 120 },
          { title: 'Unassigned Shards', dataIndex: 'unassigned_shards', width: 120 }
        ]}
        locale={{ emptyText: <Empty description="尚無監控資料" /> }}
      />
    </Space>
  )
}
