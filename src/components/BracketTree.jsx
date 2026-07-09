import { useState } from 'react'
import CountryFlag from './CountryFlag'
import SambaButton from './SambaButton'
import ScoreEditForm from './ScoreEditForm'
import { useTranslation } from '../lib/i18n'

// A single knockout match: two tappable rows (tap a team to predict the
// winner before simulating) with scores shown at the bottom once played,
// plus a per-match "Simulate" action. `onEditMatch(id, scoreA, scoreB,
// tiebreakWinner)` -- when supplied, an "Edit/Set Result" toggle lets the
// user set/override the exact scoreline; knockout matches always require a
// winner, so a level score forces a tiebreak pick via ScoreEditForm.
function BracketMatch({ match, teamsByName, onSimulateMatch, onPredict, onEditMatch }) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const teamA = teamsByName[match.teamA]
  const teamB = teamsByName[match.teamB]
  const played = !!match.result
  const editable = typeof onEditMatch === 'function'

  if (editing) {
    return (
      <div className={`rounded-xl border shadow-depth bg-white dark:bg-night-card overflow-hidden p-3 ${played ? 'border-charcoal-900/10 dark:border-white/10' : 'border-gold/40'}`}>
        {match.label && (
          <p className="text-[10px] uppercase tracking-wide text-charcoal-600/70 font-semibold pb-2">{match.label}</p>
        )}
        <ScoreEditForm
          teamA={teamA}
          teamB={teamB}
          initialScoreA={match.result?.scoreA ?? 0}
          initialScoreB={match.result?.scoreB ?? 0}
          requireWinner
          onSave={(scoreA, scoreB, tiebreakWinner) => {
            onEditMatch(match.id, scoreA, scoreB, tiebreakWinner)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className={`rounded-xl border shadow-depth bg-white dark:bg-night-card overflow-hidden ${played ? 'border-charcoal-900/10 dark:border-white/10' : 'border-gold/40'}`}>
      {match.label && (
        <p className="text-[10px] uppercase tracking-wide text-charcoal-600/70 font-semibold px-3 pt-2">{match.label}</p>
      )}
      <div className="px-3 py-2 space-y-1">
        {[teamA, teamB].map((team, i) => {
          const isWinner = played && match.result.winner === team.name
          const isPredicted = match.predicted === team.name
          return (
            <button
              key={team.name}
              type="button"
              disabled={played}
              onClick={() => onPredict(match.id, team.name)}
              className={`w-full flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors
                ${isWinner ? 'bg-mint/60 font-bold' : ''}
                ${!played && isPredicted ? 'ring-2 ring-gold bg-gold/10' : ''}
                ${!played ? 'hover:bg-sand dark:hover:bg-night cursor-pointer' : 'cursor-default'}`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <CountryFlag nation={team} size="sm" />
                <span className="truncate text-sm text-charcoal-900 dark:text-sand">{team.name}</span>
              </span>
              {played && (
                <span className="font-display tabular-nums font-semibold shrink-0">
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
      {!played && (
        <div className="px-3 pb-2">
          <SambaButton size="sm" variant="outline" className="w-full" onClick={() => onSimulateMatch(match.id)}>
            {t('play.simulateMatchButton')}
          </SambaButton>
        </div>
      )}
      {editable && (
        <div className="px-3 pb-2">
          <SambaButton size="sm" variant="outline" className="w-full" onClick={() => setEditing(true)}>
            {played ? t('play.editResult') : t('play.setResult')}
          </SambaButton>
        </div>
      )}
    </div>
  )
}

// matches: [{ id, teamA, teamB, label, result, predicted }]
// Stacked two-column tree: first half of the pairs is the bracket's "Side A",
// second half is "Side B" (buildGroupCrisscrossPairs/buildWC2026BracketPairs/
// nextRoundPairs already preserve this side ordering round to round).
// Once only 2 matches remain (Final + 3rd Place) they render side by side
// instead of split into sides.
export default function BracketTree({ matches, teamsByName, onSimulateMatch, onPredict, onEditMatch }) {
  const { t } = useTranslation()
  if (matches.length <= 2) {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {matches.map((m) => (
          <BracketMatch key={m.id} match={m} teamsByName={teamsByName} onSimulateMatch={onSimulateMatch} onPredict={onPredict} onEditMatch={onEditMatch} />
        ))}
      </div>
    )
  }

  const mid = Math.ceil(matches.length / 2)
  const left = matches.slice(0, mid)
  const right = matches.slice(mid)

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-wide text-charcoal-600/60 font-semibold text-center">{t('play.sideA')}</p>
        {left.map((m) => (
          <BracketMatch key={m.id} match={m} teamsByName={teamsByName} onSimulateMatch={onSimulateMatch} onPredict={onPredict} onEditMatch={onEditMatch} />
        ))}
      </div>
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-wide text-charcoal-600/60 font-semibold text-center">{t('play.sideB')}</p>
        {right.map((m) => (
          <BracketMatch key={m.id} match={m} teamsByName={teamsByName} onSimulateMatch={onSimulateMatch} onPredict={onPredict} onEditMatch={onEditMatch} />
        ))}
      </div>
    </div>
  )
}
