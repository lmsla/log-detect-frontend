import { Button, Form, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message, Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { createTarget, deleteTarget, getAllTargets, updateTarget, type Target } from '@/api/targets'
import { getAllIndices, type Index } from '@/api/indices'
import useAutoPageSize from '@/hooks/useAutoPageSize'

export default function Targets() {
  const [data, setData] = useState<Target[]>([])
  const [indices, setIndices] = useState<Index[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Target | null>(null)
  const [form] = Form.useForm<Target>()
  const [msgApi, contextHolder] = message.useMessage()
  const [keyword, setKeyword] = useState('')
  const { ref: tableWrapRef, pageSize } = useAutoPageSize({ min: 8 })

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return data
    return data.filter((t) =>
      [t.subject, ...(t.to || []), ...(t.indices?.map((i) => i.logname) || [])]
        .filter(Boolean)
        .some((v) => v!.toString().toLowerCase().includes(kw))
    )
  }, [data, keyword])

  const load = async () => {
    setLoading(true)
    try {
      const [targets, allIdx] = await Promise.all([getAllTargets(), getAllIndices()])
      setData(targets)
      setIndices(allIdx)
    } catch (e: any) {
      msgApi.error(e?.message || '載入目標失敗')
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

  const openEdit = (record: Target) => {
    setEditing(record)
    form.setFieldsValue({
      id: record.id,
      subject: record.subject,
      to: record.to,
      enable: record.enable,
      indices_ids: (record.indices || []).map((i) => i.id).filter(Boolean)
    } as any)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      // 後端多對多關聯：傳送 indices 只需包含 id 即可
      const selectedIndexIds: number[] = (values as any).indices_ids || []
      const body: Partial<Target> = {
        ...(editing?.id ? { id: editing.id } : {}),
        subject: values.subject,
        to: values.to || [],
        enable: values.enable ?? true,
        indices: selectedIndexIds.map((id) => ({ id } as Index))
      }

      if (editing?.id) {
        await updateTarget(body as Target)
        msgApi.success('更新成功')
      } else {
        await createTarget(body as Target)
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
      await deleteTarget(id)
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
        <Typography.Title level={4}>偵測目標</Typography.Title>
        <Space>
          <Input.Search allowClear placeholder="搜尋主旨/收件人/Logname" onChange={(e) => setKeyword(e.target.value)} style={{ width: 320 }} />
          <Button type="primary" onClick={openCreate}>
            新增目標
          </Button>
        </Space>
      </Space>

      <div ref={tableWrapRef}>
      <Table<Target>
        rowKey={(r) => String(r.id ?? Math.random())}
        loading={loading}
        dataSource={filtered}
        size="middle"
        pagination={{ pageSize, showSizeChanger: false }}
        columns={[
          // { title: 'ID', dataIndex: 'id', width: 80 },
          { title: '主旨', dataIndex: 'subject' },
          {
            title: '收件人',
            dataIndex: 'to',
            render: (arr: string[]) => (arr && arr.length ? arr.map((n) => <Tag key={n}>{n}</Tag>) : '-')
          },
          {
            title: '索引(Logname)',
            dataIndex: 'indices',
            render: (arr?: Index[]) => (arr && arr.length ? arr.map((i) => <Tag key={i.id}>{i.logname}</Tag>) : '-')
          },
          {
            title: '啟用',
            dataIndex: 'enable',
            width: 120,
            render: (v?: boolean) => (v ? <Tag color="green">ON</Tag> : <Tag>OFF</Tag>)
          },
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
        title={editing ? '編輯目標' : '新增目標'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        width={720}
      >
        <Form<Target> form={form} layout="vertical" initialValues={{ enable: true, to: [] }}>
          <Form.Item label="主旨" name="subject" rules={[{ required: true, message: '請輸入主旨' }]}>
            <Input placeholder="Log Detect Alert" />
          </Form.Item>
          <Form.Item label="收件人" name="to" rules={[{ required: true, message: '至少輸入一位收件人' }]}>
            <Select mode="tags" tokenSeparators={[',', ';', ' ']} placeholder="輸入 Email 後按 Enter" />
          </Form.Item>
          <Form.Item label="索引 (依 Logname 選擇)" name="indices_ids">
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="label"
              placeholder="選擇索引（可多選）"
              options={indices.map((i) => ({ label: `${i.logname} (${i.pattern})`, value: i.id }))}
              filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Form.Item label="啟用" name="enable" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
        <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
          提示：目前後端 UpdateTarget 會先刪除舊的 indices_targets 關聯，並以 GORM 更新資料。
          若未正確重建關聯，可能需要後端啟用 FullSaveAssociations 或新增專屬關聯更新 API。
        </Typography.Paragraph>
      </Modal>
    </Space>
  )
}
