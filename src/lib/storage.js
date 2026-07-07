const PROFILE_KEY = 'mundial.profile'
const TOURNAMENT_KEY = 'mundial.activeTournament'
const SIGNUPS_KEY = 'mundial.analytics.signups'
const SIMULATIONS_KEY = 'mundial.analytics.simulations'
const MAX_SIGNUPS = 1000
const MAX_SIMULATIONS = 2000

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

// ---------- Analytics (client-side only -- stored per-browser in localStorage,
// not a real cross-device backend. Used to power the /admin dashboard.) ----------

export function logSignup(profile) {
  const list = safeParse(localStorage.getItem(SIGNUPS_KEY), [])
  list.push({ ...profile, timestamp: Date.now() })
  while (list.length > MAX_SIGNUPS) list.shift()
  localStorage.setItem(SIGNUPS_KEY, JSON.stringify(list))
}

export function getSignups() {
  return safeParse(localStorage.getItem(SIGNUPS_KEY), [])
}

// entry: { mode: 'historic' | 'custom' | 'wc2026', descriptor, winner, runnerUp, third, fourth }
export function logSimulationResult(entry) {
  const list = safeParse(localStorage.getItem(SIMULATIONS_KEY), [])
  list.push({ ...entry, timestamp: Date.now() })
  while (list.length > MAX_SIMULATIONS) list.shift()
  localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(list))
}

export function getSimulationLog() {
  return safeParse(localStorage.getItem(SIMULATIONS_KEY), [])
}
