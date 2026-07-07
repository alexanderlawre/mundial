import { kv } from '@vercel/kv'

const MAX_SIGNUPS = 1000
const SIGNUPS_KEY = 'mundial:signups'

function clean(value, maxLen) {
  return typeof value === 'string' ? value.slice(0, maxLen) : ''
}

// POST /api/signup -- called from the client (Onboarding.jsx) for every new
// profile. Public endpoint (anyone can sign up), but validated/length-capped
// so it can't be used to stuff garbage data. Shared across all visitors --
// this is what makes the admin dashboard a real cross-user leaderboard
// instead of a per-browser localStorage log.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}
  const name = clean(body.name, 200)
  if (!name) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const entry = {
    name,
    email: clean(body.email, 200),
    country: clean(body.country, 100),
    supportedCountry: clean(body.supportedCountry, 100),
    timestamp: Date.now(),
  }

  try {
    await kv.rpush(SIGNUPS_KEY, entry)
    await kv.ltrim(SIGNUPS_KEY, -MAX_SIGNUPS, -1)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('signup log failed', err)
    return res.status(500).json({ error: 'Storage error' })
  }
}
