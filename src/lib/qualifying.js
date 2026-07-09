import { NATIONS, nationsByConfederation } from '../data/nations'
import { getRating } from '../data/ratings'
import { seededRng } from './nameGenerator'

// Exponential rating-to-weight curve: steep enough that a clear top-tier
// team in a confederation's qualifying pool wins one of the quota slots the
// large majority of the time, while the weakest, default-rated teams still
// have a small but genuinely non-negligible chance -- tuned against this
// app's real confederation pool sizes and quotas (UEFA 55 nations/16 slots,
// CAF 54/9, AFC 46/8, CONCACAF 35/6, CONMEBOL 10/6, OFC 11/1).
//
// Deliberately flatter than an earlier version of this curve (divisor
// 1.25): that version made qualifying odds for anyone outside the top
// ~10-12 rated sides essentially deterministic by rating rank alone, with a
// single 10-point rating gap already implying a ~3000x weight difference.
// Real qualifying campaigns are noisier than that -- unlucky groupings, a
// poor run of form, or a golden generation aging out (Belgium, recent Italy
// squads) can knock out a nominally "strong" side, while a well-drilled
// team just outside the traditional elite (Norway-tier) can reliably grab a
// borderline slot without needing to be a top-10 global power. Divisor 2.1
// was Monte Carlo-checked (see qualifying odds sanity script used during
// development, not shipped) against the UEFA pool specifically: true elite
// sides (France/Spain/England-tier) still qualify essentially every time,
// Italy/Belgium land around 97-99% (very likely, genuinely not automatic),
// Norway lands around 80% (reliable, not guaranteed), and the tightly
// bunched Austria/Serbia/Türkiye/Poland/Sweden/Ukraine band becomes a real
// 40-80% toss-up for the remaining borderline slots.
function qualifyingWeight(rating) {
  return Math.exp(rating / 2.1)
}

// "Simulate qualifying" for one confederation: pick `quota` nations from the
// pool, weighted toward higher-rated teams (so results are plausible) while
// still leaving a sliver of room for surprises further down the rating curve.
export function simulateQualifyingForConfederation(confederation, quota, excludeNames = [], seedKey = 'qual') {
  const rng = seededRng(seedKey + '-' + confederation)
  const pool = nationsByConfederation(confederation)
    .filter((n) => !excludeNames.includes(n.name))
    .map((n) => ({ ...n, rating: getRating(n.name, confederation) }))

  // Weighted sampling without replacement: repeatedly pick from the pool
  // with probability proportional to qualifyingWeight(rating), removing the
  // pick each time.
  const chosen = []
  const remaining = [...pool]
  while (chosen.length < quota && remaining.length > 0) {
    const weights = remaining.map((t) => qualifyingWeight(t.rating))
    const total = weights.reduce((a, b) => a + b, 0)
    let r = rng() * total
    let idx = 0
    for (; idx < weights.length; idx++) {
      r -= weights[idx]
      if (r <= 0) break
    }
    idx = Math.min(idx, remaining.length - 1)
    chosen.push(remaining[idx])
    remaining.splice(idx, 1)
  }
  return chosen
}

export function simulateFullQualifying(quotas, alreadyPicked = [], seedKey = 'qual') {
  const pickedNames = alreadyPicked.map((t) => t.name)
  const result = { ...Object.fromEntries(Object.keys(quotas).map((c) => [c, []])) }
  Object.entries(quotas).forEach(([conf, quota]) => {
    const already = alreadyPicked.filter((t) => t.confederation === conf)
    const remainingQuota = quota - already.length
    const picks = remainingQuota > 0
      ? simulateQualifyingForConfederation(conf, remainingQuota, pickedNames, seedKey)
      : []
    result[conf] = [...already, ...picks]
  })
  return result
}
