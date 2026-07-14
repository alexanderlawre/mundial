import { useNavigate } from 'react-router-dom'
import { LEAGUES } from '../data/leagues'
import { getLeaguePrediction } from '../lib/storage'
import { getNation } from '../data/nations'
import CountryFlag from '../components/CountryFlag'
import AppBackground from '../components/AppBackground'
import NavBar from '../components/NavBar'
import { useTranslation } from '../lib/i18n'

export default function LeaguesHub() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <AppBackground>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <NavBar title={t('leagues.hubTitle')} subtitle={t('leagues.hubSubtitle')} />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {LEAGUES.map((league) => {
            const prediction = getLeaguePrediction(league.key)
            const nation = getNation(league.country)
            return (
              <button
                key={league.key}
                onClick={() => navigate(`/leagues/${league.key}`)}
                className="text-left rounded-2xl shadow-depth-lg overflow-hidden hover:-translate-y-1 active:scale-[0.98] transition-all"
              >
                <div
                  className="p-5 text-white"
                  style={{ background: `linear-gradient(135deg, ${league.colors.from}, ${league.colors.to})` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CountryFlag nation={nation} size="sm" />
                    {prediction?.confirmed ? (
                      <span className="text-[10px] uppercase tracking-wide font-semibold bg-white/25 rounded-full px-2 py-0.5">
                        {t('leagues.predictionsLocked')}
                      </span>
                    ) : prediction ? (
                      <span className="text-[10px] uppercase tracking-wide font-semibold bg-white/25 rounded-full px-2 py-0.5">
                        {t('leagues.inProgress')}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-display text-2xl font-extrabold">{league.name}</p>
                  <p className="text-white/80 text-xs mt-1">{t('leagues.clubCount', { count: league.clubs.length })}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </AppBackground>
  )
}
