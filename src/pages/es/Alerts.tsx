import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
  type TableProps,
} from 'antd'
import dayjs from 'dayjs'
import PageHeader from '@/components/PageHeader'
import {
  acknowledgeEsAlert,
  listEsAlerts,
  listEsMonitors,
  resolveEsAlert,
  type ESAlert,
  type ESAlertListResult,
  type ESMonitor,
} from '@/api/es'

type AlertFilters = {
  status: string[]
  severity: string[]
  alertTypes: string[]
  monitorId?: number
  hours: number
}

type AlertActionModalState = {
  type: 'acknowledge' | 'resolve'
  alert: ESAlert
} | null

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
]

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const ALERT_TYPE_OPTIONS = [
  { value: 'health', label: 'Health' },
  { value: 'performance', label: 'Performance' },
  { value: 'capacity', label: 'Capacity' },
  { value: 'availability', label: 'Availability' },
]

const HOURS_OPTIONS = [
  { label: '6 小時', value: 6 },
  { label: '24 小時', value: 24 },
  { label: '72 小時', value: 72 },
  { label: '7 天', value: 168 },
]

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'magenta',
  high: 'volcano',
  medium: 'orange',
  low: 'blue',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'red',
  acknowledged: 'gold',
  resolved: 'green',
}

const ALERT_TYPE_COLORS: Record<string, string> = {
  health: 'green',
  performance: 'blue',
  capacity: 'purple',
  availability: 'geekblue',
}

const INITIAL_FILTERS: AlertFilters = {
  status: [],
  severity: [],
  alertTypes: [],
  monitorId: undefined,
  hours: 24,
}

const INITIAL_PAGINATION = {
  page: 1,
  pageSize: 20,
  total: 0,
}

