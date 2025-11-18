import { Button, Card, Form, Input, Modal, Popconfirm, Space, Typography, message, Table, Pagination, AutoComplete, Tag, theme } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createDevices, deleteDevice, getAllDevices, getDeviceGroups, updateDevice, getDeviceCounts, type Device, type DeviceCount } from '@/api/devices'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import useAutoPageSize from '@/hooks/useAutoPageSize'
import PageHeader from '@/components/PageHeader'
import BulkBar from '@/components/BulkBar'
import { useThemeMode } from '@/theme/ThemeContext'

type Query = { keyword: string; group?: string }

export default function Devices() {
  const { token } = theme.useToken()
  const { isDark } = useThemeMode()
  const [data, setData] = useState<Device[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [counts, setCounts] = useState<DeviceCount[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<Query>({ keyword: '', group: undefined })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Device | null>(null)
  const [form] = Form.useForm<Device>()
  const [msgApi, contextHolder] = message.useMessage()
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  // 右側表格區塊使用分頁，依容器高度自動計算每頁列數（不截斷表格）
  const { ref: tableWrapRef, pageSize } = useAutoPageSize({ rowHeight: 48, headerHeight: 56, paginationHeight: 56, bottomPadding: 6, min: 4, max: 100 })
  // 群組卡片分頁（固定上方區塊高度，不出現滾動條）
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [gridCols, setGridCols] = useState(1)
  const [gridRows, setGridRows] = useState(1)
  const [groupPage, setGroupPage] = useState(1)

  const debouncedKw = useDebouncedValue(query.keyword, 300)
  const filtered = useMemo(() => {
    const kw = debouncedKw.trim().toLowerCase()
    return data
      .filter((d) => (query.group ? d.device_group === query.group : true))
      .filter((d) => (kw ? d.name.toLowerCase().includes(kw) || d.device_group.toLowerCase().includes(kw) : true))
  }, [data, query.group, debouncedKw])

  const load = async () => {
    setLoading(true)
    try {
      const [devices, groupObjs, countsData] = await Promise.all([getAllDevices(), getDeviceGroups(), getDeviceCounts()])
      setData(devices)
      setGroups(groupObjs.map((g) => g.device_group))
      setCounts(countsData)
    } catch (e: any) {
      msgApi.error(e?.message || '載入設備失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 動態計算群組卡片能容納的欄與列數，避免垂直截斷
  useEffect(() => {
    const MIN_CARD_WIDTH = 150
    const APPROX_ROW_HEIGHT = 110// 卡片含間距的大致高度
    const calc = () => {
      const el = gridRef.current
      if (!el) return
      const width = el.clientWidth
      const height = el.clientHeight
      const cols = Math.max(1, Math.floor(width / MIN_CARD_WIDTH))
      const rows = Math.max(1, Math.floor(height / APPROX_ROW_HEIGHT))
      setGridCols(cols)
      setGridRows(rows)
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (gridRef.current) ro.observe(gridRef.current)
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [])

  const cardsPerPage = Math.max(1, gridCols * gridRows)
  const totalCardPages = Math.max(1, Math.ceil(counts.length / cardsPerPage))
  useEffect(() => {
    if (groupPage > totalCardPages) setGroupPage(totalCardPages)
  }, [groupPage, totalCardPages])
  const visibleCounts = useMemo(() => {
    const start = (groupPage - 1) * cardsPerPage
    return counts.slice(start, start + cardsPerPage)
  }, [counts, groupPage, cardsPerPage])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: Device) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing?.id) {
        await updateDevice({ id: editing.id, ...values })
        msgApi.success('更新成功')
      } else {
        await createDevices([{ ...values }])
        msgApi.success('新增成功')
      }
      setModalOpen(false)
      load()
    } catch (e: any) {
      if (e?.errorFields) return // 表單驗證錯誤
      msgApi.error(e?.message || '操作失敗')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteDevice(id)
      msgApi.success('刪除成功')
      load()
    } catch (e: any) {
      msgApi.error(e?.message || '刪除失敗')
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {contextHolder}
      <PageHeader
        title="設備列表"
        // subtitle={
        //   query.group ? (
        //     <Space size={8}>
        //       <span>目前篩選</span>
        //       <Tag color="processing">{query.group}</Tag>
        //       <Button size="small" onClick={() => setQuery((q) => ({ ...q, group: undefined }))}>清除</Button>
        //     </Space>
        //   ) : (
        //     <span>群組篩選與批量操作</span>
        //   )
        // }
        extra={
          <Space>
            <Input.Search
              allowClear
              placeholder="搜尋名稱或群組"
              onChange={(e) => setQuery((q) => ({ ...q, keyword: e.target.value }))}
              style={{ width: 260 }}
            />
            <Button type="primary" onClick={openCreate}>
              新增設備
            </Button>
          </Space>
        }
      />

      {/* 主要內容：上 1/3 群組卡片；下 2/3 設備清單。高度隨螢幕自適應，內部滾動 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 上方：群組卡片（可滾動） */}
        <div style={{ flex: '0 0 33%', minHeight: 180, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Typography.Text type="secondary">群組統計（點擊篩選，再點取消）</Typography.Text>
            {totalCardPages > 1 && (
              <Pagination
                simple
                size="small"
                current={groupPage}
                total={counts.length}
                pageSize={cardsPerPage}
                onChange={(p) => setGroupPage(p)}
              />
            )}
          </div>
          <div
            style={{
              flex: 1,
              // 自適應等分網格：每張卡片最小寬度 150px；容器窄於 150px 時自動降到 100% 避免水平截斷
              display: 'grid',
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              gridAutoRows: '1fr',
              gap: 12,
              boxSizing: 'border-box',
              gridAutoFlow: 'dense'
            }}
            ref={gridRef}
          >
            {visibleCounts.map((c) => {
              const active = query.group === c.device_group
              return (
                <Card
                  key={c.device_group}
                  hoverable
                  onClick={() => setQuery((q) => ({ ...q, group: active ? undefined : c.device_group }))}
                  style={{
                    cursor: 'pointer',
                    borderColor: active ? token.colorPrimary : undefined,
                    transition: 'border-color 0.2s',
                    background: isDark ? '#304547' : '#F1FAFA'
                  }}
                >
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    {/* <Typography.Text type="secondary">設備群組</Typography.Text> */}
                    <Typography.Title level={5} style={{ margin: 0, overflowWrap: 'anywhere' }}>
                      {c.device_group}
                    </Typography.Title>
                    <Typography.Text>數量：{c.devices_count}</Typography.Text>
                  </Space>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 下方：設備清單表格（分頁，依容器高度自動計算每頁列數） */}
        <div style={{ flex: '1 1 67%', overflow: 'hidden' }}>
          <div ref={tableWrapRef} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <BulkBar
              count={selectedKeys.length}
              loading={bulkLoading}
              onClear={() => setSelectedKeys([])}
              onDelete={async () => {
                if (!selectedKeys.length) return
                setBulkLoading(true)
                try {
                  const ids = selectedKeys
                    .map((k) => Number(k))
                    .filter((n) => Number.isFinite(n))
                  const results = await Promise.allSettled(ids.map((id) => deleteDevice(id)))
                  const ok = results.filter((r) => r.status === 'fulfilled').length
                  const fail = results.length - ok
                  if (ok) msgApi.success(`已刪除 ${ok} 筆`)
                  if (fail) msgApi.error(`有 ${fail} 筆刪除失敗`)
                  setSelectedKeys([])
                  load()
                } finally {
                  setBulkLoading(false)
                }
              }}
            />
            <Table<Device>
              rowKey={(r) => String(r.id ?? `${r.device_group}-${r.name}`)}
              loading={loading}
              dataSource={filtered}
              size="middle"
              pagination={{ pageSize, showSizeChanger: false }}
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: (keys) => setSelectedKeys(keys),
                getCheckboxProps: (record) => ({ disabled: !record.id }),
                preserveSelectedRowKeys: true
              }}
              columns={[
                { title: '設備名稱', dataIndex: 'name' },
                { title: '群組', dataIndex: 'device_group', width: 180 },
                {
                  title: '操作',
                  width: 180,
                  render: (_, record) => (
                    <Space>
                      <Button size="small" onClick={() => openEdit(record)}>
                        編輯
                      </Button>
                      <Popconfirm title="確認刪除？" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger>
                          刪除
                        </Button>
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>

      <Modal
        title={editing ? '編輯設備' : '新增設備'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form<Device> form={form} layout="vertical" initialValues={{ device_group: undefined, name: '' }}>
          <Form.Item label="群組" name="device_group" rules={[{ required: true, message: '請選擇或輸入群組' }]}>
            <AutoComplete
              placeholder="選擇既有群組或直接輸入新群組"
              options={groups.map((g) => ({ value: g }))}
              filterOption={(inputValue, option) => (option?.value ?? '').toString().toLowerCase().includes(inputValue.toLowerCase())}
              open={groupDropdownOpen}
              onFocus={() => setGroupDropdownOpen(true)}
              onBlur={() => setGroupDropdownOpen(false)}
            />
          </Form.Item>
          <Form.Item label="名稱" name="name" rules={[{ required: true, message: '請輸入名稱' }]}>
            <Input placeholder="例如：FW-001" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
