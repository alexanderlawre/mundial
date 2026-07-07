import { kv } from '@vercel/kv'

const SIGNUPS_KEY = 'mundial:signups'
const SIMULATIONS_KEY = 'mundial:simulations'

// GET /api/admin-data -- the only place the shared signup/simulation data
// can be read back out. Protected server-side against process.env
// ADMIN_PASSWORD (set in the Vercel dashboard, never shipped to the client
// bundle) -- unlike the old client-side-only password gate, a wrong/missing
// password here genuinely gets no data back, not just a hidden UI.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const password = req.headers['x-admin-password']
  const expected = process.env.ADMIN_PASSWORD

  if (!expected || password !== expected) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const [signups, simulations] = await Promise.all([
      kv.lrange(SIGNUPS_KEY, 0, -1),
      kv.lrange(SIMULATIONS_KEY, 0, -1),
    ])
    return res.status(200).json({ signups, simulations })
  } catch (err) {
    console.error('admin data fetch failed', err)
    return res.status(500).json({ error: 'Storage error' })
  }
}
