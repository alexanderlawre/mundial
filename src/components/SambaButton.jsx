const VARIANTS = {
  primary: 'bg-emerald text-white hover:bg-emerald/90',
  secondary: 'bg-mint text-emerald hover:bg-mint/80',
  gold: 'bg-gradient-to-r from-gold to-gold-light text-charcoal-900 shadow-depth-gold hover:brightness-105',
  outline: 'bg-white text-charcoal-900 border border-charcoal-900/15 hover:bg-sand',
  danger: 'bg-charcoal-900 text-red-400 hover:bg-charcoal-900/90',
}

export default function SambaButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
}) {
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-display font-semibold rounded-2xl shadow-depth transition-all duration-150
        active:scale-[0.97] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant] || VARIANTS.primary} ${sizeClass} ${className}`}
    >
      {children}
    </button>
  )
}
