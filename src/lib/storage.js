const PROFILE_KEY = 'mundial.profile'
const TOURNAMENT_KEY = 'mundial.activeTournament'

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function getProfile() {
  return safeParse(localStorage.getItem(PROFILE_KEY), null)
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY)
}

export function getActiveTournament() {
  return safeParse(localStorage.getItem(TOURNAMENT_KEY), null)
}

export function saveActiveTournament(state) {
  localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(state))
}

export function clearActiveTournament() {
  localStorage.removeItem(TOURNAMENT_KEY)
}

// ---------- Analytics (shared across all visitors via serverless API +
// Vercel KV -- see api/signup.js, api/simulation.js, api/admin-data.js.
// Logging calls are fire-and-forget: a network hiccup should never block
// the signup/celebration flow for the user, so failures are swallowed. ----------

export async function logSignup(profile) {
  try {
    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
  } catch {
    // best-effort only
  }
}

// entry: { mode: 'historic' | 'custom' | 'wc2026', descriptor, winner, runnerUp, third, fourth }
export async function logSimulationResult(entry) {
  try {
    await fetch('/api/simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
  } catch {
    // best-effort only
  }
}

// Fetches the full shared signup + simulation log for the admin dashboard.
// The password is checked server-side (api/admin-data.js) against a secret
// env var -- a wrong password genuinely gets no data back, not just a
// hidden UI, unlike the old client-side-only gate.
export async function fetchAdminData(password) {
  try {
    const res = await fetch('/api/admin-data', {
      headers: { 'x-admin-password': password },
    })
    if (res.status === 401) return { ok: false, unauthorized: true }
    if (!res.ok) return { ok: false, unauthorized: false }
    const data = await res.json()
    return { ok: true, signups: data.signups || [], simulations: data.simulations || [] }
  } catch {
    return { ok: false, unauthorized: false }
  }
}
