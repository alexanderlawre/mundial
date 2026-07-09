// Shared helper for turning a list of simulation log entries into a
// sorted count/percentage breakdown by a given field (winner, runnerUp, etc.)
// Used by both the Admin dashboard (top-N preview) and AdminDetail (full list).
export function breakdown(entries, field) {
  const counts = {}
  entries.forEach((e) => {
    const val = e[field]
    if (!val) return
    counts[val] = (counts[val] || 0) + 1
  })
  const total = entries.length
  return Object.entries(counts)
    .map(([team, count]) => ({ team, count, pct: total ? (count / total) * 100 : 0 }))
    .sort((a, b) => b.count - a.count)
}
