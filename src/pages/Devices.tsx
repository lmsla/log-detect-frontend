import { Button, Card, Form, Input, Modal, Popconfirm, Space, Typography, message, Table, Pagination, AutoComplete, Tag, Switch, theme } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { createDevices, deleteDevice, getAllDevices, getDeviceGroups, updateDevice, getDeviceCounts, type Device } from '@/api/devices'
import { createDeviceGroup, getDeviceGroupsWithCount, updateDeviceGroup, deleteDeviceGroup, type DeviceGroupWithCount } from '@/api/deviceGroups'
import { http } from '@/api/http'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import useAutoPageSize from '@/hooks/useAutoPageSize'
import PageHeader from '@/components/PageHeader'
import BulkBar from '@/components/BulkBar'
import { useThemeMode } from '@/theme/ThemeContext'

type Query = { keyword: string; group?: string; haOnly: boolean }

export default function Devices() {
  const { token } = theme.useToken()
  const { isDark } = useThemeMode()
  const [data, setData] = useState<Device[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [groupStats, setGroupStats] = useState<DeviceGroupWithCount[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<Query>({ keyword: '', group: undefined, haOnly: false })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Device | null>(null)
  const [form] = Form.useForm<Device>()
  const [msgApi, contextHolder] = message.useMessage()
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<DeviceGroupWithCount | null>(null)
  const [groupForm] = Form.useForm<{ name: string; description?: string }>()
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [moveForm] = Form.useForm<{ target_group_name: string }>()
  const [moveLoading, setMoveLoading] = useState(false)
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
      .filter((d) => (query.haOnly ? !!d.ha_group : true))
      .filter((d) => (
        kw
          ? d.name.toLowerCase().includes(kw) ||
            d.device_group.toLowerCase().includes(kw) ||
            (d.ha_group || '').toLowerCase().includes(kw)
          : true
      ))
      .sort((a, b) => {
        const groupCmp = a.device_group.localeCompare(b.device_group)
        if (groupCmp !== 0) return groupCmp
        const aHa = a.ha_group || '\uffff'
        const bHa = b.ha_group || '\uffff'
        const haCmp = aHa.localeCompare(bHa)
        if (haCmp !== 0) return haCmp
        return a.name.localeCompare(b.name)
      })
  }, [data, query.group, query.haOnly, debouncedKw])

  const rowDecorations = useMemo(() => {
    const map = new Map<string, { isHA: boolean; isGroupStart: boolean }>()
    let prevHA: string | undefined
    filtered.forEach((item) => {
      const key = String(item.id ?? `${item.device_group}-${item.name}`)
      const currentHA = item.ha_group || undefined
      const isHA = !!currentHA
      const isGroupStart = isHA && currentHA !== prevHA
      map.set(key, { isHA, isGroupStart })
      prevHA = currentHA
    })
    return map
  }, [filtered])

  const load = async () => {
    setLoading(true)
    try {
      // 優先使用新群組端點，若失敗則回退舊端點
      const [devices, groupList] = await Promise.all([
        getAllDevices(),
        getDeviceGroupsWithCount().catch(async () => {
          const legacyGroups = await getDeviceGroups()
          const legacyCounts = await getDeviceCounts()
          return (legacyGroups || []).map((g) => ({
            device_group: (g as any).device_group,
            device_count: (legacyCounts || []).find((c) => c.device_group === (g as any).device_group)?.devices_count ?? 0
          })) as DeviceGroupWithCount[]
        })
      ])
      setData(devices || [])
      setGroups((groupList || []).map((g) => g.name || g.device_group).filter(Boolean) as string[])
      setGroupStats(groupList || [])
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
  const totalCardPages = Math.max(1, Math.ceil(groupStats.length / cardsPerPage))
  useEffect(() => {
    if (groupPage > totalCardPages) setGroupPage(totalCardPages)
  }, [groupPage, totalCardPages])
  const visibleCounts = useMemo(() => {
    const start = (groupPage - 1) * cardsPerPage
    return groupStats.slice(start, start + cardsPerPage)
  }, [groupStats, groupPage, cardsPerPage])

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
        const { id: _omit, ...rest } = values as any
        await updateDevice({ ...rest, id: editing.id })
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

  const submitGroup = async () => {
    try {
      const values = await groupForm.validateFields()
      if (editingGroup?.id) {
        await updateDeviceGroup({ id: editingGroup.id, ...values })
        msgApi.success('已更新群組')
      } else {
        await createDeviceGroup(values)
        msgApi.success('已建立群組')
      }
      setGroupModalOpen(false)
      setEditingGroup(null)
      groupForm.resetFields()
      load()
    } catch (e: any) {
      if (e?.errorFields) return
      msgApi.error(e?.message || (editingGroup ? '更新群組失敗' : '建立群組失敗'))
    }
  }

  const openCreateGroup = () => {
    setEditingGroup(null)
    groupForm.resetFields()
    setGroupModalOpen(true)
  }

  const openEditGroup = (group: DeviceGroupWithCount) => {
    setEditingGroup(group)
    groupForm.setFieldsValue({ name: group.name || group.device_group || '', description: group.description || '' })
    setGroupModalOpen(true)
  }

  const handleDeleteGroup = async (group: DeviceGroupWithCount) => {
    if (!group.id) return
    const name = group.name || group.device_group || '群組'
    const count = group.device_count ?? 0
    if (count > 0) {
      msgApi.warning(`「${name}」內仍有 ${count} 台設備，請先移除或轉移設備後再刪除群組。`)
      return
    }
    Modal.confirm({
      title: '刪除群組',
      content: `確認刪除「${name}」？`,
      okType: 'danger',
      okText: '刪除',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteDeviceGroup(group.id!)
          msgApi.success('群組已刪除')
          if (query.group === (group.name || group.device_group)) {
            setQuery((q) => ({ ...q, group: undefined }))
          }
          load()
        } catch (e: any) {
          msgApi.error(e?.message || '刪除群組失敗')
        }
      }
    })
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
              placeholder="搜尋名稱、群組或 HA 群組"
              onChange={(e) => setQuery((q) => ({ ...q, keyword: e.target.value }))}
              style={{ width: 260 }}
            />
            <Space size={8}>
              <Typography.Text type="secondary">只看 HA</Typography.Text>
              <Switch checked={query.haOnly} onChange={(checked) => setQuery((q) => ({ ...q, haOnly: checked }))} />
            </Space>
            <Button
              type="primary"
              onClick={openCreateGroup}
              style={{ backgroundColor: token.colorSuccess, borderColor: token.colorSuccess }}
            >
              新增群組
            </Button>
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
                total={groupStats.length}
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
            {visibleCounts.map((c, idx) => {
              const groupName = c.name || c.device_group || ''
              const active = query.group === groupName
              const key = c.id ? `group-${c.id}` : groupName || `group-${idx}`
              return (
                <Card
                  key={key}
                  hoverable
                  onClick={() => setQuery((q) => ({ ...q, group: active ? undefined : groupName }))}
                  style={{
                    cursor: 'pointer',
                    borderColor: active ? token.colorPrimary : undefined,
                    transition: 'border-color 0.2s',
                    background: isDark ? '#304547' : '#F1FAFA',
                    position: 'relative'
                  }}
                >
                  {c.id && (
                    <Space
                      size={4}
                      style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditGroup(c)}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteGroup(c)}
                      />
                    </Space>
                  )}
                  <Space direction="vertical" size={2} style={{ width: '100%', paddingTop: 8 }}>
                    {/* <Typography.Text type="secondary">設備群組</Typography.Text> */}
                    <Typography.Title level={5} style={{ margin: 0, overflowWrap: 'anywhere' }}>
                      {groupName || '（未命名）'}
                    </Typography.Title>
                    {c.description ? (
                      <Typography.Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2, tooltip: c.description }}
                        style={{ margin: 0 }}
                      >
                        {c.description}
                      </Typography.Paragraph>
                    ) : null}
                    <Typography.Text>數量：{c.device_count ?? 0}</Typography.Text>
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
                Modal.confirm({
                  title: '批量刪除設備',
                  content: `確認刪除選取的 ${selectedKeys.length} 筆設備？此操作無法復原。`,
                  okText: '刪除',
                  okType: 'danger',
                  cancelText: '取消',
                  onOk: async () => {
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
                  }
                })
              }}
              extra={
                <Button
                  disabled={!selectedKeys.length}
                  onClick={() => {
                    moveForm.resetFields()
                    setMoveModalOpen(true)
                  }}
                >
                  批量遷移
                </Button>
              }
            />
            <Table<Device>
              rowKey={(r) => String(r.id ?? `${r.device_group}-${r.name}`)}
              loading={loading}
              dataSource={filtered}
              size="middle"
              onRow={(record) => {
                const key = String(record.id ?? `${record.device_group}-${record.name}`)
                const decoration = rowDecorations.get(key)
                if (!decoration?.isHA) return {}
                return {
                  style: {
                    background: isDark ? 'rgba(34, 211, 238, 0.06)' : 'rgba(8, 145, 178, 0.06)',
                    borderTop: decoration.isGroupStart
                      ? `2px solid ${isDark ? 'rgba(34, 211, 238, 0.55)' : 'rgba(8, 145, 178, 0.45)'}`
                      : undefined
                  }
                }
              }}
              pagination={{ pageSize, showSizeChanger: false }}
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: (keys) => setSelectedKeys(keys),
                getCheckboxProps: (record) => ({ disabled: !record.id }),
                preserveSelectedRowKeys: true
              }}
              columns={[
                {
                  title: '設備名稱',
                  dataIndex: 'name',
                  render: (value, record) => (
                    <Space size={8}>
                      <span>{value}</span>
                      {record.ha_group ? <Tag color="blue">HA</Tag> : null}
                    </Space>
                  )
                },
                { title: '群組', dataIndex: 'device_group', width: 180 },
                {
                  title: 'HA 群組',
                  dataIndex: 'ha_group',
                  width: 180,
                  render: (value?: string) => (value ? <Tag color="cyan">{value}</Tag> : '-')
                },
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
          <Form.Item label="HA 群組" name="ha_group">
            <Input placeholder="例如：fw-cluster-01（選填）" />
          </Form.Item>
          <Form.Item label="名稱" name="name" rules={[{ required: true, message: '請輸入名稱' }]}>
            <Input placeholder="例如：FW-001" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="批量遷移設備"
        open={moveModalOpen}
        onCancel={() => setMoveModalOpen(false)}
        onOk={async () => {
          try {
            const values = await moveForm.validateFields()
            const ids = selectedKeys.map((k) => Number(k)).filter((n) => Number.isFinite(n))
            if (!ids.length) {
              msgApi.warning('請先選擇要遷移的設備')
              return
            }
            setMoveLoading(true)
            await http.post('/api/v1/DeviceGroup/MoveDevices', {
              device_ids: ids,
              target_group_name: values.target_group_name
            })
            msgApi.success('遷移完成')
            setMoveModalOpen(false)
            setSelectedKeys([])
            load()
          } catch (e: any) {
            if (e?.errorFields) return
            msgApi.error(e?.message || '遷移失敗')
          } finally {
            setMoveLoading(false)
          }
        }}
        confirmLoading={moveLoading}
      >
        <Typography.Paragraph type="secondary">
          已選擇 {selectedKeys.length} 台設備，請選擇目標群組進行遷移。
        </Typography.Paragraph>
        <Form form={moveForm} layout="vertical">
          <Form.Item
            label="目標群組"
            name="target_group_name"
            rules={[{ required: true, message: '請選擇或輸入目標群組' }]}
          >
            <AutoComplete
              placeholder="選擇或輸入群組名稱"
              options={groups.map((g) => ({ value: g }))}
              filterOption={(inputValue, option) => (option?.value ?? '').toString().toLowerCase().includes(inputValue.toLowerCase())}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingGroup ? '編輯群組' : '新增群組'}
        open={groupModalOpen}
        onCancel={() => {
          setGroupModalOpen(false)
          setEditingGroup(null)
        }}
        onOk={submitGroup}
        destroyOnClose
      >
        <Form form={groupForm} layout="vertical">
          <Form.Item label="群組名稱" name="name" rules={[{ required: true, message: '請輸入群組名稱' }]}>
            <Input placeholder="例如：Web Servers" autoFocus />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="可填寫備註，選填" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
