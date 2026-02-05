import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Devices from '@/pages/Devices'
import Targets from '@/pages/Targets'
import Receivers from '@/pages/Receivers'
import Indices from '@/pages/Indices'
import History from '@/pages/History'
import Users from '@/pages/Users'
import { isAuthenticated } from '@/store/auth'
import EsOverview from '@/pages/es/Overview'
import EsHistory from '@/pages/es/History'
import EsIndices from '@/pages/es/Indices'
import EsShards from '@/pages/es/Shards'
import EsAlerts from '@/pages/es/Alerts'
import EsMonitors from '@/pages/es/Monitors'
import EsConnections from '@/pages/es/Connections'

function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}> 
        <Route element={<AppLayout />}> 
          <Route index element={<Navigate to="/m/log/history" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Module routes */}
          <Route path="/m/log/history" element={<History />} />
          <Route path="/m/log/devices" element={<Devices />} />
          <Route path="/m/log/targets" element={<Targets />} />
          <Route path="/m/log/receivers" element={<Receivers />} />
          <Route path="/m/log/indices" element={<Indices />} />
          <Route path="/m/es/overview" element={<EsOverview />} />
          <Route path="/m/es/history" element={<EsHistory />} />
          <Route path="/m/es/indices" element={<EsIndices />} />
          <Route path="/m/es/shards" element={<EsShards />} />
          <Route path="/m/es/alerts" element={<EsAlerts />} />
          <Route path="/m/es/monitors" element={<EsMonitors />} />
          <Route path="/m/system/users" element={<Users />} />
          <Route path="/m/system/es-connections" element={<EsConnections />} />

          {/* Backward compatibility redirects */}
          <Route path="/devices" element={<Navigate to="/m/log/devices" replace />} />
          <Route path="/targets" element={<Navigate to="/m/log/targets" replace />} />
          <Route path="/receivers" element={<Navigate to="/m/log/receivers" replace />} />
          <Route path="/indices" element={<Navigate to="/m/log/indices" replace />} />
          <Route path="/history" element={<Navigate to="/m/log/history" replace />} />
          <Route path="/users" element={<Navigate to="/m/system/users" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated() ? '/m/log/history' : '/login'} replace />} />
    </Routes>
  )
}
