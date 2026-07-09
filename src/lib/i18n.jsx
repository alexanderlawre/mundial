import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Lightweight, dependency-free i18n: a flat-ish nested dictionary per
// language, a React context + hook, and localStorage persistence. Scope is
// intentionally limited to top-level chrome + core tournament-play flows
// (see plan) -- any key missing from a non-English dictionary silently falls
// back to the English string, and any key missing entirely falls back to the
// key itself so the UI never shows a blank string.

export const LANGUAGES = [
  { code: 'en', label: 'English', flagIso2: 'gb' },
  { code: 'es', label: 'Español', flagIso2: 'es' },
  { code: 'pt', label: 'Português', flagIso2: 'pt' },
  { code: 'fr', label: 'Français', flagIso2: 'fr' },
]

const LANGUAGE_KEY = 'mundial.language'

const en = {
  common: {
    back: 'Back',
    home: 'Home',
  },
  onboarding: {
    subtitle: 'World Cup Simulator',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    supportLabel: 'Country You Support',
    searchPlaceholder: 'Search nations A-Z...',
    all: 'All',
    selected: 'selected',
    noMatch: 'No nations match.',
    enter: 'Enter Mundial',
  },
  dashboard: {
    welcomeName: 'Welcome, {name}',
    welcomeGeneric: 'Welcome to Mundial',
    supporting: 'Supporting {name}',
    resetProfile: 'Reset Profile',
    simulatorTitle: 'World Cup Simulator',
    simulatorDesc: 'Build your own 32 or 48-team World Cup. Pick or simulate qualifying, arrange the draw, and play it out.',
    wc2026Title: 'World Cup 2026',
    wc2026Desc: 'The real 2026 tournament: official 12 groups across the USA, Canada & Mexico.',
    historicTitle: 'Historic World Cups',
    historicDesc: 'Replay any World Cup from 1930 to 2022 with the real qualified teams and host nation.',
  },
  play: {
    group: 'Group {letter}',
    simulateNext: 'Simulate Next Match',
    simulateRestGroup: 'Simulate Rest of Group Stage',
    viewGroupResults: 'View Group Results',
    setFinalStandings: 'Set Final Standings',
    simulateMatches: 'Simulate Matches',
    pastResults: 'Past Results',
    editStandings: 'Edit Standings',
    backToMatches: 'Back to Matches',
    continueThirdPlace: 'Continue to Third-Place Selection',
    continueKnockouts: 'Continue to Knockouts',
    confirmStartKnockouts: 'Confirm & Start Knockouts',
    simulateRestRound: 'Simulate Rest of Round',
    continue: 'Continue',
    simulateMatch: 'Simulate {label}',
    champions: 'Champions',
    simulateAgain: 'Simulate Again',
    groupStageResults: 'Group Stage Results',
    bestThirdPlace: 'Best Third-Place Teams',
    simulateMatchButton: 'Simulate Match',
    editResult: 'Edit Result',
    setResult: 'Set Result',
    sideA: 'Side A',
    sideB: 'Side B',
    tournamentBracket: 'Tournament Bracket',
    hide: 'Hide',
    show: 'Show',
    upNext: 'Up Next',
    noGoals: 'No goals',
    vs: 'vs',
    team: 'Team',
    played: 'P',
    won: 'W',
    drawn: 'D',
    lost: 'L',
    gd: 'GD',
    pts: 'Pts',
    pickBestThirds: 'Pick the best {needed} third-place teams ({selected}/{needed})',
    autoFillBest: 'Auto-fill best {needed}',
    grp: 'Grp {letter}',
    ptsGdGf: '{points} pts · GD {gd} · {gf} GF',
    setFinalStandingsOrder: 'Set Final Standings (1st to last)',
    moveUp: 'Move {name} up',
    moveDown: 'Move {name} down',
    cancel: 'Cancel',
    confirmStandings: 'Confirm Standings',
    levelScorePickWinner: 'Level score \u2014 pick the winner',
    saveResult: 'Save Result',
  },
  rounds: {
    Final: 'Final',
    Semifinals: 'Semifinals',
    Quarterfinals: 'Quarterfinals',
    'Round of 16': 'Round of 16',
    'Round of 32': 'Round of 32',
    '3rd Place Playoff': '3rd Place Playoff',
  },
  summary: {
    finalResults: 'Final Tournament Results',
    winner: 'Winner',
    runnerUp: 'Runner-up',
    thirdPlace: 'Third Place',
    fourthPlace: 'Fourth Place',
    qfExits: 'Quarterfinal Exits',
    r16Exits: 'Round of 16 Exits',
  },
}

