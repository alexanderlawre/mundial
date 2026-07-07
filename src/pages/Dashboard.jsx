import { useNavigate } from 'react-router-dom'
import { getProfile, clearProfile, clearActiveTournament } from '../lib/storage'
import { getNation } from '../data/nations'
import CountryFlag from '../components/CountryFlag'
import SambaButton from '../components/SambaButton'
import AppBackground from '../components/AppBackground'

const MODES = [
  {
    key: 'simulator',
    title: 'World Cup Simulator',
    desc: 'Build your own 32 or 48-team World Cup. Pick or simulate qualifying, arrange the draw, and play it out.',
    path: '/simulator/setup',
    accent: 'bg-emerald',
  },
  {
    key: 'wc2026',
    title: 'World Cup 2026',
    desc: 'The real 2026 tournament: official 12 groups across the USA, Canada & Mexico.',
    path: '/wc2026',
    accent: 'bg-forest',
  },
  {
    key: 'historic',
    title: 'Historic World Cups',
    desc: 'Replay any World Cup from 1930 to 2022 with the real qualified teams and host nation.',
    path: '/historic',
    accent: 'bg-olive',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const profile = getProfile()
  const supported = profile ? getNation(profile.supportedCountry) : null

  function handleReset() {
    clearProfile()
    clearActiveTournament()
    navigate('/')
  }

  return (
    <AppBackground>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {supported && <CountryFlag nation={supported} size="lg" />}
            <div>
              <h1 className="font-display font-bold text-3xl tracking-wide text-forest">MUNDIAL</h1>
              <p className="text-charcoal-600 text-sm font-medium">
                {profile ? `Welcome, ${profile.name}` : 'Welcome to Mundial'}
              </p>
              {supported && <p className="text-charcoal-600 text-sm">Supporting {supported.name}</p>}
            </div>
          </div>
          <SambaButton variant="outline" size="sm" onClick={handleReset}>Reset Profile</SambaButton>
        </div>

        <div className="grid gap-5">
          {MODES.map((mode) => (
            <button
              key={mode.key}
              onClick={() => navigate(mode.path)}
              className="text-left rounded-2xl bg-white shadow-depth-lg overflow-hidden hover:-translate-y-1 active:scale-[0.99] transition-all"
            >
              <div className={`h-2 ${mode.accent}`} />
              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-charcoal-900">{mode.title}</h2>
                <p className="text-charcoal-600 mt-1 text-sm">{mode.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppBackground>
  )
}
