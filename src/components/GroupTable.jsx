import CountryFlag from './CountryFlag'

export default function GroupTable({ letter, standings, teamsByName, advanceCount = 2 }) {
  return (
    <div className="rounded-2xl bg-white border border-charcoal-900/10 shadow-depth overflow-hidden">
      <div className="px-4 py-2 bg-forest text-white font-display font-semibold">Group {letter}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-charcoal-600 text-xs uppercase tracking-wide border-b border-charcoal-900/10">
            <th className="text-left py-2 pl-4">Team</th>
            <th className="py-2">P</th>
            <th className="py-2">W</th>
            <th className="py-2">D</th>
            <th className="py-2">L</th>
            <th className="py-2">GD</th>
            <th className="py-2 pr-4">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const team = teamsByName[row.team]
            const advances = i < advanceCount
            return (
              <tr
                key={row.team}
                className={`border-b last:border-0 border-charcoal-900/5 tabular-nums ${advances ? 'bg-mint/40' : ''}`}
              >
                <td className="py-2 pl-4 flex items-center gap-2">
                  <span className="text-xs text-charcoal-600 w-4">{i + 1}</span>
                  {team && <CountryFlag nation={team} size="sm" />}
                  {team?.fifaCode && (
                    <span className="font-display text-[10px] font-bold tracking-widest text-charcoal-600 bg-charcoal-900/5 rounded px-1.5 py-0.5 w-10 text-center shrink-0 tabular-nums">
                      {team.fifaCode}
                    </span>
                  )}
                  <span className="font-medium truncate">{row.team}</span>
                </td>
                <td className="text-center">{row.played}</td>
                <td className="text-center">{row.won}</td>
                <td className="text-center">{row.drawn}</td>
                <td className="text-center">{row.lost}</td>
                <td className="text-center">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                <td className="text-center pr-4 font-semibold">{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
