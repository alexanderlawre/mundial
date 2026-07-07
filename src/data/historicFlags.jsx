// Hand-authored inline SVG flags for nations not covered by the flag-icons
// package: defunct historical nations (real flags, not their modern alias's
// flag) and UK home nations, which compete separately from Great Britain.

export function USSRFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#CC0000" />
      <g fill="#FFD500">
        <path d="M6.4 3.2 L7.1 5.3 L9.3 5.3 L7.5 6.6 L8.2 8.7 L6.4 7.4 L4.6 8.7 L5.3 6.6 L3.5 5.3 L5.7 5.3 Z" />
        <path d="M3.4 10.2 h1.5 v2 h1.3 v1.1 h-1.3 v2.6 l-2.4 2.4 v-2.9 h-1 v-1.1 h1 z" />
        <path d="M2 15 c1.8 0.6 3.6 0.6 5.2 -0.4 c-1.2 1.6 -3.4 2.2 -5.2 1.6 Z" />
      </g>
    </svg>
  )
}

export function YugoslaviaFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#0033A0" />
      <rect width="30" height="13.34" fill="#0033A0" />
      <rect width="30" height="6.67" fill="#0033A0" />
      <rect y="6.67" width="30" height="6.66" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#DA291C" />
      <rect width="30" height="6.67" fill="#DA291C" />
      <g transform="translate(15,10)">
        <polygon
          points="0,-4 0.95,-1.24 3.8,-1.24 1.5,0.47 2.35,3.24 0,1.53 -2.35,3.24 -1.5,0.47 -3.8,-1.24 -0.95,-1.24"
          fill="#DA291C"
          stroke="#FFD500"
          strokeWidth="0.4"
        />
      </g>
    </svg>
  )
}

export function EastGermanyFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="6.67" fill="#000000" />
      <rect y="6.67" width="30" height="6.66" fill="#DA291C" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCC00" />
      <g transform="translate(15,10)">
        <circle r="3.4" fill="#FFCC00" stroke="#000000" strokeWidth="0.25" />
        <circle r="2.6" fill="#DA291C" />
        <path d="M-1.4 0.6 L-0.3 -1.6 L1.4 -1.6 L0.4 0.5 L1.5 2.4 L-0.2 2.4 Z" fill="#FFCC00" />
      </g>
    </svg>
  )
}

export function ZaireFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#00853F" />
      <circle cx="10" cy="10" r="5.2" fill="#FFD500" />
      <g transform="translate(10,10)">
        <path d="M-1.6 3.6 C -1.2 1.2 -0.6 -1.2 1.8 -3.4 L 2.6 -2.6 C 0.6 -0.8 0.1 1.2 -0.3 3.3 Z" fill="#3B2415" />
        <path d="M1.6 -3.6 L3.4 -5.2 L3.9 -4.5 L2.4 -3.1 Z" fill="#CE1126" />
      </g>
    </svg>
  )
}

export function EnglandFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect x="12.5" width="5" height="20" fill="#CE1126" />
      <rect y="7.5" width="30" height="5" fill="#CE1126" />
    </svg>
  )
}

export function ScotlandFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#005EB8" />
      <polygon points="0,0 3,0 30,18 30,20 27,20 0,2" fill="#FFFFFF" />
      <polygon points="30,0 27,0 0,18 0,20 3,20 30,2" fill="#FFFFFF" />
    </svg>
  )
}

export function WalesFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="10" fill="#FFFFFF" />
      <rect y="10" width="30" height="10" fill="#00B140" />
      <g transform="translate(15,10)" fill="#CE1126">
        <path d="M-6 1 C -5 -2 -2 -3.5 0 -3 C 2 -3.5 5 -2 6 1 C 4.5 0.2 3.5 1.6 3 0.6 C 2 1.8 1 0.4 0 1.4 C -1 0.4 -2 1.8 -3 0.6 C -3.5 1.6 -4.5 0.2 -6 1 Z" />
        <path d="M-0.6 -3.2 L0.6 -3.2 L1.4 -5 L-1.4 -5 Z" />
      </g>
    </svg>
  )
}

export function NorthernIrelandFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="30" height="20" fill="#FFFFFF" />
      <polygon points="15,1 16.2,7.5 22.5,7.5 17.4,11.3 19,17.5 15,13.6 11,17.5 12.6,11.3 7.5,7.5 13.8,7.5" fill="none" />
      <rect x="13.5" width="3" height="20" fill="#CE1126" />
      <rect y="8.5" width="30" height="3" fill="#CE1126" />
      <g transform="translate(15,10)">
        <polygon
          points="0,-6 1.4,-2 5.7,-2 2.3,0.4 3.6,4.6 0,2 -3.6,4.6 -2.3,0.4 -5.7,-2 -1.4,-2"
          fill="#FFFFFF"
          stroke="#CE1126"
          strokeWidth="0.5"
        />
        <path
          d="M0 -2.2 c1 0 1.6 0.7 1.6 1.7 c0 0.8 -0.5 1.3 -1 1.6 c0.6 0.2 1.1 0.5 1.1 1.2 c0 0.9 -0.8 1.5 -1.7 1.5 c-1 0 -1.7 -0.6 -1.7 -1.5 c0 -0.7 0.5 -1 1.1 -1.2 c-0.5 -0.3 -1 -0.8 -1 -1.6 c0 -1 0.6 -1.7 1.6 -1.7 Z"
          fill="#CE1126"
        />
      </g>
    </svg>
  )
}
