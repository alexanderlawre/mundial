import { createClient } from '@supabase/supabase-js'

// Single shared Supabase client for the whole app -- auth, and the
// per-user tables (profiles, league_predictions, simulation_history).
// Credentials come from Vite env vars (VITE_-prefixed so they're exposed to
// client code at build time); the anon key is designed to be public/
// client-embedded, real protection comes from Postgres Row Level Security
// policies on each table (see the Phase 2 plan for the exact SQL).
//
// If the env vars are missing (e.g. a fresh clone before `.env.local` is
// set up), we still export a client rather than throwing at import time --
// every call site is already wrapped in try/catch (mirroring the existing
// fire-and-forget analytics functions in storage.js), so auth calls simply
// reject cleanly instead of crashing the whole app on load.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are not set -- auth will not work until they are configured in .env.local.')
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-anon-key')