const es = {
  common: { back: 'Atrás', home: 'Inicio' },
  onboarding: {
    subtitle: 'Simulador del Mundial',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    supportLabel: 'País que apoyas',
    searchPlaceholder: 'Buscar naciones A-Z...',
    all: 'Todos',
    selected: 'seleccionado',
    noMatch: 'Ninguna nación coincide.',
    enter: 'Entrar a Mundial',
  },
  dashboard: {
    welcomeName: 'Bienvenido, {name}',
    welcomeGeneric: 'Bienvenido a Mundial',
    supporting: 'Apoyando a {name}',
    resetProfile: 'Restablecer Perfil',
    simulatorTitle: 'Simulador del Mundial',
    simulatorDesc: 'Crea tu propio Mundial de 32 u 48 equipos. Elige o simula la clasificación, organiza el sorteo y juégalo.',
    wc2026Title: 'Mundial 2026',
    wc2026Desc: 'El torneo real de 2026: 12 grupos oficiales en EE. UU., Canadá y México.',
    historicTitle: 'Mundiales Históricos',
    historicDesc: 'Revive cualquier Mundial de 1930 a 2022 con los equipos clasificados reales y el país anfitrión.',
  },
  play: {
    group: 'Grupo {letter}',
    simulateNext: 'Simular Siguiente Partido',
    simulateRestGroup: 'Simular Resto de la Fase de Grupos',
    viewGroupResults: 'Ver Resultados de Grupo',
    setFinalStandings: 'Definir Clasificación Final',
    simulateMatches: 'Simular Partidos',
    pastResults: 'Resultados Anteriores',
    editStandings: 'Editar Clasificación',
    backToMatches: 'Volver a los Partidos',
    continueThirdPlace: 'Continuar a Selección de Terceros',
    continueKnockouts: 'Continuar a Eliminatorias',
    confirmStartKnockouts: 'Confirmar e Iniciar Eliminatorias',
    simulateRestRound: 'Simular Resto de la Ronda',
    continue: 'Continuar',
    simulateMatch: 'Simular {label}',
    champions: 'Campeones',
    simulateAgain: 'Simular de Nuevo',
    groupStageResults: 'Resultados de la Fase de Grupos',
    bestThirdPlace: 'Mejores Terceros Lugares',
    simulateMatchButton: 'Simular Partido',
    editResult: 'Editar Resultado',
    setResult: 'Definir Resultado',
    sideA: 'Lado A',
    sideB: 'Lado B',
    tournamentBracket: 'Cuadro del Torneo',
    hide: 'Ocultar',
    show: 'Mostrar',
    upNext: 'Próximo Partido',
    noGoals: 'Sin goles',
    vs: 'vs',
    team: 'Equipo',
    played: 'PJ',
    won: 'G',
    drawn: 'E',
    lost: 'P',
    gd: 'DG',
    pts: 'Pts',
    pickBestThirds: 'Elige los mejores {needed} terceros lugares ({selected}/{needed})',
    autoFillBest: 'Autocompletar los {needed} mejores',
    grp: 'Grp {letter}',
    ptsGdGf: '{points} pts · DG {gd} · {gf} GF',
    setFinalStandingsOrder: 'Definir Clasificación Final (1º al último)',
    moveUp: 'Subir {name}',
    moveDown: 'Bajar {name}',
    cancel: 'Cancelar',
    confirmStandings: 'Confirmar Clasificación',
    levelScorePickWinner: 'Empate \u2014 elige al ganador',
    saveResult: 'Guardar Resultado',
  },
  rounds: {
    Final: 'Final',
    Semifinals: 'Semifinales',
    Quarterfinals: 'Cuartos de Final',
    'Round of 16': 'Octavos de Final',
    'Round of 32': 'Dieciseisavos de Final',
    '3rd Place Playoff': 'Partido por el Tercer Puesto',
  },
  summary: {
    finalResults: 'Resultados Finales del Torneo',
    winner: 'Campeón',
    runnerUp: 'Subcampeón',
    thirdPlace: 'Tercer Lugar',
    fourthPlace: 'Cuarto Lugar',
    qfExits: 'Eliminados en Cuartos de Final',
    r16Exits: 'Eliminados en Octavos de Final',
  },
}

