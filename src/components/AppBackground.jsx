// Soft-edged, slowly drifting gradient blobs in the brand palette (forest/
// emerald/gold), giving the app a sense of depth and movement without being
// distracting. Kept low-opacity and blurred, behind all foreground content.

import Footer from './Footer'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'

function Blob({ className, color }) {
  return (
    <div
      className={`pointer-events-none fixed rounded-full blur-3xl ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  )
}

export default function AppBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-sand dark:bg-night overflow-x-hidden flex flex-col transition-colors">
      <Blob className="-top-24 -right-24 w-[32rem] h-[32rem] opacity-30 dark:opacity-20 animate-float" color="#12805C" />
      <Blob className="top-1/3 -left-32 w-[28rem] h-[28rem] opacity-25 dark:opacity-15 animate-float-slow" color="#D4AF37" />
      <Blob className="bottom-[-10rem] right-1/4 w-[26rem] h-[26rem] opacity-25 dark:opacity-15 animate-float" color="#0B3D2E" />
      <Blob className="bottom-0 -left-16 w-72 h-72 opacity-20 dark:opacity-10 animate-float-slow" color="#3E5C3A" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-sand/30 to-sand dark:via-night/30 dark:to-night" />
      <ThemeToggle />
      <LanguageSelector />
      <div className="relative z-10 flex-1">{children}</div>
      <Footer />
    </div>
  )
}
