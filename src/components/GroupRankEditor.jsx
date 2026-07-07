import { useState } from 'react'
import CountryFlag from './CountryFlag'
import SambaButton from './SambaButton'

function move(arr, idx, dir) {
  const target = idx + dir
  if (target < 0 || target >= arr.length) return arr
  const next = [...arr]
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

// A simple up/down reorder list letting the user manually decide a group's
// final finishing order (1st -> last), instead of simulating matches.
// `teams`: array of nation objects for this group. `initialOrder`: optional
// array of team names to start from (e.g. re-opening a previously confirmed
// order). `onConfirm(orderedNames)` / `onCancel()`.
export default function GroupRankEditor({ teams, initialOrder, onConfirm, onCancel }) {
  const [order, setOrder] = useState(() => initialOrder || teams.map((t) => t.name))
  const byName = Object.fromEntries(teams.map((t) => [t.name, t]))

  return (
    <div className="rounded-xl border border-gold/40 bg-white p-3 space-y-2">
      <p className="text-[11px] uppercase tracking-wide text-charcoal-600/70 font-semibold">
        Set Final Standings (1st to last)
      </p>
      <div className="space-y-1.5">
        {order.map((name, i) => {
          const team = byName[name]
          return (
            <div
              key={name}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-sand/60 border border-charcoal-900/10"
            >
              <span className="text-xs text-charcoal-600 w-4 text-center font-semibold">{i + 1}</span>
              {team && <CountryFlag nation={team} size="sm" />}
              <span className="flex-1 text-sm font-medium truncate">{name}</span>
              <button
                type="button"
                disabled={i === 0}
                onClick={() => setOrder((prev) => move(prev, i, -1))}
                className="w-7 h-7 rounded-md border border-charcoal-900/15 text-charcoal-600 disabled:opacity-30 hover:bg-white"
                aria-label={`Move ${name} up`}
              >
                &uarr;
              </button>
              <button
                type="button"
                disabled={i === order.length - 1}
                onClick={() => setOrder((prev) => move(prev, i, 1))}
                className="w-7 h-7 rounded-md border border-charcoal-900/15 text-charcoal-600 disabled:opacity-30 hover:bg-white"
                aria-label={`Move ${name} down`}
              >
                &darr;
              </button>
            </div>
          )
        })}
      </div>
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <SambaButton size="sm" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </SambaButton>
        )}
        <SambaButton size="sm" variant="gold" className="flex-1" onClick={() => onConfirm(order)}>
          Confirm Standings
        </SambaButton>
      </div>
    </div>
  )
}
