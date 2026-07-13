import { useEffect, useRef } from 'react'
import CountryFlag from './CountryFlag'
import SambaButton from './SambaButton'
import { roundLabelForTeamCount } from '../lib/tournamentEngine'
import { useTranslation, translateRoundLabel } from '../lib/i18n'

// Precomputes { label, matchCount, customLabels? } for every round from the
// first knockout round down to the Final (+ bundled 3rd Place Playoff, if the
// format has one). The bracket is a fixed single-elimination structure --
// nextRoundPairs() just pairs consecutive winners positionally, there's no
// re-seeding -- so this shape is fully knowable before any knockout match is
// played, which is what lets us render a persistent "TBD" skeleton for
// rounds that haven't been reached yet.
function buildRoundSkeleton(entryCount, has3rdPlace) {
  const rounds = []
  let n = entryCount
  while (n > 4) {
    rounds.push({ label: roundLabelForTeamCount(n), matchCount: n / 2 })
    n = n / 2
  }
  if (n === 4) {
    rounds.push({ label: 'Semifinals', matchCount: 2 })
    rounds.push({
      label: 'Final',
      matchCount: has3rdPlace ? 2 : 1,
      customLabels: has3rdPlace ? ['3rd Place Playoff', 'Final'] : null,
    })
  } else if (n === 2) {
    rounds.push({ label: 'Final', matchCount: 1 })
  }
  return rounds
}

const CARD_BASE = 'rounded-xl border shadow-depth bg-white dark:bg-night-card overflow-hidden'

