import { useState } from 'react'
import CountryFlag from '../common/CountryFlag'
import SambaButton from '../common/SambaButton'
import { useTranslation } from '../../lib/i18n'

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
  const { t, tn } = useTranslation()
  const [order, setOrder] = useState(() => initialOrder || teams.map((team) => team.name))
  const byName = Object.fromEntries(teams.map((team) => [team.name, team]))

  return (
    <div className="rounded-xl border border-gold/40 bg-white dark:bg-night-card p-3 space-y-2">
      <p className="text-[11px] uppercase tracking-wide text-charcoal-600/70 font-semibold">
        {t('play.setFinalStandingsOrder')}
      </p>
      <div className="space-y-1.5">
        {order.map((name, i) => {
          const team = byName[name]
          return (
            <div
              key={name}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-sand/60 dark:bg-night/60 border border-charcoal-900/10 dark:border-white/10"
            >
              <span className="text-xs text-charcoal-600 dark:text-charcoal-300 w-4 text-center font-semibold">{i + 1}</span>
              {team && <CountryFlag nation={team} size="sm" />}
              <span className="flex-1 text-sm font-medium text-charcoal-900 dark:text-sand truncate">{tn(name)}</span>
              <button
                type="button"
                disabled={i === 0}
                onClick={() => setOrder((prev) => move(prev, i, -1))}
                className="w-7 h-7 rounded-md border border-charcoal-900/15 dark:border-white/15 text-charcoal-600 dark:text-charcoal-300 disabled:opacity-30 hover:bg-white dark:hover:bg-night-card"
                aria-label={t('play.moveUp', { name })}
              >
                &uarr;
              </button>
              <button
                type="button"
                disabled={i === order.length - 1}
                onClick={() => setOrder((prev) => move(prev, i, 1))}
                className="w-7 h-7 rounded-md border border-charcoal-900/15 dark:border-white/15 text-charcoal-600 dark:text-charcoal-300 disabled:opacity-30 hover:bg-white dark:hover:bg-night-card"
                aria-label={t('play.moveDown', { name })}
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
            {t('play.cancel')}
          </SambaButton>
        )}
        <SambaButton size="sm" variant="gold" className="flex-1" onClick={() => onConfirm(order)}>
          {t('play.confirmStandings')}
        </SambaButton>
      </div>
    </div>
  )
}
