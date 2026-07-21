import { Navigate, Route, Routes } from 'react-router-dom'
import Onboarding from './pages/auth/Onboarding'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import Account from './pages/account/Account'
import Dashboard from './pages/account/Dashboard'
import SimulatorSetup from './pages/worldcup/SimulatorSetup'
import GroupDraw from './pages/worldcup/GroupDraw'
import SimulatorPlay from './pages/worldcup/SimulatorPlay'
import WC2026 from './pages/worldcup/WC2026'
import HistoricCups from './pages/worldcup/HistoricCups'
import HistoricPlay from './pages/worldcup/HistoricPlay'
import LeaguesHub from './pages/leagues/LeaguesHub'
import LeaguePredict from './pages/leagues/LeaguePredict'
import Admin from './pages/admin/Admin'
import AdminDetail from './pages/admin/AdminDetail'
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