// Interactive card for the live round. When manual overrides are allowed
// (`onEditMatch` supplied), tapping a team directly sets -- or, for an
// already-played match, overrides -- that team as the winner via a clean
// 1-0 scoreline; no separate score-entry form needed. A "Simulate Match"
// button is still offered for a randomized result. When manual overrides
// aren't allowed (Historic Cups' simulateOnly mode), tapping a team is just
// a cosmetic "predict" highlight, unchanged from before. Bigger circular
// flags for the "poster"-style look.
function LiveMatchCard({ match, teamsByName, onSimulateMatch, onPredict, onEditMatch }) {
  const { t } = useTranslation()
  const teamA = teamsByName[match.teamA]
  const teamB = teamsByName[match.teamB]
  const played = !!match.result
  const editable = typeof onEditMatch === 'function'

  function handleTeamClick(isTeamA) {
    if (editable) {
      onEditMatch(match.id, isTeamA ? 1 : 0, isTeamA ? 0 : 1)
      return
    }
    if (!played) onPredict(match.id, isTeamA ? match.teamA : match.teamB)
  }

  return (
    <div className={`${CARD_BASE} ${played ? 'border-charcoal-900/10 dark:border-white/10' : 'border-gold/40'}`}>
      {match.label && (
        <p className="text-[10px] uppercase tracking-wide text-charcoal-600/70 dark:text-charcoal-300/70 font-semibold px-3 pt-2">{translateRoundLabel(match.label, t)}</p>
      )}
      <div className="px-2.5 py-2 space-y-1">
        {[teamA, teamB].map((team, i) => {
          const isWinner = played && match.result.winner === team.name
          const isPredicted = !editable && match.predicted === team.name
          const clickable = editable || !played
          return (
            <button
              key={team.name}
              type="button"
              disabled={!clickable}
              onClick={() => handleTeamClick(i === 0)}
              className={`w-full flex items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors
                ${isWinner ? 'bg-mint/60 font-bold' : ''}
                ${!played && isPredicted ? 'ring-2 ring-gold bg-gold/10' : ''}
                ${clickable ? 'hover:bg-sand dark:hover:bg-night cursor-pointer' : 'cursor-default'}`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <CountryFlag nation={team} size="md" />
                <span className="truncate text-sm text-charcoal-900 dark:text-sand">{team.name}</span>
              </span>
              {played && (
                <span className="font-display tabular-nums font-semibold shrink-0 text-charcoal-900 dark:text-sand">
                  {i === 0 ? match.result.scoreA : match.result.scoreB}
                  {match.result.wentToPenalties && (
                    <span className="text-gold text-xs font-semibold">
                      {' '}({i === 0 ? match.result.penA : match.result.penB})
                    </span>
                  )}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {editable && !played && (
        <p className="px-2.5 pb-1.5 text-[11px] text-charcoal-600/70 dark:text-charcoal-300/70">{t('play.tapToSetWinner')}</p>
      )}
      {!played && (
        <div className="px-2.5 pb-2">
          <SambaButton size="sm" variant="outline" className="w-full" onClick={() => onSimulateMatch(match.id)}>
            {t('play.simulateMatchButton')}
          </SambaButton>
        </div>
      )}
    </div>
  )
}

// Read-only card for an already-completed match.
function ResolvedMatchCard({ match, teamsByName, userNation, roundLabel }) {
  const { t } = useTranslation()
  const teamA = teamsByName[match.teamA] || { name: match.teamA }
  const teamB = teamsByName[match.teamB] || { name: match.teamB }
  const isUserPath = userNation && (match.teamA === userNation || match.teamB === userNation)

  return (
    <div className={`${CARD_BASE} ${isUserPath ? 'border-gold' : 'border-charcoal-900/10 dark:border-white/10'}`}>
      {roundLabel && (
        <p className="text-[10px] uppercase tracking-wide text-charcoal-600/70 dark:text-charcoal-300/70 font-semibold px-3 pt-2">{translateRoundLabel(roundLabel, t)}</p>
      )}
      <div className="px-2.5 py-2 space-y-1">
        {[teamA, teamB].map((team, i) => {
          const isWinner = match.winner === team.name
          return (
            <div
              key={team.name}
              className={`w-full flex items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 ${isWinner ? 'bg-mint/60 font-bold' : ''}`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <CountryFlag nation={team} size="md" />
                <span className="truncate text-sm text-charcoal-900 dark:text-sand">{team.name}</span>
              </span>
              <span className="font-display tabular-nums font-semibold shrink-0 text-charcoal-900 dark:text-sand">
                {i === 0 ? match.scoreA : match.scoreB}
                {match.wentToPenalties && (
                  <span className="text-gold text-xs font-semibold">
                    {' '}({i === 0 ? match.penA : match.penB})
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Non-interactive placeholder for a round that hasn't been reached yet.
function PlaceholderMatchCard({ roundLabel }) {
  const { t } = useTranslation()
  return (
    <div className={`${CARD_BASE} border-charcoal-900/10 dark:border-white/10 opacity-50`}>
      {roundLabel && (
        <p className="text-[10px] uppercase tracking-wide text-charcoal-600/70 dark:text-charcoal-300/70 font-semibold px-3 pt-2">{translateRoundLabel(roundLabel, t)}</p>
      )}
      <div className="px-2.5 py-2 space-y-1">
        {[0, 1].map((i) => (
          <div key={i} className="w-full flex items-center gap-2 rounded-lg px-1.5 py-1.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-charcoal-900/20 dark:border-white/20 shrink-0" />
            <span className="text-sm text-charcoal-600 dark:text-charcoal-300">{t('play.tbd')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Persistent, full-tournament bracket: every round from the first knockout
// round through the Final (+ 3rd Place Playoff) is shown at once, left-aligned
// in horizontally-scrollable columns -- played rounds resolved, the live round
// interactive, future rounds greyed "TBD" placeholders.
export default function KnockoutBracket({
  bracketHistory,
  currentRound,
  entryCount,
  has3rdPlace,
  teamsByName,
  onSimulateMatch,
  onPredict,
  onEditMatch,
  userNation,
}) {
  const { t } = useTranslation()
  const skeleton = buildRoundSkeleton(entryCount, has3rdPlace)
  const liveColumnRef = useRef(null)

  useEffect(() => {
    liveColumnRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [currentRound?.label])

  const historyByLabel = {}
  ;(bracketHistory || []).forEach((round) => { historyByLabel[round.label] = round })

  return (
    <div className="rounded-2xl bg-white dark:bg-night-card border border-charcoal-900/10 dark:border-white/10 shadow-depth overflow-hidden">
      <div className="px-4 py-3 bg-forest text-white font-display font-semibold">
        {t('play.tournamentBracket')}
      </div>
      <div className="overflow-x-auto -mx-0 px-4 py-4 snap-x snap-mandatory">
        <div className="flex items-start gap-4">
          {skeleton.map((col) => {
            const isLiveColumn = currentRound && !col.customLabels && currentRound.label === col.label
            const isLiveFinalColumn = currentRound && col.customLabels && currentRound.matches.some((m) => m.label)
            const ref = (isLiveColumn || isLiveFinalColumn) ? liveColumnRef : null

            let cards
            if (col.customLabels) {
              cards = col.customLabels.map((overrideLabel) => {
                const resolvedRound = historyByLabel[overrideLabel]
                if (resolvedRound) {
                  return <ResolvedMatchCard key={overrideLabel} match={resolvedRound.matches[0]} teamsByName={teamsByName} userNation={userNation} roundLabel={overrideLabel} />
                }
                const liveMatch = currentRound?.matches.find((m) => m.label === overrideLabel)
                if (liveMatch) {
                  return (
                    <LiveMatchCard
                      key={overrideLabel}
                      match={liveMatch}
                      teamsByName={teamsByName}
                      onSimulateMatch={onSimulateMatch}
                      onPredict={onPredict}
                      onEditMatch={onEditMatch}
                    />
                  )
                }
                return <PlaceholderMatchCard key={overrideLabel} roundLabel={overrideLabel} />
              })
            } else {
              const resolvedRound = historyByLabel[col.label]
              if (resolvedRound) {
                cards = resolvedRound.matches.map((m, i) => (
                  <ResolvedMatchCard key={i} match={m} teamsByName={teamsByName} userNation={userNation} roundLabel={i === 0 ? col.label : null} />
                ))
              } else if (isLiveColumn) {
                // Normal (non-bundled) rounds always have `m.label === null`
                // -- the column header below already shows the round name --
                // so LiveMatchCard's own per-match label stays hidden here.
                cards = currentRound.matches.map((m) => (
                  <LiveMatchCard
                    key={m.id}
                    match={m}
                    teamsByName={teamsByName}
                    onSimulateMatch={onSimulateMatch}
                    onPredict={onPredict}
                    onEditMatch={onEditMatch}
                  />
                ))
              } else {
                cards = Array.from({ length: col.matchCount }, (_, i) => (
                  <PlaceholderMatchCard key={i} roundLabel={i === 0 ? col.label : null} />
                ))
              }
            }

            return (
              <div key={col.label + (col.customLabels ? '-final' : '')} ref={ref} className="shrink-0 w-56 snap-center space-y-3">
                {!col.customLabels && (
                  <p className="text-xs uppercase tracking-wide text-charcoal-600 dark:text-charcoal-300 font-semibold text-center">
                    {translateRoundLabel(col.label, t)}
                  </p>
                )}
                <div className="space-y-3">{cards}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
