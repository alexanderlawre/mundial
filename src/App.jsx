import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Account from './pages/Account'
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
import { LanguageProvider } from './lib/i18n'
import { useAuth } from './lib/AuthContext'

// Supabase's client auto-detects a password-recovery token straight from
// the URL and resolves it into `session` just like a normal login -- so
// without this exception, RootRoute/RequireAuth would treat an incoming
// "reset your password" email link as an already-logged-in user and bounce
// them to /dashboard before they ever reach the actual reset-password form.
function isPasswordRecovery() {
  return typeof window !== 'undefined' && window.location.hash.includes('type=recovery')
}

function RootRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (isPasswordRecovery()) return <Navigate to="/reset-password" replace />
  return user ? <Navigate to="/dashboard" replace /> : <Onboarding />
}

// Guards every page that assumes a logged-in user (gameplay + account).
// Waits for AuthContext's initial session check before deciding, so a
// returning logged-in user is never flashed to /login on a hard refresh
// just because the async session lookup hasn't resolved yet.
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (isPasswordRecovery()) return <Navigate to="/reset-password" replace />
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/simulator/setup" element={<RequireAuth><SimulatorSetup /></RequireAuth>} />
        <Route path="/simulator/draw" element={<RequireAuth><GroupDraw /></RequireAuth>} />
        <Route path="/simulator/play" element={<RequireAuth><SimulatorPlay /></RequireAuth>} />
        <Route path="/wc2026" element={<RequireAuth><WC2026 /></RequireAuth>} />
        <Route path="/historic" element={<RequireAuth><HistoricCups /></RequireAuth>} />
        <Route path="/historic/:year" element={<RequireAuth><HistoricPlay /></RequireAuth>} />
        <Route path="/leagues" element={<RequireAuth><LeaguesHub /></RequireAuth>} />
        <Route path="/leagues/:leagueKey" element={<RequireAuth><LeaguePredict /></RequireAuth>} />
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
