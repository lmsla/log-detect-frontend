import { Button, Space, Tag, theme } from 'antd'

type Props = {
  count: number
  onClear: () => void
  onDelete: () => void
  loading?: boolean
}

export default function BulkBar({ count, onClear, onDelete, loading }: Props) {
  const {
    token: { colorBgContainer, colorBorderSecondary }
  } = theme.useToken()

  if (count <= 0) return null

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        background: colorBgContainer,
        border: `1px solid ${colorBorderSecondary}`,
        borderRadius: 10,
        padding: '8px 12px',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Space>
        <span>已選取</span>
        <Tag color="blue">{count}</Tag>
        <Button size="small" onClick={onClear}>
          清除選取
        </Button>
      </Space>
      <Space>
        <Button size="small" danger loading={loading} onClick={onDelete}>
          批量刪除
        </Button>
      </Space>
    </div>
  )
}
