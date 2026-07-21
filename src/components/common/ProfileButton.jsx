import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { useTranslation } from '../../lib/i18n'

// Header icon linking to /account, only rendered once a real session
// exists (mirrors the old ResetProfileButton's "only when there's
// something to show" pattern). Takes over LanguageSelector's old w-9 h-9
// size in the header row now that LanguageSelector itself has shrunk --
// this is the biggest icon in the row, since it's the primary way into
// the account area ("access your account by clicking on the picture").
export default function ProfileButton() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  if (!user) return null

  const initial = (user.user_metadata?.name || user.email || '?').trim().charAt(0).toUpperCase()

  return (
    <button
      onClick={() => navigate('/account')}
      aria-label={t('account.title')}
      className="w-9 h-9 shrink-0 rounded-full bg-emerald text-white shadow-depth border border-charcoal-900/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-sm hover:brightness-105 active:scale-95 transition-all"
    >
      {initial}
    </button>
  )
}
