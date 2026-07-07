import { useNavigate } from 'react-router-dom'

// Back arrow (defaults to browser history back) + home icon, shared across
// every page so users can always navigate away without getting stuck.
export default function NavBar({ title, subtitle, onBack }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack || (() => navigate(-1))}
        aria-label="Back"
        className="w-9 h-9 shrink-0 rounded-full bg-white shadow-depth border border-charcoal-900/10 flex items-center justify-center text-charcoal-900 hover:bg-sand active:scale-95 transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      {(title || subtitle) && (
        <div className="flex-1 min-w-0">
          {title && <h1 className="font-display font-bold text-3xl tracking-wide text-forest truncate">{title}</h1>}
          {subtitle && <p className="text-charcoal-600 text-sm truncate">{subtitle}</p>}
        </div>
      )}
      <button
        onClick={() => navigate('/dashboard')}
        aria-label="Home"
        className="w-9 h-9 shrink-0 rounded-full bg-white shadow-depth border border-charcoal-900/10 flex items-center justify-center text-charcoal-900 hover:bg-sand active:scale-95 transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5L12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
        </svg>
      </button>
    </div>
  )
}
