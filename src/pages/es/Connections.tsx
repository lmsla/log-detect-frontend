import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Space, Switch, Table, Tag, Typography, message, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import {
  getAllESConnections,
  createESConnection,
  updateESConnection,
  deleteESConnection,
  testESConnection,
  setDefaultESConnection,
  reloadESConnection,
  type ESConnection
} from '@/api/esConnection'
import useAutoPageSize from '@/hooks/useAutoPageSize'
import PageHeader from '@/components/PageHeader'
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons'

export default function ESConnections() {
  const [data, setData] = useState<ESConnection[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ESConnection | null>(null)
  const [testingId, setTestingId] = useState<number | null>(null)
  const [form] = Form.useForm<ESConnection>()
  const [msgApi, contextHolder] = message.useMessage()
  const { ref: tableWrapRef, pageSize } = useAutoPageSize({ min: 8 })

  const load = async () => {
    setLoading(true)
    try {
      const connections = await getAllESConnections()
      setData(connections)
    } catch (e: any) {
      msgApi.error(e?.message || '載入 ES 連接失敗')
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
    form.setFieldsValue({ port: 9200, enable_auth: false, use_tls: true, is_default: false })
    setModalOpen(true)
  }

  const openEdit = (record: ESConnection) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing?.id) {
        await updateESConnection({ id: editing.id, ...values })
        msgApi.success('更新成功')
      } else {
        await createESConnection(values)
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
      await deleteESConnection(id)
      msgApi.success('刪除成功')
      load()
    } catch (e: any) {
      msgApi.error(e?.message || '刪除失敗')
    }
  }

  const handleTest = async (record: ESConnection) => {
    if (!record.id) return
    setTestingId(record.id)
    try {
      await testESConnection(record)
      msgApi.success('連接測試成功')
    } catch (e: any) {
      msgApi.error(e?.message || '連接測試失敗')
    } finally {
      setTestingId(null)
    }
  }

  const handleSetDefault = async (id?: number) => {
    if (!id) return
    try {
      await setDefaultESConnection(id)
      msgApi.success('已設置為默認連接')
      load()
    } catch (e: any) {
      msgApi.error(e?.message || '設置失敗')
    }
  }

  const handleReload = async (id?: number) => {
    if (!id) return
    try {
      await reloadESConnection(id)
      msgApi.success('重新加載成功')
      load()
    } catch (e: any) {
      msgApi.error(e?.message || '重新加載失敗')
    }
  }

  const StatusIcon = ({ status }: { status?: string }) => {
    if (status === 'online') return <CheckCircleOutlined style={{ color: '#52c41a' }} />
    if (status === 'offline') return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    return <QuestionCircleOutlined style={{ color: '#d9d9d9' }} />
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {contextHolder}
      <PageHeader
        title="ES 連接管理"
        extra={
          <Button type="primary" onClick={openCreate}>
            新增連接
          </Button>
        }
      />

      <div ref={tableWrapRef}>
        <Table<ESConnection>
          rowKey={(r) => String(r.id ?? Math.random())}
          loading={loading}
          dataSource={data}
          size="middle"
          pagination={{ pageSize, showSizeChanger: false }}
          columns={[
            {
              title: '名稱',
              dataIndex: 'name',
              render: (text, record) => (
                <Space>
                  {text}
                  {record.is_default && <Tag color="blue">默認</Tag>}
                </Space>
              )
            },
            {
              title: '主機',
              dataIndex: 'host',
              render: (host, record) => `${record.use_tls ? 'https' : 'http'}://${host}:${record.port}`
            },
            {
              title: '認證',
              dataIndex: 'enable_auth',
              width: 80,
              render: (v) => (v ? <Tag color="green">啟用</Tag> : <Tag>停用</Tag>)
            },
            {
              title: '狀態',
              dataIndex: 'status',
              width: 100,
              render: (status) => (
                <Space>
                  <StatusIcon status={status} />
                  <span>{status === 'online' ? '在線' : status === 'offline' ? '離線' : '未知'}</span>
                </Space>
              )
            },
            {
              title: '描述',
              dataIndex: 'description',
              ellipsis: true,
              render: (text) => text || '-'
            },
            {
              title: '操作',
              width: 320,
              render: (_, record) => (
                <Space size="small">
                  <Tooltip title="測試連接">
                    <Button
                      size="small"
                      icon={<ThunderboltOutlined />}
                      loading={testingId === record.id}
                      onClick={() => handleTest(record)}
                    >
                      測試
                    </Button>
                  </Tooltip>
                  <Tooltip title="重新加載">
                    <Button size="small" icon={<ReloadOutlined />} onClick={() => handleReload(record.id)} />
                  </Tooltip>
                  {!record.is_default && (
                    <Button size="small" onClick={() => handleSetDefault(record.id)}>
                      設為默認
                    </Button>
                  )}
                  <Button size="small" onClick={() => openEdit(record)}>
                    編輯
                  </Button>
                  <Popconfirm
                    title="確認刪除？"
                    description={record.is_default ? '這是默認連接，刪除後請設置新的默認連接' : undefined}
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button size="small" danger disabled={record.is_default}>
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
        title={editing ? '編輯 ES 連接' : '新增 ES 連接'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        width={720}
      >
        <Form<ESConnection> form={form} layout="vertical">
          <Form.Item label="名稱" name="name" rules={[{ required: true, message: '請輸入名稱' }]}>
            <Input placeholder="Production ES" />
          </Form.Item>

          <Form.Item label="主機地址" name="host" rules={[{ required: true, message: '請輸入主機地址' }]}>
            <Input placeholder="es.example.com" />
          </Form.Item>

          <Form.Item label="端口" name="port" rules={[{ required: true, message: '請輸入端口' }]}>
            <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="9200" />
          </Form.Item>

          <Form.Item label="使用 TLS/HTTPS" name="use_tls" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="啟用認證" name="enable_auth" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.enable_auth !== currentValues.enable_auth}
          >
            {({ getFieldValue }) =>
              getFieldValue('enable_auth') ? (
                <>
                  <Form.Item label="使用者名稱" name="username">
                    <Input placeholder="elastic_user" />
                  </Form.Item>
                  <Form.Item label="密碼" name="password">
                    <Input.Password placeholder={editing ? '留空表示不修改密碼' : '請輸入密碼'} />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          <Form.Item label="設為默認連接" name="is_default" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="Production cluster for main application logs" />
          </Form.Item>
        </Form>

        <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
          提示：連接配置保存後，系統會自動測試連接狀態。請確保 Elasticsearch 服務可訪問。
        </Typography.Paragraph>
      </Modal>
    </Space>
  )
}
