import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { NATIONS } from '../data/nations'
import { breakdown } from '../lib/adminBreakdown'
import { ADMIN_CACHE_KEY } from './Admin'
import AppBackground from '../components/AppBackground'
import CountryFlag from '../components/CountryFlag'

const NATIONS_BY_NAME = Object.fromEntries(NATIONS.map((n) => [n.name, n]))

function readCache() {
  try {
    const raw = localStorage.getItem(ADMIN_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// GET-free "detail" view for a single admin breakdown stat, opened in a new
// tab from the "View All" link on /admin. Reads the same data the admin
// dashboard already fetched (cached to localStorage after a correct password
// was entered in this browser) so it doesn't need its own password prompt.
export default function AdminDetail() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const field = searchParams.get('field')
  const title = searchParams.get('title') || 'Breakdown'

  const cache = useMemo(() => readCache(), [])

  if (!cache) {
    return (
      <AppBackground>
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="font-display font-bold text-2xl text-forest dark:text-mint">No Data Loaded</h1>
          <p className="text-charcoal-600 dark:text-charcoal-300 text-sm">
            Please log into <Link to="/admin" className="text-emerald underline">/admin</Link> first in this
            browser tab, then reopen this link.
          </p>
        </div>
      </AppBackground>
    )
  }

  const entries = (cache.simulations || []).filter((e) => (mode ? e.mode === mode : true))
  const rows = field ? breakdown(entries, field) : []

  return (
    <AppBackground>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div>
          <Link to="/admin" className="text-xs text-forest dark:text-mint font-semibold hover:underline">
            ← Back to Admin
          </Link>
          <h1 className="font-display font-bold text-3xl tracking-wide text-forest dark:text-mint mt-1">{title}</h1>
          <p className="text-charcoal-600 dark:text-charcoal-300 text-sm mt-1">
            Full breakdown — {rows.length} team{rows.length === 1 ? '' : 's'}, {entries.length} run
            {entries.length === 1 ? '' : 's'} total.
            {cache.cachedAt && (
              <> Data cached {new Date(cache.cachedAt).toLocaleString()}.</>
            )}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-night-card border border-charcoal-900/10 dark:border-white/10 shadow-depth overflow-hidden">
          {rows.length === 0 ? (
            <p className="text-sm text-charcoal-600 dark:text-charcoal-300 p-3 italic">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-charcoal-600 dark:text-charcoal-300 text-xs uppercase tracking-wide border-b border-charcoal-900/10 dark:border-white/10">
                  <th className="text-left py-2 pl-3">Team</th>
                  <th className="py-2 text-right pr-2">Count</th>
                  <th className="py-2 text-right pr-3">%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const team = NATIONS_BY_NAME[r.team]
                  return (
                    <tr key={r.team} className="border-b last:border-0 border-charcoal-900/5 dark:border-white/5">
                      <td className="py-2 pl-3 flex items-center gap-2">
                        {team && <CountryFlag nation={team} size="sm" />}
                        <span className="truncate">{r.team}</span>
                      </td>
                      <td className="py-2 text-right pr-2 tabular-nums">{r.count}</td>
                      <td className="py-2 text-right pr-3 tabular-nums">{r.pct.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppBackground>
  )
}
