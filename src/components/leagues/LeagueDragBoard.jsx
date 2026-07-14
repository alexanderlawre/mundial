import { useState } from 'react'
import { DndContext, PointerSensor, TouchSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import LeagueTableSlot from './LeagueTableSlot'
import LeagueTeamPoolItem from './LeagueTeamPoolItem'
import SambaButton from '../SambaButton'
import { alphabeticalClubKeys, clubsByKey } from '../../data/leagues'
import { useTranslation } from '../../lib/i18n'

const SLOT_COUNT = 20

function PoolArea({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' })
  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-dashed p-3 min-h-[4.5rem] flex flex-wrap gap-2 transition-colors
        ${isOver ? 'border-gold bg-gold/10' : 'border-charcoal-900/15 dark:border-white/15'}`}
    >
      {children}
    </div>
  )
}

// The drag-and-drop engine: a fixed-length 20-slot table (index = rank - 1,
// null = empty) plus an alphabetical pool of unplaced clubs that is NEVER
// stored -- always derived as (all club keys) minus (non-null table
// entries), so table and pool can never desync. Dropping a pool club onto a
// slot fills it (bumping any club already there back to the pool);
// dropping a filled slot onto another slot swaps the two (deliberately not
// a shift-all-rows reorder, which would be disorienting on a 20-row list,
// especially on touch); dropping a filled slot onto the pool area unplaces
// it. Confirming is disabled until every slot is filled. Only rendered
// while editing -- the locked/confirmed view (in LeaguePredict.jsx) mounts
// no DndContext at all, so there's zero accidental-drag risk once done.
export default function LeagueDragBoard({ league, initialOrder, onConfirm }) {
  const { t } = useTranslation()
  const [table, setTable] = useState(() => initialOrder || Array(SLOT_COUNT).fill(null))
  const clubs = clubsByKey(league.key)
  const alphaKeys = alphabeticalClubKeys(league.key)
  const placed = new Set(table.filter(Boolean))
  const pool = alphaKeys.filter((k) => !placed.has(k))
  const allFilled = table.every((k) => k !== null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    const activeData = active.data.current
    const activeIsSlot = activeData?.type === 'slot'
    const activeIsPool = activeData?.type === 'pool'

    if (over.id === 'pool') {
      if (activeIsSlot) {
        setTable((prev) => {
          const next = [...prev]
          next[activeData.index] = null
          return next
        })
      }
      return
    }

    if (!String(over.id).startsWith('slot-')) return
    const targetIndex = Number(String(over.id).slice(5))

    if (activeIsPool) {
      const clubKey = activeData.clubKey
      setTable((prev) => {
        const next = [...prev]
        next[targetIndex] = clubKey
        return next
      })
      return
    }

    if (activeIsSlot) {
      const sourceIndex = activeData.index
      if (sourceIndex === targetIndex) return
      setTable((prev) => {
        const next = [...prev]
        ;[next[sourceIndex], next[targetIndex]] = [next[targetIndex], next[sourceIndex]]
        return next
      })
    }
  }

  return (
    <div className="space-y-5">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} autoScroll>
        <div className="space-y-1.5">
          {table.map((clubKey, i) => (
            <LeagueTableSlot
              key={i}
              index={i}
              club={clubKey ? clubs[clubKey] : null}
              accent={league.colors.accent}
              interactive
              europe={i < 4}
              relegation={i >= SLOT_COUNT - 3}
            />
          ))}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-charcoal-600/70 dark:text-charcoal-300/70 font-semibold mb-2">
            {t('leagues.poolTitle', { count: pool.length })}
          </p>
          <PoolArea>
            {pool.length === 0 ? (
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 italic px-1 py-1">{t('leagues.poolEmpty')}</p>
            ) : (
              pool.map((clubKey) => (
                <LeagueTeamPoolItem key={clubKey} club={clubs[clubKey]} accent={league.colors.accent} />
              ))
            )}
          </PoolArea>
        </div>
      </DndContext>

      <div className="space-y-1.5">
        <SambaButton
          variant="gold"
          className="w-full"
          disabled={!allFilled}
          onClick={() => onConfirm(table)}
        >
          {t('leagues.confirmSelections')}
        </SambaButton>
        {!allFilled && (
          <p className="text-center text-xs text-charcoal-600 dark:text-charcoal-300">
            {t('leagues.confirmRequiresAll', { count: pool.length })}
          </p>
        )}
      </div>
    </div>
  )
}
