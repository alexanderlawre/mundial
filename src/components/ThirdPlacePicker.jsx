import CountryFlag from './CountryFlag'
import SambaButton from './SambaButton'

// rows: array of { team, groupLetter, played, won, drawn, lost, gf, ga, gd, points }
export default function ThirdPlacePicker({ rows, teamsByName, needed, selected, onToggle, onAutoFill }) {
  return (
    <div className="rounded-2xl bg-white border border-charcoal-900/10 shadow-depth p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-charcoal-900">
          Pick the best {needed} third-place teams ({selected.length}/{needed})
        </h3>
        <SambaButton variant="secondary" size="sm" onClick={onAutoFill}>Auto-fill best {needed}</SambaButton>
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
                ${isSelected ? 'border-gold ring-2 ring-gold bg-gold/10' : 'border-charcoal-900/10'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {team && <CountryFlag nation={team} size="sm" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{row.team} <span className="text-charcoal-600 text-xs">(Grp {row.groupLetter})</span></p>
                {!row.isManual && (
                  <p className="text-xs text-charcoal-600 tabular-nums">{row.points} pts · GD {row.gd > 0 ? `+${row.gd}` : row.gd} · {row.gf} GF</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
