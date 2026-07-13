import CountryFlag from './CountryFlag'
import { useTranslation } from '../lib/i18n'

function PodiumRow({ rank, label, name, teamsByName, highlight }) {
  if (!name) return null
  const team = teamsByName[name]
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
        highlight ? 'bg-gold/15 border border-gold' : 'bg-white/70 dark:bg-night-card/70 border border-charcoal-900/10 dark:border-white/10'
      }`}
    >
      <span className="font-display text-xs font-bold text-charcoal-600 dark:text-charcoal-300 w-6 text-center shrink-0">{rank}</span>
      {team && <CountryFlag nation={team} size="sm" />}
      <span className="text-sm font-semibold flex-1 min-w-0 truncate text-left">{name}</span>
      <span className="text-xs text-charcoal-600 dark:text-charcoal-300 shrink-0">{label}</span>
    </div>
  )
}

// End-of-tournament podium, in order: winner, runner-up, 3rd, 4th. (Each
// team's full path through the tournament -- including where everyone else
// was eliminated -- is shown right below this via the full-bracket
// BracketTree recap, so it isn't duplicated here as a flat list.)
export default function TournamentSummary({
  champion,
  runnerUp,
  thirdPlace,
  fourthPlace,
  teamsByName,
}) {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-night-card/90 border border-charcoal-900/10 dark:border-white/10 shadow-depth p-4 space-y-1.5 text-left">
      <h3 className="font-display font-bold text-charcoal-900 dark:text-sand text-center mb-2.5">{t('summary.finalResults')}</h3>
      <PodiumRow rank={1} label={t('summary.winner')} name={champion} teamsByName={teamsByName} highlight />
      <PodiumRow rank={2} label={t('summary.runnerUp')} name={runnerUp} teamsByName={teamsByName} />
      <PodiumRow rank={3} label={t('summary.thirdPlace')} name={thirdPlace} teamsByName={teamsByName} />
      <PodiumRow rank={4} label={t('summary.fourthPlace')} name={fourthPlace} teamsByName={teamsByName} />
    </div>
  )
}
