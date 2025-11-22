export type ModuleKey = 'log' | 'es' | 'system'

export type ModuleRoute = {
  key: string // e.g., 'history'
  path: string // e.g., '/m/log/history'
  label: string
  group: 'monitor' | 'settings'
  icon?: string // AntD icon key (optional)
}

export type ModuleDef = {
  id: ModuleKey
  name: string
  icon?: string // AntD icon key
  routes: ModuleRoute[]
  defaultPath: string
}

export const modules: ModuleDef[] = [
  {
    id: 'log',
    name: 'Log 監控',
    icon: 'DatabaseOutlined',
    defaultPath: '/m/log/history',
    routes: [
      { key: 'history', path: '/m/log/history', label: '歷史紀錄', group: 'monitor', icon: 'HistoryOutlined' },
      { key: 'devices', path: '/m/log/devices', label: '設備', group: 'settings', icon: 'HddOutlined' },
      { key: 'targets', path: '/m/log/targets', label: '偵測目標', group: 'settings', icon: 'RadarChartOutlined' },
      { key: 'receivers', path: '/m/log/receivers', label: '通知接收者', group: 'settings', icon: 'ContainerOutlined' },
      { key: 'indices', path: '/m/log/indices', label: '索引', group: 'settings', icon: 'AppstoreOutlined' },
    ]
  },
  {
    id: 'es',
    name: 'Elasticsearch',
    icon: 'ClusterOutlined',
    defaultPath: '/m/es/overview',
    routes: [
      { key: 'overview', path: '/m/es/overview', label: '總覽', group: 'monitor', icon: 'DashboardOutlined' },
      { key: 'history', path: '/m/es/history', label: '歷史視覺化', group: 'monitor', icon: 'LineChartOutlined' },
      { key: 'indices', path: '/m/es/indices', label: '索引', group: 'monitor', icon: 'AppstoreOutlined' },
      { key: 'shards', path: '/m/es/shards', label: 'Shards', group: 'monitor', icon: 'PartitionOutlined' },
      { key: 'alerts', path: '/m/es/alerts', label: '告警', group: 'monitor', icon: 'AlertOutlined' },
      { key: 'monitors', path: '/m/es/monitors', label: '監控配置', group: 'settings', icon: 'SettingOutlined' },
      { key: 'connections', path: '/m/es/connections', label: 'ES 連接', group: 'settings', icon: 'ApiOutlined' },
    ]
  },
  {
    id: 'system',
    name: '系統',
    icon: 'SettingOutlined',
    defaultPath: '/m/system/users',
    routes: [
      { key: 'users', path: '/m/system/users', label: '使用者', group: 'settings', icon: 'TeamOutlined' },
    ]
  },
]

export function getModule(id?: string): ModuleDef | undefined {
  return modules.find((m) => m.id === id)
}

export function findRouteByPath(pathname: string): { module: ModuleDef; route: ModuleRoute } | undefined {
  // 找到路徑最長匹配的子路由（避免前綴重疊）
  let match: { module: ModuleDef; route: ModuleRoute } | undefined
  let bestLen = -1
  for (const m of modules) {
    for (const r of m.routes) {
      if (pathname.startsWith(r.path) && r.path.length > bestLen) {
        match = { module: m, route: r }
        bestLen = r.path.length
      }
    }
  }
  return match
}