const pt = {
  common: { back: 'Voltar', home: 'Início' },
  onboarding: {
    subtitle: 'Simulador da Copa do Mundo',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome',
    emailLabel: 'E-mail',
    emailPlaceholder: 'voce@exemplo.com',
    supportLabel: 'País que Você Apoia',
    searchPlaceholder: 'Buscar seleções A-Z...',
    all: 'Todos',
    selected: 'selecionado',
    noMatch: 'Nenhuma seleção encontrada.',
    enter: 'Entrar no Mundial',
  },
  dashboard: {
    welcomeName: 'Bem-vindo, {name}',
    welcomeGeneric: 'Bem-vindo ao Mundial',
    supporting: 'Torcendo por {name}',
    resetProfile: 'Redefinir Perfil',
    simulatorTitle: 'Simulador da Copa do Mundo',
    simulatorDesc: 'Monte sua própria Copa do Mundo de 32 ou 48 seleções. Escolha ou simule as eliminatórias, organize o sorteio e jogue.',
    wc2026Title: 'Copa do Mundo 2026',
    wc2026Desc: 'O torneio real de 2026: 12 grupos oficiais nos EUA, Canadá e México.',
    historicTitle: 'Copas do Mundo Históricas',
    historicDesc: 'Reviva qualquer Copa do Mundo de 1930 a 2022 com as seleções classificadas reais e o país-sede.',
  },
  play: {
    group: 'Grupo {letter}',
    simulateNext: 'Simular Próxima Partida',
    simulateRestGroup: 'Simular Resto da Fase de Grupos',
    viewGroupResults: 'Ver Resultados do Grupo',
    setFinalStandings: 'Definir Classificação Final',
    simulateMatches: 'Simular Partidas',
    pastResults: 'Resultados Anteriores',
    editStandings: 'Editar Classificação',
    backToMatches: 'Voltar às Partidas',
    continueThirdPlace: 'Continuar para Seleção de Terceiros',
    continueKnockouts: 'Continuar para o Mata-Mata',
    confirmStartKnockouts: 'Confirmar e Iniciar Mata-Mata',
    simulateRestRound: 'Simular Resto da Rodada',
    continue: 'Continuar',
    simulateMatch: 'Simular {label}',
    champions: 'Campeões',
    simulateAgain: 'Simular Novamente',
    groupStageResults: 'Resultados da Fase de Grupos',
    bestThirdPlace: 'Melhores Terceiros Colocados',
    simulateMatchButton: 'Simular Partida',
    editResult: 'Editar Resultado',
    setResult: 'Definir Resultado',
    sideA: 'Lado A',
    sideB: 'Lado B',
    tournamentBracket: 'Chaveamento do Torneio',
    hide: 'Ocultar',
    show: 'Mostrar',
    upNext: 'Próxima Partida',
    noGoals: 'Sem gols',
    vs: 'x',
    team: 'Seleção',
    played: 'J',
    won: 'V',
    drawn: 'E',
    lost: 'D',
    gd: 'SG',
    pts: 'Pts',
    pickBestThirds: 'Escolha os {needed} melhores terceiros colocados ({selected}/{needed})',
    autoFillBest: 'Preencher automaticamente os {needed} melhores',
    grp: 'Grp {letter}',
    ptsGdGf: '{points} pts · SG {gd} · {gf} GP',
    setFinalStandingsOrder: 'Definir Classificação Final (1º ao último)',
    moveUp: 'Mover {name} para cima',
    moveDown: 'Mover {name} para baixo',
    cancel: 'Cancelar',
    confirmStandings: 'Confirmar Classificação',
    levelScorePickWinner: 'Empate \u2014 escolha o vencedor',
    saveResult: 'Salvar Resultado',
  },
  rounds: {
    Final: 'Final',
    Semifinals: 'Semifinais',
    Quarterfinals: 'Quartas de Final',
    'Round of 16': 'Oitavas de Final',
    'Round of 32': 'Dezesseis-avos de Final',
    '3rd Place Playoff': 'Disputa pelo Terceiro Lugar',
  },
  summary: {
    finalResults: 'Resultados Finais do Torneio',
    winner: 'Campeão',
    runnerUp: 'Vice-campeão',
    thirdPlace: 'Terceiro Lugar',
    fourthPlace: 'Quarto Lugar',
    qfExits: 'Eliminados nas Quartas de Final',
    r16Exits: 'Eliminados nas Oitavas de Final',
  },
}

