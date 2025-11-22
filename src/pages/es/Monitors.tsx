import { Button, Drawer, Form, Input, InputNumber, Modal, Popconfirm, Result, Select, Space, Switch, Table, Tag, Typography, message, Row, Col, Segmented, Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import {
  listEsMonitors,
  createEsMonitor,
  updateEsMonitor,
  deleteEsMonitor,
  toggleEsMonitor,
  type ESMonitor
} from '@/api/es'
import { getAllESConnections, type ESConnectionSummary } from '@/api/esConnection'
import PageHeader from '@/components/PageHeader'
import { MailOutlined } from '@ant-design/icons'

export default function EsMonitors() {
  const [data, setData] = useState<ESMonitor[]>([])
  const [esConnections, setEsConnections] = useState<ESConnectionSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [forbidden, setForbidden] = useState(false)
  const [editing, setEditing] = useState<ESMonitor | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [q, setQ] = useState('')
  const [form] = Form.useForm<ESMonitor & { check_types?: string[] }>()
  const [notifForm] = Form.useForm()
  const [msgApi, contextHolder] = message.useMessage()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifTarget, setNotifTarget] = useState<ESMonitor | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [list, connections] = await Promise.all([listEsMonitors(), getAllESConnections()])
      setData(list || [])
      setEsConnections(connections || [])
      setForbidden(false)
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setForbidden(true)
      } else {
        msgApi.error(e?.message || '讀取監控配置失敗')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return data.filter((m) => kw ? (m.name?.toLowerCase().includes(kw) || m.es_connection?.name?.toLowerCase().includes(kw)) : true)
  }, [data, q])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    notifForm.setFieldsValue({ receivers: [], subject: '', description: '' })
    setDrawerOpen(true)
  }

  const openEdit = (record: ESMonitor) => {
    setEditing(record)
    form.setFieldsValue({
      ...record,
      receivers: record.receivers || [],
      // 將逗號分隔的 check_type 轉為多選陣列
      check_types: (record.check_type || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    notifForm.setFieldsValue({
      receivers: record.receivers || [],
      subject: record.subject || '',
      description: record.description || ''
    })
    setDrawerOpen(true)
  }

  const submit = async () => {
    try {
      const values = await form.validateFields()
      const { check_types, ...rest } = values as any
      const notif = notifForm.getFieldsValue(true)
      const body: ESMonitor = { ...rest, ...notif, check_type: Array.isArray(check_types) ? check_types.join(',') : rest.check_type }
      if (editing?.id) {
        body.id = editing.id
        await updateEsMonitor(body)
        msgApi.success('已更新')
      } else {
        await createEsMonitor(body)
        msgApi.success('已建立')
      }
      setDrawerOpen(false)
      load()
    } catch (e: any) {
      if (e?.errorFields) return
      msgApi.error(e?.message || '操作失敗')
    }
  }

  // 閾值模板快速套用
  const applyTemplate = (tpl: 'loose' | 'standard' | 'strict') => {
    const templates = {
      loose: {
        cpu_usage_high: 85.0, cpu_usage_critical: 95.0,
        memory_usage_high: 85.0, memory_usage_critical: 95.0,
        disk_usage_high: 90.0, disk_usage_critical: 98.0,
        response_time_high: 5000, response_time_critical: 15000,
        unassigned_shards_threshold: 5,
      },
      standard: {
        cpu_usage_high: 75.0, cpu_usage_critical: 85.0,
        memory_usage_high: 80.0, memory_usage_critical: 90.0,
        disk_usage_high: 85.0, disk_usage_critical: 95.0,
        response_time_high: 3000, response_time_critical: 10000,
        unassigned_shards_threshold: 1,
      },
      strict: {
        cpu_usage_high: 60.0, cpu_usage_critical: 70.0,
        memory_usage_high: 70.0, memory_usage_critical: 80.0,
        disk_usage_high: 75.0, disk_usage_critical: 85.0,
        response_time_high: 1000, response_time_critical: 3000,
        unassigned_shards_threshold: 0,
      }
    } as const
    form.setFieldsValue(templates[tpl])
  }

  // 根據 es_connection_id 取得連線名稱
  const getConnectionName = (id?: number) => {
    if (!id) return '-'
    const conn = esConnections.find(c => c.id === id)
    return conn?.name || `ID: ${id}`
  }

  // 根據 es_connection_id 取得連線 Host
  const getConnectionHost = (id?: number) => {
    if (!id) return '-'
    const conn = esConnections.find(c => c.id === id)
    if (!conn) return '-'
    return `${conn.host}:${conn.port}`
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      {contextHolder}
      <PageHeader
        title="Elasticsearch 監控配置"
        extra={
          <Space>
            <Input allowClear placeholder="搜尋名稱/連線" style={{ width: 260 }} onChange={(e) => setQ(e.target.value)} />
            <Button type="primary" onClick={openCreate}>新增監控</Button>
          </Space>
        }
      />

      {forbidden ? (
        <Result
          status="403"
          title="沒有權限"
          subTitle="你目前的帳號未被授予存取 Elasticsearch 監控配置的權限。請聯繫系統管理員開通 elasticsearch:read / elasticsearch:update 權限。"
          extra={<Button onClick={load}>重試</Button>}
        />
      ) : (

      <Table<ESMonitor>
        rowKey={(r) => String(r.id ?? Math.random())}
        loading={loading}
        dataSource={filtered}
        size="middle"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        columns={[
          { title: '名稱', dataIndex: 'name' },
          {
            title: 'ES 連線',
            dataIndex: 'es_connection_id',
            render: (id, r) => (
              <Tooltip title={getConnectionHost(id)}>
                <span>{r.es_connection?.name || getConnectionName(id)}</span>
              </Tooltip>
            )
          },
          { title: '間隔(秒)', dataIndex: 'interval', width: 100 },
          { title: '檢查', dataIndex: 'check_type', render: (v) => {
              const arr = (v || '').split(',').map((s: string) => s.trim()).filter(Boolean)
              const colorOf = (k: string) => k === 'health' ? 'green' : k === 'performance' ? 'blue' : 'purple'
              const labelOf = (k: string) => k.charAt(0).toUpperCase() + k.slice(1)
              return arr.length ? (
                <Space size={4} wrap>
                  {arr.map((k: string) => <Tag key={k} color={colorOf(k)}>{labelOf(k)}</Tag>)}
                </Space>
              ) : '-'
            }
          },
          { title: '啟用', dataIndex: 'enable_monitor', width: 80, render: (v) => v ? <Tag color="green">ON</Tag> : <Tag>OFF</Tag> },
          {
            title: '操作', width: 240,
            render: (_, r) => (
              <Space>
                <Tooltip title={(r.receivers || []).join(', ') || '未設定收件者'}>
                  <Button size="small" icon={<MailOutlined />} onClick={() => {
                    setNotifTarget(r)
                    notifForm.setFieldsValue({ receivers: r.receivers || [], subject: r.subject || '', description: r.description || '' })
                    setNotifOpen(true)
                  }}>
                    通知
                  </Button>
                </Tooltip>
                <Button size="small" onClick={() => openEdit(r)}>編輯</Button>
                <Popconfirm title={r.enable_monitor ? '確認停用？' : '確認啟用？'} onConfirm={async () => { await toggleEsMonitor(r.id!, !r.enable_monitor); msgApi.success('已更新狀態'); load() }}>
                  <Button size="small">{r.enable_monitor ? '停用' : '啟用'}</Button>
                </Popconfirm>
                <Popconfirm title="確認刪除？" onConfirm={async () => { await deleteEsMonitor(r.id!); msgApi.success('已刪除'); load() }}>
                  <Button size="small" danger>刪除</Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />

      )}

      <Drawer
        title={editing ? '編輯監控' : '新增監控'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={900}
        styles={{ body: { overflow: 'visible' } }}
        extra={<Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={submit}>儲存</Button></Space>}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            interval: 60,
            check_types: ['health'],
            // 標準模板（一般生產環境）
            cpu_usage_high: 75.0,
            cpu_usage_critical: 85.0,
            memory_usage_high: 80.0,
            memory_usage_critical: 90.0,
            disk_usage_high: 85.0,
            disk_usage_critical: 95.0,
            response_time_high: 3000,
            response_time_critical: 10000,
            unassigned_shards_threshold: 1
          }}
        >
          {/* 名稱 */}
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item label="名稱" name="name" rules={[{ required: true, message: '請輸入名稱' }]}>
                <Input placeholder="Production ES Monitor" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="ES 連線" name="es_connection_id" rules={[{ required: true, message: '請選擇 ES 連線' }]}>
                <Select
                  placeholder="選擇 ES 連線"
                  options={esConnections.map(c => ({
                    label: `${c.name} (${c.host}:${c.port})`,
                    value: c.id
                  }))}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 間隔 */}
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item label="檢查間隔(秒)" name="interval" rules={[{ required: true, type: 'number', min: 10, max: 3600 }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="檢查類型" name="check_types" tooltip="可複選">
                <Select
                  mode="multiple"
                  options={[
                    { label: 'Health', value: 'health' },
                    { label: 'Performance', value: 'performance' },
                    { label: 'Capacity', value: 'capacity' },
                  ]}
                  placeholder="選擇檢查類型"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 閾值區塊 */}
          <Row gutter={12}>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Typography.Text type="secondary">閾值設定</Typography.Text>
              <Space>
                <Button onClick={() => setNotifOpen(true)}>通知設定</Button>
                <Segmented
                  size="middle"
                  options={[
                    { label: '寬鬆', value: 'loose' },
                    { label: '標準', value: 'standard' },
                    { label: '嚴格', value: 'strict' },
                  ]}
                  onChange={(v) => applyTemplate(v as any)}
                />
              </Space>
            </Col>
            <Col span={8}>
              <Form.Item label="CPU High(%)" name="cpu_usage_high">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="CPU Critical(%)" name="cpu_usage_critical">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mem High(%)" name="memory_usage_high">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mem Critical(%)" name="memory_usage_critical">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Disk High(%)" name="disk_usage_high">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Disk Critical(%)" name="disk_usage_critical">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="RT High(ms)" name="response_time_high">
                <InputNumber min={0} step={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="RT Critical(ms)" name="response_time_critical">
                <InputNumber min={0} step={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Unassigned Shards 閾值" name="unassigned_shards_threshold">
                <InputNumber min={0} step={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      {/* 通知設定彈窗 */}
      <Modal
        title="通知設定"
        open={notifOpen}
        onCancel={() => setNotifOpen(false)}
        onOk={() => setNotifOpen(false)}
        okText="完成"
      >
        <Form form={notifForm} layout="vertical" initialValues={{ receivers: [], subject: '', description: '' }}>
          <Form.Item label="收件者" name="receivers">
            <Select mode="tags" tokenSeparators={[',',';',' ']} placeholder="輸入 email 後 Enter" />
          </Form.Item>
          <Form.Item label="Email 主旨" name="subject">
            <Input placeholder="ES Cluster Alert - Production" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
