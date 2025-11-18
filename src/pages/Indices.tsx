import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Typography, message, AutoComplete, Alert, Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import {
  createIndex,
  deleteIndex,
  getAllIndices,
  getIndicesByLogname,
  getLognames,
  updateIndex,
  type Index,
  type LogName
} from '@/api/indices'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import useAutoPageSize from '@/hooks/useAutoPageSize'
import { getDeviceGroups } from '@/api/devices'

const PERIOD_OPTIONS = ['minutes', 'hours', 'days']

export default function Indices() {
  const [data, setData] = useState<Index[]>([])
  const [lognames, setLognames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Index | null>(null)
  const [filterLogname, setFilterLogname] = useState<string | undefined>(undefined)
  const [keyword, setKeyword] = useState('')
  const debouncedKw = useDebouncedValue(keyword, 300)
  const [form] = Form.useForm<Index>()
  const [msgApi, contextHolder] = message.useMessage()
  const { ref: tableWrapRef, pageSize } = useAutoPageSize({ min: 8 })
  const [groups, setGroups] = useState<string[]>([])

  const filtered = useMemo(() => {
    const kw = debouncedKw.trim().toLowerCase()
    return data.filter((i) =>
      kw ? [i.pattern, i.device_group, i.logname, i.field].some((v) => v?.toLowerCase().includes(kw)) : true
    )
  }, [data, debouncedKw])

  const load = async () => {
    setLoading(true)
    try {
      const [indices, ln, groupObjs] = await Promise.all([getAllIndices(), getLognames(), getDeviceGroups()])
      setData(indices)
      setLognames((ln || []).map((x: LogName) => x.logname))
      setGroups(groupObjs.map((g) => g.device_group))
    } catch (e: any) {
      msgApi.error(e?.message || '載入索引失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterByLogname = async (logname?: string) => {
    setFilterLogname(logname)
    setLoading(true)
    try {
      if (logname) {
        const list = await getIndicesByLogname(logname)
        setData(list)
      } else {
        const list = await getAllIndices()
        setData(list)
      }
    } catch (e: any) {
      msgApi.error(e?.message || '查詢失敗')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: Index) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing?.id) {
        const { id: _omit, ...rest } = values as any
        await updateIndex({ ...rest, id: editing.id })
        msgApi.success('更新成功')
      } else {
        await createIndex(values)
        msgApi.success('新增成功')
      }
      setModalOpen(false)
      // 維持目前 logname 篩選狀態
      await handleFilterByLogname(filterLogname)
    } catch (e: any) {
      if (e?.errorFields) return
      msgApi.error(e?.message || '操作失敗')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteIndex(id)
      msgApi.success('刪除成功')
      await handleFilterByLogname(filterLogname)
    } catch (e: any) {
      msgApi.error(e?.message || '刪除失敗')
    }
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {contextHolder}
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Typography.Title level={4}>日誌管理</Typography.Title>
        <Space>
          <Input.Search
            allowClear
            placeholder="搜尋 pattern / group / logname / field"
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 320 }}
          />
          <Select
            allowClear
            placeholder="依 Logname 篩選"
            value={filterLogname}
            style={{ width: 220 }}
            options={lognames.map((v) => ({ label: v, value: v }))}
            onChange={(v) => handleFilterByLogname(v)}
          />
          <Tooltip title={groups.length === 0 ? '請先於設備頁建立群組與設備' : ''}>
            <Button type="primary" onClick={openCreate} disabled={groups.length === 0}>
              新增日誌
            </Button>
          </Tooltip>
        </Space>
      </Space>

      {groups.length === 0 && (
        <Alert
          type="warning"
          showIcon
          message="目前沒有任何設備群組"
          description="請先到「設備」頁建立群組與設備後，再回來建立索引。"
          style={{ marginTop: 8 }}
        />
      )}

      <div ref={tableWrapRef}>
      <Table<Index>
        rowKey={(r) => String(r.id ?? Math.random())}
        loading={loading}
        dataSource={filtered}
        size="middle"
        pagination={{ pageSize, showSizeChanger: false }}
        columns={[
          // { title: 'ID', dataIndex: 'id', width: 80 },
          { title: 'Index Pattern', dataIndex: 'pattern' },
          { title: '設備群組', dataIndex: 'device_group' },
          { title: 'Logname', dataIndex: 'logname' },
          { title: '時間週期', dataIndex: 'period', width: 120 },
          { title: '數量', dataIndex: 'unit', width: 100 },
          { title: 'Field', dataIndex: 'field' },
          
          {
            title: '操作',
            width: 200,
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

      <Modal
        title={editing ? '編輯索引' : '新增索引'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        width={680}
      >
        <Form<Index> form={form} layout="vertical" initialValues={{ period: 'minutes', unit: 60 }}>
          <Form.Item label="Pattern" name="pattern" rules={[{ required: true, message: '請輸入 pattern' }]}>
            <Input placeholder="logstash-log_detect-*" />
          </Form.Item>
          <Form.Item label="Device Group" name="device_group" rules={[{ required: true, message: '請選擇 Device Group' }]}>
            <Select showSearch placeholder={groups.length ? '選擇既有群組' : '尚無群組，請先至設備頁建立'} options={groups.map((g) => ({ label: g, value: g }))} disabled={groups.length === 0} />
          </Form.Item>
          <Form.Item label="Logname" name="logname" rules={[{ required: true, message: '請輸入或選擇 logname' }]}>
            <AutoComplete
              placeholder="輸入新 logname 或選擇既有"
              options={lognames.map((v) => ({ value: v }))}
              filterOption={(input, option) => (option?.value ?? '').toString().toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="Period" name="period" rules={[{ required: true }]}>
              <Select options={PERIOD_OPTIONS.map((v) => ({ label: v, value: v }))} />
            </Form.Item>
            <Form.Item style={{ width: 160 }} label="Unit" name="unit" rules={[{ required: true }] }>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>
          <Form.Item label="Field" name="field" rules={[{ required: true, message: '請輸入 field' }]}>
            <Input placeholder="host.keyword" />
          </Form.Item>
          
        </Form>
      </Modal>
    </Space>
  )
}
