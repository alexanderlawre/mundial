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

function ExitList({ title, names, teamsByName }) {
  if (!names || names.length === 0) return null
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-charcoal-600/70 font-semibold mb-1.5">{title}</p>
      <div className="grid sm:grid-cols-2 gap-1.5">
        {names.map((name) => {
          const team = teamsByName[name]
          return (
            <div
              key={name}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/60 dark:bg-night-card/60 border border-charcoal-900/10 dark:border-white/10"
            >
              {team && <CountryFlag nation={team} size="sm" />}
              <span className="text-sm truncate text-left">{name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// End-of-tournament results, in order: winner, runner-up, 3rd, 4th, then
// which teams exited in the Quarterfinals / Round of 16. Sections for
// 3rd/4th and QF/R16 only render when the format actually produced them
// (some historic/knockout-only formats have fewer rounds).
export default function TournamentSummary({
  champion,
  runnerUp,
  thirdPlace,
  fourthPlace,
  quarterfinalLosers,
  roundOf16Losers,
  teamsByName,
}) {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-night-card/90 border border-charcoal-900/10 dark:border-white/10 shadow-depth p-4 space-y-4 text-left">
      <h3 className="font-display font-bold text-charcoal-900 dark:text-sand text-center">{t('summary.finalResults')}</h3>
      <div className="space-y-1.5">
        <PodiumRow rank={1} label={t('summary.winner')} name={champion} teamsByName={teamsByName} highlight />
        <PodiumRow rank={2} label={t('summary.runnerUp')} name={runnerUp} teamsByName={teamsByName} />
        <PodiumRow rank={3} label={t('summary.thirdPlace')} name={thirdPlace} teamsByName={teamsByName} />
        <PodiumRow rank={4} label={t('summary.fourthPlace')} name={fourthPlace} teamsByName={teamsByName} />
      </div>
      <ExitList title={t('summary.qfExits')} names={quarterfinalLosers} teamsByName={teamsByName} />
      <ExitList title={t('summary.r16Exits')} names={roundOf16Losers} teamsByName={teamsByName} />
    </div>
  )
}
