import { Button, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Typography, message, InputNumber } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { deleteUser, getUsers, registerUser, updateUser, type User } from '@/api/users'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import useAutoPageSize from '@/hooks/useAutoPageSize'

type UserFormValues = {
  id?: number
  username: string
  email: string
  role_id: number
  is_active: boolean
}

export default function Users() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form] = Form.useForm<UserFormValues>()
  const [msgApi, contextHolder] = message.useMessage()
  const [keyword, setKeyword] = useState('')
  const debouncedKw = useDebouncedValue(keyword, 300)
  const { ref: tableWrapRef, pageSize } = useAutoPageSize({ min: 8 })

  const filtered = useMemo(() => {
    const kw = debouncedKw.trim().toLowerCase()
    if (!kw) return data
    return data.filter((u) => [u.username, u.email, u.role?.name].filter(Boolean).some((v) => v!.toLowerCase().includes(kw)))
  }, [data, debouncedKw])

  const load = async () => {
    setLoading(true)
    try {
      const users = await getUsers()
      setData(users)
    } catch (e: any) {
      msgApi.error(e?.message || '載入使用者失敗')
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

  const openEdit = (record: User) => {
    setEditing(record)
    form.setFieldsValue({
      id: record.id,
      username: record.username,
      email: record.email,
      role_id: record.role_id,
      is_active: record.is_active
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing?.id) {
        await updateUser({
          id: editing.id,
          username: values.username,
          email: values.email,
          role_id: values.role_id,
          is_active: values.is_active
        } as any)
        msgApi.success('更新成功')
      } else {
        await registerUser({
          username: values.username,
          email: values.email,
          role_id: values.role_id,
          is_active: values.is_active
        } as any)
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
      await deleteUser(id)
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
        <Typography.Title level={4}>使用者管理</Typography.Title>
        <Space>
          <Input.Search allowClear placeholder="搜尋帳號/Email/角色" onChange={(e) => setKeyword(e.target.value)} style={{ width: 320 }} />
          <Button type="primary" onClick={openCreate}>
            新增使用者
          </Button>
        </Space>
      </Space>

      <div ref={tableWrapRef}>
        <Table<User>
          rowKey={(r) => String(r.id)}
          loading={loading}
          dataSource={filtered}
          size="middle"
          pagination={{ pageSize, showSizeChanger: false }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 90 },
            { title: '帳號', dataIndex: 'username' },
            { title: 'Email', dataIndex: 'email' },
            {
              title: '角色',
              dataIndex: 'role',
              render: (_: any, r) => (r.role?.name ? <Tag>{r.role.name}</Tag> : <Tag color="default">-</Tag>)
            },
            {
              title: '啟用',
              dataIndex: 'is_active',
              width: 120,
              render: (v: boolean) => (v ? <Tag color="green">ON</Tag> : <Tag>OFF</Tag>)
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
        title={editing ? '編輯使用者' : '新增使用者'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form<UserFormValues> form={form} layout="vertical" initialValues={{ is_active: true, role_id: 1 }}>
          <Form.Item label="帳號" name="username" rules={[{ required: true, message: '請輸入帳號' }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: '請輸入有效 Email' }]}>
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item label="角色 ID" name="role_id" rules={[{ required: true, message: '請輸入角色 ID' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="啟用" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
        <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
          提示：目前 OpenAPI 的 Register 使用 User 結構（未包含密碼）。若未來需要密碼/角色清單，建議擴充後端 API 與規格。
        </Typography.Paragraph>
      </Modal>
    </Space>
  )
}

