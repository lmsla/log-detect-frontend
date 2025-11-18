import { Button, Card, Form, Input, Typography, Flex, message } from 'antd'
import { login } from '@/api/auth'
import { setAuth } from '@/store/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [msgApi, contextHolder] = message.useMessage()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const res = await login(values.username, values.password)
      setAuth(res.token, res.user)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      msgApi.error(err?.message || '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Card title="Log Detect 登入" style={{ width: 360 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="帳號" name="username" rules={[{ required: true, message: '請輸入帳號' }]}>
            <Input autoFocus placeholder="Username" />
          </Form.Item>
          <Form.Item label="密碼" name="password" rules={[{ required: true, message: '請輸入密碼' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登入
          </Button>
        </Form>
        <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
          使用 /auth/login 取得 JWT，後續以 Bearer 傳遞
        </Typography.Paragraph>
      </Card>
    </Flex>
  )
}

