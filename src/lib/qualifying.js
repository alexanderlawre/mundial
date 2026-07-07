import { NATIONS, nationsByConfederation } from '../data/nations'
import { getRating } from '../data/ratings'
import { seededRng } from './nameGenerator'

// Exponential rating-to-weight curve: steep enough that the #1-rated team in
// a confederation's qualifying pool wins one of the quota slots the vast
// majority of the time (~98-99%+), while the weakest, default-rated teams
// have a near-negligible (well under 0.1%, often under 0.01%) chance --
// tuned via Monte Carlo simulation against this app's real confederation
// pool sizes and quotas (UEFA 55 nations/16 slots, CAF 54/9, AFC 46/8,
// CONCACAF 35/6, CONMEBOL 10/6, OFC 11/1). The previous rating^2 weighting
// only produced a ~2x weight spread across a typical 20-point rating gap --
// nowhere close to real-world qualifying odds, where a top-10 side and a
// minnow are practically never fighting for the same slot.
function qualifyingWeight(rating) {
  return Math.exp(rating / 1.25)
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
