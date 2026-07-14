import CountryFlag from './CountryFlag'
import SambaButton from './SambaButton'
import { useTranslation } from '../lib/i18n'

// rows: array of { team, groupLetter, played, won, drawn, lost, gf, ga, gd, points }
export default function ThirdPlacePicker({ rows, teamsByName, needed, selected, onToggle, onAutoFill }) {
  const { t, tn } = useTranslation()
  return (
    <div className="rounded-2xl bg-white dark:bg-night-card border border-charcoal-900/10 dark:border-white/10 shadow-depth p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-charcoal-900 dark:text-sand">
          {t('play.pickBestThirds', { needed, selected: selected.length })}
        </h3>
        <SambaButton variant="secondary" size="sm" onClick={onAutoFill}>{t('play.autoFillBest', { needed })}</SambaButton>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {rows.map((row) => {
          const team = teamsByName[row.team]
          const isSelected = selected.includes(row.team)
          const disabled = !isSelected && selected.length >= needed
          return (
            <button
              key={row.team}
              disabled={disabled}
              onClick={() => onToggle(row.team)}
              className={`flex items-center gap-3 p-2 rounded-xl border text-left transition-all
                ${isSelected ? 'border-gold ring-2 ring-gold bg-gold/10' : 'border-charcoal-900/10 dark:border-white/10'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {team && <CountryFlag nation={team} size="sm" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal-900 dark:text-sand truncate">{tn(row.team)} <span className="text-charcoal-600 dark:text-charcoal-300 text-xs">({t('play.grp', { letter: row.groupLetter })})</span></p>
                {!row.isManual && (
                  <p className="text-xs text-charcoal-600 dark:text-charcoal-300 tabular-nums">{t('play.ptsGdGf', { points: row.points, gd: row.gd > 0 ? `+${row.gd}` : row.gd, gf: row.gf })}</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
