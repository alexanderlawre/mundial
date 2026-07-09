import { Redis } from '@upstash/redis'

const kv = Redis.fromEnv()

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
//
// Each email may only be logged once: if the same email signs up again
// (e.g. a different browser/device, or cleared localStorage), we don't
// create a second signup record -- we just report back that it's a repeat
// so the caller can still send the visitor on to the dashboard to simulate,
// without double-counting them in the admin data.
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

  const email = clean(body.email, 200)

  try {
    if (email) {
      const existing = await kv.lrange(SIGNUPS_KEY, 0, -1)
      const isDuplicate = existing.some(
        (e) => typeof e?.email === 'string' && e.email.toLowerCase() === email.toLowerCase()
      )
      if (isDuplicate) {
        return res.status(200).json({ ok: true, duplicate: true })
      }
    }

    const entry = {
      name,
      email,
      supportedCountry: clean(body.supportedCountry, 100),
      timestamp: Date.now(),
    }

    await kv.rpush(SIGNUPS_KEY, entry)
    await kv.ltrim(SIGNUPS_KEY, -MAX_SIGNUPS, -1)
    return res.status(200).json({ ok: true, duplicate: false })
  } catch (err) {
    console.error('signup log failed', err)
    return res.status(500).json({ error: 'Storage error' })
  }
}
