import { Segmented } from 'antd'
import { useThemeMode, ThemeMode } from '@/theme/ThemeContext'
import { BulbOutlined, DesktopOutlined, MoonOutlined } from '@ant-design/icons'

export default function ThemeToggle() {
  const { mode, setMode } = useThemeMode()
  const options = [
    { label: 'System', value: 'system', icon: <DesktopOutlined /> },
    { label: 'Light', value: 'light', icon: <BulbOutlined /> },
    { label: 'Dark', value: 'dark', icon: <MoonOutlined /> },
  ]
  return (
    <Segmented
      size="small"
      value={mode}
      onChange={(v) => setMode(v as ThemeMode)}
      options={options}
    />
  )
}

