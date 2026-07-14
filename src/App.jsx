import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import SimulatorSetup from './pages/SimulatorSetup'
import GroupDraw from './pages/GroupDraw'
import SimulatorPlay from './pages/SimulatorPlay'
import WC2026 from './pages/WC2026'
import HistoricCups from './pages/HistoricCups'
import HistoricPlay from './pages/HistoricPlay'
import LeaguesHub from './pages/LeaguesHub'
import LeaguePredict from './pages/LeaguePredict'
import Admin from './pages/Admin'
import AdminDetail from './pages/AdminDetail'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import CookiePolicy from './pages/legal/CookiePolicy'
import { getProfile } from './lib/storage'
import { LanguageProvider } from './lib/i18n'

function RootRoute() {
  const profile = getProfile()
  return profile ? <Navigate to="/dashboard" replace /> : <Onboarding />
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulator/setup" element={<SimulatorSetup />} />
        <Route path="/simulator/draw" element={<GroupDraw />} />
        <Route path="/simulator/play" element={<SimulatorPlay />} />
        <Route path="/wc2026" element={<WC2026 />} />
        <Route path="/historic" element={<HistoricCups />} />
        <Route path="/historic/:year" element={<HistoricPlay />} />
        <Route path="/leagues" element={<LeaguesHub />} />
        <Route path="/leagues/:leagueKey" element={<LeaguePredict />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/detail" element={<AdminDetail />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  )
}
