import { ReactNode } from 'react'
import { Space, Typography } from 'antd'

type Props = {
  title: ReactNode
  subtitle?: ReactNode
  extra?: ReactNode
}

export default function PageHeader({ title, subtitle, extra }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Space direction="vertical" size={2} style={{ paddingRight: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {subtitle ? (
          <Typography.Text type="secondary">{subtitle}</Typography.Text>
        ) : null}
      </Space>
      <div>{extra}</div>
    </div>
  )
}

