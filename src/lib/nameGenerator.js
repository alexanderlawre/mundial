// Lightweight plausible-name generator for match scorers/events.
// Mundial simulates at the *team* level (rating + form), not licensed real
// player rosters, so scorers are generated flavor names bucketed by region
// rather than actual individuals -- keeps the simulator legally simple and
// still gives every goal a name.

const POOLS = {
  UEFA: {
    first: ['Luca', 'Marco', 'Erik', 'Jonas', 'Mateo', 'Nils', 'Dino', 'Kian', 'Theo', 'Sander', 'Igor', 'Milan', 'Bruno', 'Rui', 'Ivan'],
    last: ['Novak', 'Berger', 'Lindqvist', 'Moreau', 'Schmidt', 'Kowalski', 'Rossi', 'Horvat', 'Silva', 'Costa', 'Petrov', 'Nagy', 'Dahl', 'Weber', 'Bakker'],
  },
  CONMEBOL: {
    first: ['Thiago', 'Mateo', 'Santiago', 'Emiliano', 'Nicolas', 'Gonzalo', 'Rodrigo', 'Diego', 'Facundo', 'Bruno', 'Lautaro', 'Joaquin'],
    last: ['Fernandez', 'Gutierrez', 'Rojas', 'Herrera', 'Duarte', 'Vidal', 'Aguirre', 'Correa', 'Suarez', 'Ramirez', 'Ibanez', 'Cabrera'],
  },
  CAF: {
    first: ['Amara', 'Kwame', 'Idris', 'Sadio', 'Youssef', 'Karim', 'Bakary', 'Emeka', 'Themba', 'Moussa', 'Omar', 'Chidi'],
    last: ['Diallo', 'Mensah', 'Toure', 'N\'Diaye', 'Boateng', 'Kamara', 'Achebe', 'Okonkwo', 'Traore', 'Sow', 'Camara', 'Diop'],
  },
  AFC: {
    first: ['Haruto', 'Minjun', 'Wei', 'Arif', 'Farid', 'Hiro', 'Jin', 'Rashid', 'Sang', 'Tariq', 'Omar', 'Kenji'],
    last: ['Tanaka', 'Park', 'Chen', 'Rahman', 'Al-Sayed', 'Kobayashi', 'Lee', 'Hassan', 'Nakamura', 'Osman', 'Yamamoto', 'Khan'],
  },
  CONCACAF: {
    first: ['Carlos', 'Andres', 'Jayden', 'Miguel', 'Kevin', 'Luis', 'Devon', 'Jose', 'Tyler', 'Emmanuel', 'Ricardo', 'Elijah'],
    last: ['Martinez', 'Campbell', 'Reyes', 'Brown', 'Cordova', 'Pierre', 'Alvarez', 'Bailey', 'Mejia', 'Thompson', 'Flores', 'James'],
  },
  OFC: {
    first: ['Mana', 'Sione', 'Tavita', 'Api', 'Kalani', 'Levani', 'Semisi', 'Tui'],
    last: ['Tuilagi', 'Fifita', 'Waqa', 'Naupoto', 'Rabuka', 'Havili', 'Tamani', 'Vakaloloma'],
  },
}

function poolFor(confederation) {
  return POOLS[confederation] || POOLS.UEFA
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)]
}

// Simple deterministic-ish RNG seeded by string, so a given team/match keeps
// a stable generated squad rather than re-randomizing on every re-render.
export function seededRng(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return function () {
    h = (Math.imul(h, 1103515245) + 12345) | 0
    return ((h >>> 0) % 100000) / 100000
  }
}

export function generateSquad(nationName, confederation, size = 8) {
  const pool = poolFor(confederation)
  const rng = seededRng(nationName + '-squad')
  const names = new Set()
  let guard = 0
  while (names.size < size && guard < 200) {
    guard++
    names.add(`${pick(pool.first, rng)} ${pick(pool.last, rng)}`)
  }
  return Array.from(names)
}
