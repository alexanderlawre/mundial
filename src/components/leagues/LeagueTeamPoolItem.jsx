import { useDraggable } from '@dnd-kit/core'
import ClubBadge from './ClubBadge'

// One draggable chip in the alphabetical unplaced-clubs pool. The pool is
// always alphabetical and never internally reordered -- clubs only ever
// leave it (dragged onto a table slot) or return to it (dragged back, or
// bumped out by a swap), always re-inserted at their correct alphabetical
// spot by the parent board's derived-pool logic.
//
// Doubles as a click target: tapping a chip selects it (parent highlights
// it via `selected`), then tapping a table slot places it there -- an
// accessible, no-drag-required alternative to dragging, especially handy
// on small touch screens. `stopPropagation` keeps the click from also
// bubbling to the pool container's own "click empty area to unplace"
// handler.
//
// `touch-pan-y` (not `touch-none`) on the draggable node: dnd-kit's
// TouchSensor already uses a `delay` + `tolerance` activation constraint
// (see the board's sensor config) specifically so it can tell a scroll
// gesture apart from a drag -- a touch that moves before the delay elapses
// is treated as a scroll, one that holds still past it starts a drag. With
// `touch-none` the browser refuses to scroll at all the instant a finger
// lands on ANY chip, which is what made the pool feel like it "caught" on
// every button; `touch-pan-y` lets vertical scrolling pass straight
// through while still leaving dnd-kit free to claim the gesture once its
// own delay/tolerance decides it's a drag.
export default function LeagueTeamPoolItem({ club, accent, selected, onClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-${club.key}`,
    data: { type: 'pool', clubKey: club.key },
  })

  function handleClick(e) {
    e.stopPropagation()
    onClick?.()
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-night-card/90 border shadow-depth cursor-grab active:cursor-grabbing select-none touch-pan-y
        ${selected ? 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-500/5' : 'border-charcoal-900/10 dark:border-white/10'}
        ${isDragging ? 'opacity-40' : 'hover:-translate-y-0.5 transition-transform'}`}
    >
      <ClubBadge club={club} size="xs" accent={accent} />
      <span className="text-xs font-medium text-charcoal-900 dark:text-sand truncate max-w-[8rem]">{club.name}</span>
    </div>
  )
}
