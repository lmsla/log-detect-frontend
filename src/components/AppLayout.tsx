import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuth, getUserProfile } from '@/store/auth'
import { useMemo, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import * as Icons from '@ant-design/icons'
import { getModule, modules, findRouteByPath } from '@/modules/registry'

const { Header, Sider, Content } = Layout

export default function AppLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const profile = getUserProfile()

  // 當前模組從路徑 /m/:module 辨識
  const moduleId = (location.pathname.startsWith('/m/') ? location.pathname.split('/')[2] : undefined) as any
  const currentModule = getModule(moduleId)

  // 單一 Sider：模組為父節點，當前模組展開顯示子頁（垂直擴展），其餘收合
  const navItems = useMemo(() => {
    return modules.map((m) => {
      const Icon = (Icons as any)[m.icon || 'AppstoreOutlined']
      const toItem = (r: any) => {
        const RIcon = (Icons as any)[r.icon || 'AppstoreOutlined']
        return { key: r.path, icon: RIcon ? <RIcon /> : undefined, label: <Link to={r.path}>{r.label}</Link> }
      }
      const monitorItems = m.routes.filter((r) => r.group === 'monitor').map(toItem)
      const settingsItems = m.routes.filter((r) => r.group === 'settings').map(toItem)
      const children: any[] = []
      if (monitorItems.length) children.push({ type: 'group', label: '監控', children: monitorItems })
      if (settingsItems.length) children.push({ type: 'group', label: '設定', children: settingsItems })
      return {
        key: `/m/${m.id}`,
        icon: Icon ? <Icon /> : undefined,
        label: m.name,
        children
      }
    })
  }, [])

  const [openKeys, setOpenKeys] = useState<string[]>(() => (moduleId ? [`/m/${moduleId}`] : []))
  const onOpenChange = (keys: string[]) => {
    // 僅允許展開一個模組
    const latest = keys.find((k) => !openKeys.includes(k))
    setOpenKeys(latest ? [latest] : [])
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 模組 + 子頁（垂直展開） */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={260}>
        <div style={{ height: 48, margin: 16, color: '#fff', display: 'flex', alignItems: 'center' }}>Log Detect</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={navItems as any}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between' }}>
          <div />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ThemeToggle />
            <span style={{ opacity: 0.75 }}>{profile?.username ?? '使用者'}</span>
            <a
              onClick={() => {
                clearAuth()
                navigate('/login', { replace: true })
              }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              登出
            </a>
          </div>
        </Header>
        <Content style={{ margin: '16px', height: 'calc(100vh - 64px - 32px)', overflow: 'hidden' }}>
          <div style={{ padding: 16, height: '100%', background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'hidden' }}>
            {/* Breadcrumb */}
            {location.pathname.startsWith('/m/') && (
              (() => {
                const match = findRouteByPath(location.pathname)
                if (!match) return null
                const groupText = match.route.group === 'monitor' ? '監控' : '設定'
                return (
                  <Breadcrumb
                    style={{ marginBottom: 12 }}
                    items={[
                      { title: <Link to={match.module.defaultPath}>{match.module.name}</Link> },
                      { title: groupText },
                      { title: match.route.label }
                    ]}
                  />
                )
              })()
            )}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
