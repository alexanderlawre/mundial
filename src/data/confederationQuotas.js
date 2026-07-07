// Exact confederation quotas as specified for the custom simulator.
export const QUOTAS_48 = {
  UEFA: 16,
  CAF: 9,
  AFC: 8,
  CONMEBOL: 6,
  CONCACAF: 6,
  OFC: 1,
}

export const QUOTAS_32 = {
  UEFA: 13,
  CAF: 6,
  AFC: 4,
  CONMEBOL: 5,
  CONCACAF: 4,
  OFC: 0,
}

// The 48-team format's last 2 slots come from intercontinental playoff paths,
// not direct quotas (QUOTAS_48 above totals 46). Each path is a 3-team mini
// knockout: legs[0] v legs[1] play a semifinal, winner faces legs[2] (the bye
// team) in the final; the final's winner takes the slot.
export const PLAYOFF_PATHS_48 = [
  { id: 'path1', legs: ['OFC', 'CONCACAF', 'CAF'] },
  { id: 'path2', legs: ['CONMEBOL', 'CONCACAF', 'AFC'] },
]

export function getQuotas(teamCount) {
  return teamCount === 48 ? QUOTAS_48 : QUOTAS_32
}

export function totalFromQuotas(quotas) {
  return Object.values(quotas).reduce((a, b) => a + b, 0)
}
