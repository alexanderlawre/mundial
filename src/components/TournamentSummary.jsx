import CountryFlag from './CountryFlag'

function PodiumRow({ rank, label, name, teamsByName, highlight }) {
  if (!name) return null
  const team = teamsByName[name]
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
        highlight ? 'bg-gold/15 border border-gold' : 'bg-white/70 border border-charcoal-900/10'
      }`}
    >
      <span className="font-display text-xs font-bold text-charcoal-600 w-6 text-center shrink-0">{rank}</span>
      {team && <CountryFlag nation={team} size="sm" />}
      <span className="text-sm font-semibold flex-1 min-w-0 truncate text-left">{name}</span>
      <span className="text-xs text-charcoal-600 shrink-0">{label}</span>
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
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/60 border border-charcoal-900/10"
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
  return (
    <div className="rounded-2xl bg-white/90 border border-charcoal-900/10 shadow-depth p-4 space-y-4 text-left">
      <h3 className="font-display font-bold text-charcoal-900 text-center">Final Tournament Results</h3>
      <div className="space-y-1.5">
        <PodiumRow rank={1} label="Winner" name={champion} teamsByName={teamsByName} highlight />
        <PodiumRow rank={2} label="Runner-up" name={runnerUp} teamsByName={teamsByName} />
        <PodiumRow rank={3} label="Third Place" name={thirdPlace} teamsByName={teamsByName} />
        <PodiumRow rank={4} label="Fourth Place" name={fourthPlace} teamsByName={teamsByName} />
      </div>
      <ExitList title="Quarterfinal Exits" names={quarterfinalLosers} teamsByName={teamsByName} />
      <ExitList title="Round of 16 Exits" names={roundOf16Losers} teamsByName={teamsByName} />
    </div>
  )
}
