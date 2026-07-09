import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NATIONS, CONFEDERATIONS } from '../data/nations'
import { saveProfile, logSignup } from '../lib/storage'
import CountryFlag from '../components/CountryFlag'
import SambaButton from '../components/SambaButton'
import AppBackground from '../components/AppBackground'
import { useTranslation } from '../lib/i18n'

function NationPicker({ label, value, onChange }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [confFilter, setConfFilter] = useState('ALL')

  const filtered = useMemo(() => {
    return NATIONS.filter((n) => {
      const matchesQuery = n.name.toLowerCase().includes(query.toLowerCase())
      const matchesConf = confFilter === 'ALL' || n.confederation === confFilter
      return matchesQuery && matchesConf
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [query, confFilter])

  return (
    <div>
      <label className="block font-display font-semibold text-charcoal-900 dark:text-sand mb-2">{label}</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('onboarding.searchPlaceholder')}
        className="w-full mb-2 px-4 py-2.5 rounded-xl border border-charcoal-900/15 dark:border-white/15 bg-white dark:bg-night-card focus:outline-none focus:ring-2 focus:ring-emerald"
      />
      <div className="flex flex-wrap gap-1.5 mb-2">
        <button
          onClick={() => setConfFilter('ALL')}
          className={`px-3 py-1 text-xs rounded-full border ${confFilter === 'ALL' ? 'bg-emerald text-white border-emerald' : 'border-charcoal-900/15 dark:border-white/15 text-charcoal-600 dark:text-charcoal-300'}`}
        >
          {t('onboarding.all')}
        </button>
        {CONFEDERATIONS.map((c) => (
          <button
            key={c}
            onClick={() => setConfFilter(c)}
            className={`px-3 py-1 text-xs rounded-full border ${confFilter === c ? 'bg-emerald text-white border-emerald' : 'border-charcoal-900/15 dark:border-white/15 text-charcoal-600 dark:text-charcoal-300'}`}
          >
            {c}
          </button>
        ))}
      </div>
      {value && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-gold/15 border border-gold">
          <CountryFlag nation={value} size="sm" />
          <span className="text-sm font-medium text-charcoal-900 dark:text-sand">{value.name}</span>
          <span className="text-xs text-charcoal-600 dark:text-charcoal-300 ml-auto">{t('onboarding.selected')}</span>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 rounded-xl border border-charcoal-900/10 dark:border-white/10 bg-white/60 dark:bg-night-card/60">
        {filtered.map((n) => (
          <button
            key={n.name}
            onClick={() => onChange(n)}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition-all hover:bg-mint/50
              ${value?.name === n.name ? 'bg-mint ring-2 ring-emerald' : ''}`}
          >
            <CountryFlag nation={n} size="sm" />
            <span className="truncate text-charcoal-900 dark:text-sand">{n.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-charcoal-600 dark:text-charcoal-300 py-4">{t('onboarding.noMatch')}</p>
        )}
      </div>
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [supportedCountry, setSupportedCountry] = useState(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canContinue = name.trim().length > 0 && emailValid && supportedCountry

  function handleContinue() {
    const profile = {
      name: name.trim(),
      email: email.trim(),
      supportedCountry: supportedCountry.name,
    }
    saveProfile(profile)
    logSignup(profile)
    navigate('/dashboard')
  }

  return (
    <AppBackground>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-6xl tracking-wide text-forest dark:text-mint">MUNDIAL</h1>
          <p className="text-charcoal-600 dark:text-charcoal-300 mt-1">{t('onboarding.subtitle')}</p>
        </div>

        <div className="bg-white/90 dark:bg-night-card/90 rounded-2xl shadow-depth-lg p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-display font-semibold text-charcoal-900 dark:text-sand mb-2">{t('onboarding.nameLabel')}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-900/15 dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald"
              />
            </div>
            <div>
              <label className="block font-display font-semibold text-charcoal-900 dark:text-sand mb-2">{t('onboarding.emailLabel')}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('onboarding.emailPlaceholder')}
                type="email"
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-900/15 dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald"
              />
            </div>
          </div>

          <NationPicker label={t('onboarding.supportLabel')} value={supportedCountry} onChange={setSupportedCountry} />

          <SambaButton
            variant="gold"
            size="lg"
            className="w-full"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {t('onboarding.enter')}
          </SambaButton>
        </div>
      </div>
    </AppBackground>
  )
}
