// Dark/light mode preference, persisted to localStorage and applied via a
// `dark` class on <html>, matching Tailwind's `darkMode: 'class'` strategy.

const THEME_KEY = 'mundial.theme'

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
}

export function getTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // localStorage unavailable -- fall through to system preference
  }
  return systemPrefersDark() ? 'dark' : 'light'
}

export function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // best-effort persistence only
  }
  applyTheme(theme)
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

// Called once on app boot so the correct class is present before first
// paint (avoids a light-mode flash for users who've chosen dark).
export function initTheme() {
  applyTheme(getTheme())
}
