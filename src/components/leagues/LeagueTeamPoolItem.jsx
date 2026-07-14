import { useDraggable } from '@dnd-kit/core'
import ClubBadge from './ClubBadge'

// One draggable chip in the alphabetical unplaced-clubs pool. The pool is
// always alphabetical and never internally reordered -- clubs only ever
// leave it (dragged onto a table slot) or return to it (dragged back, or
// bumped out by a swap), always re-inserted at their correct alphabetical
// spot by the parent board's derived-pool logic.
export default function LeagueTeamPoolItem({ club, accent }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-${club.key}`,
    data: { type: 'pool', clubKey: club.key },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-night-card/90 border border-charcoal-900/10 dark:border-white/10 shadow-depth cursor-grab active:cursor-grabbing select-none touch-none
        ${isDragging ? 'opacity-40' : 'hover:-translate-y-0.5 transition-transform'}`}
    >
      <ClubBadge club={club} size="xs" accent={accent} />
      <span className="text-xs font-medium text-charcoal-900 dark:text-sand truncate max-w-[8rem]">{club.name}</span>
    </div>
  )
}
