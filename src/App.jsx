import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import SimulatorSetup from './pages/SimulatorSetup'
import GroupDraw from './pages/GroupDraw'
import SimulatorPlay from './pages/SimulatorPlay'
import WC2026 from './pages/WC2026'
import HistoricCups from './pages/HistoricCups'
import HistoricPlay from './pages/HistoricPlay'
import Admin from './pages/Admin'
import { getProfile } from './lib/storage'

function RootRoute() {
  const profile = getProfile()
  return profile ? <Navigate to="/dashboard" replace /> : <Onboarding />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/simulator/setup" element={<SimulatorSetup />} />
      <Route path="/simulator/draw" element={<GroupDraw />} />
      <Route path="/simulator/play" element={<SimulatorPlay />} />
      <Route path="/wc2026" element={<WC2026 />} />
      <Route path="/historic" element={<HistoricCups />} />
      <Route path="/historic/:year" element={<HistoricPlay />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
