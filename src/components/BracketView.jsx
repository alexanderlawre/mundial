import { useState } from 'react'
import CountryFlag from './CountryFlag'

// history: array of { label, matches: [{teamA, teamB, scoreA, scoreB, wentToPenalties, penA, penB, winner}] }
export default function BracketView({ history, teamsByName, userNation }) {
  const [open, setOpen] = useState(true)
  if (!history || history.length === 0) return null

  return (
    <div className="rounded-2xl bg-white border border-charcoal-900/10 shadow-depth overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-forest text-white font-display font-semibold"
      >
        <span>Tournament Bracket</span>
        <span className="text-mint text-sm">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {history.map((round, ri) => (
            <div key={ri}>
              <p className="text-xs uppercase tracking-wide text-charcoal-600 font-semibold mb-2">{round.label}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {round.matches.map((m, mi) => {
                  const teamA = teamsByName[m.teamA] || { name: m.teamA }
                  const teamB = teamsByName[m.teamB] || { name: m.teamB }
                  const isUserPath = userNation && (m.teamA === userNation || m.teamB === userNation)
                  return (
                    <div
                      key={mi}
                      className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl border ${
                        isUserPath ? 'border-gold bg-gold/10' : 'border-charcoal-900/10 bg-sand/50'
                      }`}
                    >
                      <span className={`flex items-center gap-1.5 truncate flex-1 min-w-0 ${m.winner === teamA.name ? 'font-bold' : ''}`}>
                        <CountryFlag nation={teamA} size="sm" />
                        <span className="font-display text-[10px] font-bold tracking-widest bg-charcoal-900/5 rounded px-1.5 py-0.5 w-10 text-center shrink-0 tabular-nums">
                          {teamA.fifaCode || ''}
                        </span>
                      </span>
                      <span className="font-display tabular-nums font-semibold px-2 shrink-0">
                        {m.scoreA}-{m.scoreB}
                        {m.wentToPenalties && <span className="text-gold text-[10px] ml-1">({m.penA}-{m.penB})</span>}
                      </span>
                      <span className={`flex items-center gap-1.5 truncate flex-row-reverse flex-1 min-w-0 justify-end ${m.winner === teamB.name ? 'font-bold' : ''}`}>
                        <CountryFlag nation={teamB} size="sm" />
                        <span className="font-display text-[10px] font-bold tracking-widest bg-charcoal-900/5 rounded px-1.5 py-0.5 w-10 text-center shrink-0 tabular-nums">
                          {teamB.fifaCode || ''}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
