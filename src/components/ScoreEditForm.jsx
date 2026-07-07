import { useState } from 'react'
import SambaButton from './SambaButton'

// Inline score-entry form used by both group-stage and knockout match cards
// to let the user pick a winner / set an exact scoreline themselves, instead
// of (or overriding) the simulated result. `requireWinner` is set for
// knockout matches -- a level scoreline there needs an explicit tiebreak
// winner (shown as a simple penalty-shootout style pick) since knockout
// matches can't end in a draw.
export default function ScoreEditForm({ teamA, teamB, initialScoreA = 0, initialScoreB = 0, requireWinner = false, onSave, onCancel }) {
  const [scoreA, setScoreA] = useState(initialScoreA)
  const [scoreB, setScoreB] = useState(initialScoreB)
  const [tiebreakWinner, setTiebreakWinner] = useState(null)

  const isTied = Number(scoreA) === Number(scoreB)
  const needsTiebreak = requireWinner && isTied
  const canSave = !needsTiebreak || tiebreakWinner != null

  function handleSave() {
    if (!canSave) return
    onSave(Number(scoreA), Number(scoreB), needsTiebreak ? tiebreakWinner : null)
  }

  return (
    <div className="rounded-xl bg-sand/60 border border-charcoal-900/10 p-3 space-y-3">
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs font-medium text-charcoal-900 truncate flex-1 text-right">{teamA.name}</span>
        <input
          type="number"
          min="0"
          value={scoreA}
          onChange={(e) => setScoreA(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
          className="w-14 text-center rounded-lg border border-charcoal-900/20 bg-white py-1 font-display font-bold tabular-nums"
        />
        <span className="text-charcoal-600 text-xs">&ndash;</span>
        <input
          type="number"
          min="0"
          value={scoreB}
          onChange={(e) => setScoreB(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
          className="w-14 text-center rounded-lg border border-charcoal-900/20 bg-white py-1 font-display font-bold tabular-nums"
        />
        <span className="text-xs font-medium text-charcoal-900 truncate flex-1">{teamB.name}</span>
      </div>

      {needsTiebreak && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wide text-charcoal-600/70 font-semibold text-center">
            Level score &mdash; pick the winner
          </p>
          <div className="flex gap-2">
            <SambaButton
              size="sm"
              variant={tiebreakWinner === teamA.name ? 'gold' : 'outline'}
              className="flex-1"
              onClick={() => setTiebreakWinner(teamA.name)}
            >
              {teamA.name}
            </SambaButton>
            <SambaButton
              size="sm"
              variant={tiebreakWinner === teamB.name ? 'gold' : 'outline'}
              className="flex-1"
              onClick={() => setTiebreakWinner(teamB.name)}
            >
              {teamB.name}
            </SambaButton>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <SambaButton size="sm" variant="primary" className="flex-1" disabled={!canSave} onClick={handleSave}>
          Save Result
        </SambaButton>
        <SambaButton size="sm" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </SambaButton>
      </div>
    </div>
  )
}
