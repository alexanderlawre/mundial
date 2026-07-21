import { useTranslation } from '../../lib/i18n'

const SIZES = {
  xs: 'w-4 h-4 text-[8px]',
  sm: 'w-6 h-6 text-sm',
  md: 'w-9 h-9 text-lg',
  lg: 'w-14 h-14 text-2xl',
  xl: 'w-20 h-20 text-4xl',
}

export default function CountryFlag({ nation, size = 'md', className = '' }) {
  const { tn } = useTranslation()
  if (!nation) return null
  const sizeClass = SIZES[size] || SIZES.md
  const Custom = nation.customFlag
  const iso = (nation.iso2 || '').toLowerCase()
  const displayName = tn(nation.name)

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white dark:bg-night-card shadow-depth border border-charcoal-900/10 dark:border-white/10 overflow-hidden shrink-0 ${sizeClass} ${className}`}
      title={displayName}
      aria-label={displayName}
    >
      {Custom ? (
        <Custom className="w-full h-full" />
      ) : iso ? (
        <span className={`fi fis fi-${iso} block !w-full !h-full bg-cover bg-center`} />
      ) : (
        <span className="w-full h-full bg-charcoal-100" />
      )}
    </span>
  )
}
