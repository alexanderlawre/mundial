import { Redis } from '@upstash/redis'

const kv = Redis.fromEnv()

const MAX_SIMULATIONS = 2000
const SIMULATIONS_KEY = 'mundial:simulations'
const VALID_MODES = ['historic', 'custom', 'wc2026']

function clean(value, maxLen) {
  return typeof value === 'string' ? value.slice(0, maxLen) : ''
}

// POST /api/simulation -- called once per completed tournament (from
// TournamentPlay.jsx, when a run reaches the celebration stage). Public
// endpoint, validated so only well-shaped entries land in the shared log
// that powers the admin breakdown tables.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}
  if (!VALID_MODES.includes(body.mode)) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const entry = {
    mode: body.mode,
    descriptor: clean(String(body.descriptor ?? ''), 50),
    winner: clean(body.winner, 100),
    runnerUp: clean(body.runnerUp, 100),
    third: clean(body.third, 100),
    fourth: clean(body.fourth, 100),
    timestamp: Date.now(),
  }

  try {
    await kv.rpush(SIMULATIONS_KEY, entry)
    await kv.ltrim(SIMULATIONS_KEY, -MAX_SIMULATIONS, -1)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('simulation log failed', err)
    return res.status(500).json({ error: 'Storage error' })
  }
}
