import { useState } from 'react'

const SIZES = {
  xs: 'w-4 h-4 text-[7px]',
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || name.slice(0, 2).toUpperCase()
}

// Club crest, rounded-square (not circular -- source crests are portrait
// and object-contain, unlike CountryFlag's circular national flags which
// are designed to be cropped). crossOrigin="anonymous" is required for a
// clean html2canvas capture later even though the badge host already sends
// open CORS headers -- any club whose badgeUrl is null (no CORS-safe
// hotlink source available) or whose URL fails to load falls back to a
// monogram (initials) badge in the league's accent color, so one missing
// crest never breaks a card.
export default function ClubBadge({ club, size = 'md', accent = '#12805C', className = '', forceLight = false }) {
  const [failed, setFailed] = useState(false)
  if (!club) return null
  const sizeClass = SIZES[size] || SIZES.md
  const showImage = club.badgeUrl && !failed
  const frameTone = forceLight
    ? 'bg-white border border-charcoal-900/10'
    : 'bg-white dark:bg-night-card border border-charcoal-900/10 dark:border-white/10'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg shadow-depth overflow-hidden shrink-0 ${frameTone} ${sizeClass} ${className}`}
      title={club.name}
      aria-label={club.name}
    >
      {showImage ? (
        <img
          src={club.badgeUrl}
          alt=""
          crossOrigin="anonymous"
          className="w-full h-full object-contain p-0.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="w-full h-full flex items-center justify-center font-display font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {initials(club.name)}
        </span>
      )}
    </span>
  )
}