export default function EsAlerts() {
  const [filters, setFilters] = useState<AlertFilters>(INITIAL_FILTERS)
  const [alerts, setAlerts] = useState<ESAlert[]>([])
  const [monitors, setMonitors] = useState<ESMonitor[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(INITIAL_PAGINATION)
  const [actionModal, setActionModal] = useState<AlertActionModalState>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionForm] = Form.useForm()
  const [msgApi, contextHolder] = message.useMessage()

  const loadAlerts = useCallback(
    async (page: number, pageSize: number, filtersOverride?: AlertFilters) => {
      const effectiveFilters = filtersOverride ?? filters
      const now = new Date()
      const endTime = now.toISOString()
      const startTime = new Date(now.getTime() - effectiveFilters.hours * 3600 * 1000).toISOString()

      const params = {
        page,
        page_size: pageSize,
        monitor_id: effectiveFilters.monitorId,
        status: effectiveFilters.status.length ? effectiveFilters.status : undefined,
        severity: effectiveFilters.severity.length ? effectiveFilters.severity : undefined,
        alert_type: effectiveFilters.alertTypes.length ? effectiveFilters.alertTypes : undefined,
        start_time: startTime,
        end_time: endTime,
      }

      setLoading(true)
      try {
        const { items, pagination: serverPagination }: ESAlertListResult = await listEsAlerts(params)
        setAlerts(items)
        setPagination((prev) => {
          const next = {
            page: serverPagination.page,
            pageSize: serverPagination.pageSize,
            total: serverPagination.total,
          }
          return prev.page === next.page && prev.pageSize === next.pageSize && prev.total === next.total ? prev : next
        })
      } catch (error: any) {
        msgApi.error(error?.message || '載入告警失敗')
      } finally {
        setLoading(false)
      }
    },
    [filters, msgApi]
  )

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const list = await listEsMonitors()
        setMonitors(list)
      } catch (error: any) {
        msgApi.error(error?.message || '載入監控列表失敗')
      }
    }
    bootstrap()
  }, [msgApi])

  useEffect(() => {
    loadAlerts(pagination.page, pagination.pageSize)
  }, [loadAlerts, pagination.page, pagination.pageSize])

  const updateFilters = (payload: Partial<AlertFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...payload }
      setPagination((p) => (p.page === 1 ? p : { ...p, page: 1 }))
      return next
    })
  }

  const handleTableChange: TableProps<ESAlert>['onChange'] = (pager) => {
    const nextPage = pager.current ?? 1
    const nextPageSize = pager.pageSize ?? pagination.pageSize
    setPagination((prev) => {
      if (prev.page === nextPage && prev.pageSize === nextPageSize) return prev
      return { ...prev, page: nextPage, pageSize: nextPageSize }
    })
  }

  const openActionModal = (type: 'acknowledge' | 'resolve', alert: ESAlert) => {
    setActionModal({ type, alert })
    actionForm.resetFields()
  }

  const closeActionModal = () => {
    setActionModal(null)
    actionForm.resetFields()
  }

  const submitActionModal = async () => {
    if (!actionModal) return
    try {
      const values = await actionForm.validateFields()
      setActionLoading(true)
      if (actionModal.type === 'resolve') {
        await resolveEsAlert(actionModal.alert.monitor_id, actionModal.alert.time, values.resolution_note, values.resolved_by)
        msgApi.success('已標記為已解決')
      } else {
        await acknowledgeEsAlert(actionModal.alert.monitor_id, actionModal.alert.time, values.acknowledged_by)
        msgApi.success('已標記為已確認')
      }
      closeActionModal()
      await loadAlerts(pagination.page, pagination.pageSize)
    } catch (error: any) {
      if (error?.errorFields) return
      msgApi.error(error?.message || '操作失敗')
    } finally {
      setActionLoading(false)
    }
  }

  const summary = useMemo(() => {
    const statusCounts: Record<string, number> = {}
    const severityCounts: Record<string, number> = {}
    alerts.forEach((alert) => {
      statusCounts[alert.status] = (statusCounts[alert.status] || 0) + 1
      severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1
    })
    return { statusCounts, severityCounts }
  }, [alerts])

  const columns = useMemo<TableProps<ESAlert>['columns']>(() => {
    return [
      {
        title: '時間',
        dataIndex: 'time',
        width: 200,
        render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf(),
      },
      {
        title: '監控器',
        dataIndex: 'monitor_name',
        ellipsis: true,
        render: (value: string, record) => value || `#${record.monitor_id}`,
      },
      {
        title: '嚴重性',
        dataIndex: 'severity',
        width: 120,
        render: (value: string) => <Tag color={SEVERITY_COLORS[value] || 'default'}>{value?.toUpperCase?.() ?? value}</Tag>,
      },
      {
        title: '類型',
        dataIndex: 'alert_type',
        width: 140,
        render: (value: string) => <Tag color={ALERT_TYPE_COLORS[value] || 'default'}>{value?.toUpperCase?.() ?? value}</Tag>,
      },
      {
        title: '狀態',
        dataIndex: 'status',
        width: 140,
        render: (value: string) => <Tag color={STATUS_COLORS[value] || 'default'}>{value?.toUpperCase?.() ?? value}</Tag>,
      },
      {
        title: '內容',
        dataIndex: 'message',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width: 220,
        fixed: 'right',
        render: (_, record) => {
          const isActive = record.status === 'active'
          const isAcknowledged = record.status === 'acknowledged'
          return (
            <Space>
              <Button size="small" onClick={() => openActionModal('acknowledge', record)} disabled={!isActive}>
                確認
              </Button>
              <Button size="small" type="primary" onClick={() => openActionModal('resolve', record)} disabled={record.status === 'resolved'}>
                標記已解決
              </Button>
            </Space>
          )
        },
      },
    ]
  }, [])

  const monitorOptions = useMemo(
    () =>
      monitors.map((monitor) => ({
        value: monitor.id,
        label: monitor.name || `${monitor.host}:${monitor.port}`,
      })),
    [monitors]
  )

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      {contextHolder}
      <PageHeader
        title="Elasticsearch 告警管理"
        extra={
          <Button onClick={() => loadAlerts(pagination.page, pagination.pageSize)} loading={loading}>
            重新整理
          </Button>
        }
      />

      <Card size="small">
        <Space wrap>
          <Select
            mode="multiple"
            allowClear
            placeholder="狀態"
            value={filters.status}
            options={STATUS_OPTIONS}
            style={{ width: 200 }}
            onChange={(value) => updateFilters({ status: value })}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="嚴重性"
            value={filters.severity}
            options={SEVERITY_OPTIONS}
            style={{ width: 220 }}
            onChange={(value) => updateFilters({ severity: value })}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="告警類型"
            value={filters.alertTypes}
            options={ALERT_TYPE_OPTIONS}
            style={{ width: 240 }}
            onChange={(value) => updateFilters({ alertTypes: value })}
          />
          <Select
            allowClear
            placeholder="監控器"
            value={filters.monitorId}
            options={monitorOptions}
            style={{ width: 260 }}
            onChange={(value) => updateFilters({ monitorId: value })}
            showSearch
            optionFilterProp="label"
          />
          <Segmented
            options={HOURS_OPTIONS}
            value={filters.hours}
            onChange={(value) => updateFilters({ hours: Number(value) })}
          />
        </Space>
      </Card>

      <Row gutter={[12, 12]}>
        {STATUS_OPTIONS.map((option) => (
          <Col xs={12} md={6} key={option.value}>
            <Card size="small">
              <Statistic
                title={`${option.label} 數量`}
                value={summary.statusCounts[option.value] ?? 0}
                valueStyle={{ color: STATUS_COLORS[option.value] || undefined }}
              />
            </Card>
          </Col>
        ))}
        {SEVERITY_OPTIONS.map((option) => (
          <Col xs={12} md={6} key={`severity-${option.value}`}>
            <Card size="small">
              <Statistic
                title={`${option.label} 告警`}
                value={summary.severityCounts[option.value] ?? 0}
                valueStyle={{ color: SEVERITY_COLORS[option.value] || undefined }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Table<ESAlert>
          rowKey={(record) => `${record.monitor_id}-${record.time}`}
          columns={columns}
          dataSource={alerts}
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={actionModal?.type === 'resolve' ? '標記為已解決' : '確認告警'}
        open={!!actionModal}
        onCancel={closeActionModal}
        onOk={submitActionModal}
        okText="送出"
        confirmLoading={actionLoading}
        destroyOnClose
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {actionModal?.alert?.message}
        </Typography.Paragraph>
        <Form form={actionForm} layout="vertical">
          {actionModal?.type === 'resolve' ? (
            <>
              <Form.Item label="處理說明" name="resolution_note">
                <Input.TextArea rows={3} placeholder="可選，記錄處理方式" />
              </Form.Item>
              <Form.Item label="處理人" name="resolved_by">
                <Input placeholder="預設為當前登入者，可視需要覆寫" />
              </Form.Item>
            </>
          ) : (
            <Form.Item label="確認人" name="acknowledged_by">
              <Input placeholder="預設為當前登入者，可視需要覆寫" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Space>
  )
}