const fr = {
  common: { back: 'Retour', home: 'Accueil' },
  onboarding: {
    subtitle: 'Simulateur de Coupe du Monde',
    nameLabel: 'Nom',
    namePlaceholder: 'Votre nom',
    emailLabel: 'E-mail',
    emailPlaceholder: 'vous@exemple.com',
    supportLabel: 'Pays que Vous Soutenez',
    searchPlaceholder: 'Rechercher des nations A-Z...',
    all: 'Toutes',
    selected: 'sélectionné',
    noMatch: 'Aucune nation ne correspond.',
    enter: 'Entrer dans Mundial',
  },
  dashboard: {
    welcomeName: 'Bienvenue, {name}',
    welcomeGeneric: 'Bienvenue sur Mundial',
    supporting: 'Vous soutenez {name}',
    resetProfile: 'Réinitialiser le Profil',
    simulatorTitle: 'Simulateur de Coupe du Monde',
    simulatorDesc: 'Créez votre propre Coupe du Monde à 32 ou 48 équipes. Choisissez ou simulez les qualifications, organisez le tirage et jouez.',
    wc2026Title: 'Coupe du Monde 2026',
    wc2026Desc: "Le tournoi réel de 2026 : 12 groupes officiels aux États-Unis, au Canada et au Mexique.",
    historicTitle: 'Coupes du Monde Historiques',
    historicDesc: 'Revivez n\'importe quelle Coupe du Monde de 1930 à 2022 avec les équipes réellement qualifiées et le pays hôte.',
  },
  play: {
    group: 'Groupe {letter}',
    simulateNext: 'Simuler le Prochain Match',
    simulateRestGroup: 'Simuler le Reste de la Phase de Groupes',
    viewGroupResults: 'Voir les Résultats du Groupe',
    setFinalStandings: 'Définir le Classement Final',
    simulateMatches: 'Simuler les Matchs',
    pastResults: 'Résultats Précédents',
    editStandings: 'Modifier le Classement',
    backToMatches: 'Retour aux Matchs',
    continueThirdPlace: 'Continuer vers la Sélection des Troisièmes',
    continueKnockouts: 'Continuer vers les Éliminatoires',
    confirmStartKnockouts: 'Confirmer et Démarrer les Éliminatoires',
    simulateRestRound: 'Simuler le Reste du Tour',
    continue: 'Continuer',
    simulateMatch: 'Simuler {label}',
    champions: 'Champions',
    simulateAgain: 'Simuler à Nouveau',
    groupStageResults: 'Résultats de la Phase de Groupes',
    bestThirdPlace: 'Meilleurs Troisièmes',
    simulateMatchButton: 'Simuler le Match',
    editResult: 'Modifier le Résultat',
    setResult: 'Définir le Résultat',
    sideA: 'Côté A',
    sideB: 'Côté B',
    tournamentBracket: 'Tableau du Tournoi',
    hide: 'Masquer',
    show: 'Afficher',
    upNext: 'Prochain Match',
    noGoals: 'Aucun but',
    vs: 'vs',
    team: 'Équipe',
    played: 'J',
    won: 'G',
    drawn: 'N',
    lost: 'P',
    gd: 'Diff',
    pts: 'Pts',
    pickBestThirds: 'Choisissez les {needed} meilleurs troisièmes ({selected}/{needed})',
    autoFillBest: 'Remplir automatiquement les {needed} meilleurs',
    grp: 'Grp {letter}',
    ptsGdGf: '{points} pts · Diff {gd} · {gf} BP',
    setFinalStandingsOrder: 'Définir le Classement Final (1er au dernier)',
    moveUp: 'Monter {name}',
    moveDown: 'Descendre {name}',
    cancel: 'Annuler',
    confirmStandings: 'Confirmer le Classement',
    levelScorePickWinner: 'Score à égalité \u2014 choisissez le vainqueur',
    saveResult: 'Enregistrer le Résultat',
  },
  rounds: {
    Final: 'Finale',
    Semifinals: 'Demi-finales',
    Quarterfinals: 'Quarts de Finale',
    'Round of 16': 'Huitièmes de Finale',
    'Round of 32': 'Seizièmes de Finale',
    '3rd Place Playoff': 'Match pour la Troisième Place',
  },
  summary: {
    finalResults: 'Résultats Finaux du Tournoi',
    winner: 'Champion',
    runnerUp: 'Finaliste',
    thirdPlace: 'Troisième Place',
    fourthPlace: 'Quatrième Place',
    qfExits: 'Éliminés en Quarts de Finale',
    r16Exits: 'Éliminés en Huitièmes de Finale',
  },
}

const DICTS = { en, es, pt, fr }

function getNested(dict, path) {
  return path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), dict)
}

function interpolate(str, vars) {
  if (!vars) return str
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), str)
}

export function getLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    if (stored && DICTS[stored]) return stored
  } catch {}
  return 'en'
}

export function setStoredLanguage(lang) {
  try { localStorage.setItem(LANGUAGE_KEY, lang) } catch {}
}

// Translates a known round-label string (as produced by
// tournamentEngine.roundLabelForTeamCount / hardcoded '3rd Place Playoff')
// for *display only* -- the underlying English string is still what's stored
// in state and used for equality checks elsewhere, so simulation/bracket
// logic is never affected by the active language.
export function translateRoundLabel(label, t) {
  const known = getNested(DICTS.en.rounds, label) // just checks membership by key existing
  if (known == null) return label
  return t(`rounds.${label}`, null, label)
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => getLanguage())

  useEffect(() => {
    setStoredLanguage(language)
  }, [language])

  const setLanguage = useCallback((lang) => {
    if (DICTS[lang]) setLanguageState(lang)
  }, [])

  const t = useCallback((key, vars, fallback) => {
    const dict = DICTS[language] || DICTS.en
    let val = getNested(dict, key)
    if (val == null) val = getNested(DICTS.en, key)
    if (val == null) val = fallback != null ? fallback : key
    return interpolate(val, vars)
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}
