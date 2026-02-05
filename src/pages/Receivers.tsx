import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { createReceiver, deleteReceiver, getAllReceivers, updateReceiver, type Receiver } from '@/api/receivers'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import useAutoPageSize from '@/hooks/useAutoPageSize'

export default function Receivers() {
  const [data, setData] = useState<Receiver[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Receiver | null>(null)
  const [form] = Form.useForm<Receiver>()
  const [msgApi, contextHolder] = message.useMessage()
  const [keyword, setKeyword] = useState('')
  const debouncedKw = useDebouncedValue(keyword, 300)
  const { ref: tableWrapRef, pageSize } = useAutoPageSize({ min: 8 })

  const filtered = useMemo(() => {
    const kw = debouncedKw.trim().toLowerCase()
    if (!kw) return data
    return data.filter((r) => r.name?.some((n) => n.toLowerCase().includes(kw)))
  }, [data, debouncedKw])

  const load = async () => {
    setLoading(true)
    try {
      const res = await getAllReceivers()
      setData(res)
    } catch (e: any) {
      msgApi.error(e?.message || '載入接收者失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: Receiver) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing?.id) {
        const { id: _omit, ...rest } = values as any
        await updateReceiver({ ...rest, id: editing.id })
        msgApi.success('更新成功')
      } else {
        await createReceiver(values)
        msgApi.success('新增成功')
      }
      setModalOpen(false)
      load()
    } catch (e: any) {
      if (e?.errorFields) return
      msgApi.error(e?.message || '操作失敗')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteReceiver(id)
      msgApi.success('刪除成功')
      load()
    } catch (e: any) {
      msgApi.error(e?.message || '刪除失敗')
    }
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {contextHolder}
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Typography.Title level={4}>通知接收者</Typography.Title>
        <Space>
          <Input.Search allowClear placeholder="搜尋收件者" onChange={(e) => setKeyword(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" onClick={openCreate}>
            新增接收者
          </Button>
        </Space>
      </Space>

      <div ref={tableWrapRef}>
      <Table<Receiver>
        rowKey={(r) => String(r.id ?? Math.random())}
        loading={loading}
        dataSource={filtered}
        size="middle"
        pagination={{ pageSize, showSizeChanger: false }}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 90 },
          {
            title: '收件者',
            dataIndex: 'name',
            render: (arr: string[]) => (arr && arr.length ? arr.map((n) => <Tag key={n}>{n}</Tag>) : '-')
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

      <Modal
        title={editing ? '編輯接收者' : '新增接收者'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form<Receiver> form={form} layout="vertical" initialValues={{ name: [] }}>
          <Form.Item label="收件者名單" name="name" rules={[{ required: true, message: '至少輸入一位收件者' }]}>
            <Select mode="tags" tokenSeparators={[',', ';', ' ']} placeholder="輸入 Email 或名稱後按 Enter" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
