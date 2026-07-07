import { useEffect, useMemo, useRef, useState } from 'react'
import {
  scheduleGroupRounds,
  flattenGroupRounds,
  computeStandings,
  rankThirdPlace,
  buildBracketSlots,
  buildGroupCrisscrossPairs,
  buildWC2026BracketPairs,
  nextRoundPairs,
  roundLabelForTeamCount,
  buildManualResult,
} from '../lib/tournamentEngine'
import { simulateMatch } from '../lib/matchEngine'
import { logSimulationResult } from '../lib/storage'
import MatchCard from './MatchCard'
import GroupTable from './GroupTable'
import BracketView from './BracketView'
import BracketTree from './BracketTree'
import ThirdPlacePicker from './ThirdPlacePicker'
import GroupRankEditor from './GroupRankEditor'
import TournamentSummary from './TournamentSummary'
import SambaButton from './SambaButton'
import CountryFlag from './CountryFlag'
import NavBar from './NavBar'

// Synthetic standings rows for a manually-ranked group -- shaped identically
// to computeStandings()'s output (team/played/won/drawn/lost/gf/ga/gd/points/
// cards/position) so GroupTable, rankThirdPlace, buildGroupCrisscrossPairs
// and buildWC2026BracketPairs all keep working unmodified; they only read
// .team and .points/.gd/.gf for ordering/tie-breaking.
function manualStandingRows(order) {
  const n = order.length
  return order.map((name, i) => ({
    team: name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: (n - i) * 3,
    cards: 0,
    position: i + 1,
  }))
}

// Read-only view of a manually-ranked group: just the teams in finishing
// order (rank + flag + name) -- no points/W-D-L/GD, since none of that was
// actually played out.
function ManualStandingsList({ letter, order, teamsByName, advanceCount }) {
  return (
    <div className="rounded-2xl bg-white border border-charcoal-900/10 shadow-depth overflow-hidden">
      <div className="px-4 py-2 bg-forest text-white font-display font-semibold">Group {letter}</div>
      <div className="divide-y divide-charcoal-900/5">
        {order.map((name, i) => {
          const team = teamsByName[name]
          const advances = i < advanceCount
          return (
            <div key={name} className={`flex items-center gap-2 px-4 py-2 text-sm ${advances ? 'bg-mint/40' : ''}`}>
              <span className="text-xs text-charcoal-600 w-4">{i + 1}</span>
              {team && <CountryFlag nation={team} size="sm" />}
              {team?.fifaCode && (
                <span className="font-display text-[10px] font-bold tracking-widest text-charcoal-600 bg-charcoal-900/5 rounded px-1.5 py-0.5 w-10 text-center shrink-0 tabular-nums">
                  {team.fifaCode}
                </span>
              )}
              <span className="font-medium truncate">{name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Per-group panel shown when a group is in 'manual' mode: a reorder list
// until confirmed, then a read-only team-order list (no stats) with an Edit toggle.
function ManualGroupPanel({ letter, teams, teamsByName, advanceCount, manualOrder, onConfirm, onBackToPicker }) {
  const [editing, setEditing] = useState(!manualOrder)

  if (editing) {
    return (
      <GroupRankEditor
        teams={teams}
        initialOrder={manualOrder}
        onConfirm={(order) => { onConfirm(order); setEditing(false) }}
        onCancel={manualOrder ? () => setEditing(false) : onBackToPicker}
      />
    )
  }

  return (
    <div className="space-y-2">
      <ManualStandingsList letter={letter} order={manualOrder} teamsByName={teamsByName} advanceCount={advanceCount} />
      <SambaButton size="sm" variant="outline" className="w-full" onClick={() => setEditing(true)}>
        Edit Standings
      </SambaButton>
    </div>
  )
}

// Flattened per-match round shape: { label, matches: [{ id, teamA, teamB,
// label, result, predicted }] }. `label` on an individual match (e.g.
// "Final" / "3rd Place Playoff") overrides the round's own label for display.
function makeRound(label, pairs, customLabels) {
  return {
    label,
    matches: pairs.map((pair, idx) => ({
      id: `${label}-${idx}`,
      teamA: pair[0],
      teamB: pair[1],
      label: customLabels ? customLabels[idx] : null,
      result: null,
      predicted: null,
    })),
  }
}

export default function TournamentPlay({
  initialGroups,       // { A: [team,...], B: [...] } or null
  knockoutOnlyTeams,   // [team,...] used when initialGroups is null
  format,              // { advancePerGroup, bestThirds, has3rdPlace }
  title,
  hostLabel,
  userNation,
  onRestart,
  interactivity = 'full', // 'full' | 'simulateOnly' -- simulateOnly hides all edit/manual-ranking UI (Historic Cups)
  mode,                   // 'historic' | 'custom' | 'wc2026' -- for analytics logging
  descriptor,             // year (historic) / team count (custom) / '2026' (wc2026) -- for analytics logging
}) {
  const teamsByName = useMemo(() => {
    const map = {}
    if (initialGroups) {
      Object.values(initialGroups).forEach((list) => list.forEach((t) => { map[t.name] = t }))
    } else {
      (knockoutOnlyTeams || []).forEach((t) => { map[t.name] = t })
    }
    return map
  }, [initialGroups, knockoutOnlyTeams])

  // ---------- Group stage state ----------
  // Each group's matches are scheduled into matchday rounds (circle method)
  // so every team plays every other team exactly once, in a random round
  // order -- fixtures[letter].pairs is flattened in matchday order, with a
  // parallel .matchday[idx] round index for display.
  const [fixtures] = useState(() => {
    if (!initialGroups) return null
    const obj = {}
    Object.entries(initialGroups).forEach(([letter, teams]) => {
      const rounds = scheduleGroupRounds(teams.map((t) => t.name), 'group-' + letter)
      obj[letter] = flattenGroupRounds(rounds)
    })
    return obj
  })
  const [groupMatches, setGroupMatches] = useState(() => {
    if (!fixtures) return null
    const obj = {}
    Object.keys(fixtures).forEach((letter) => { obj[letter] = fixtures[letter].pairs.map(() => null) })
    return obj
  })

  // Per-group mode ('simulate' | 'manual' | null = undecided) and the
  // confirmed manual finishing order once set. Only relevant when
  // interactivity === 'full'; Historic Cups (simulateOnly) never touch these.
  const [groupMode, setGroupMode] = useState(() => {
    if (!initialGroups) return {}
    const obj = {}
    Object.keys(initialGroups).forEach((letter) => { obj[letter] = null })
    return obj
  })
  const [manualStandings, setManualStandings] = useState({})

  const [stage, setStage] = useState(initialGroups ? 'groups' : 'knockout')
  const [thirdPlaceSelected, setThirdPlaceSelected] = useState([])
  const [rounds, setRounds] = useState(() => {
    if (initialGroups) return null
    const sorted = [...(knockoutOnlyTeams || [])].sort((a, b) => b.rating - a.rating)
    const qualified = sorted.map((t) => ({ team: t.name, groupLetter: null, tier: 0, rating: t.rating }))
    const slots = buildBracketSlots(qualified)
    const pairs = nextRoundPairs(slots)
    return [makeRound(roundLabelForTeamCount(slots.length), pairs)]
  })
  const [bracketHistory, setBracketHistory] = useState([])
  const [champion, setChampion] = useState(null)
  const [runnerUpTeam, setRunnerUpTeam] = useState(null)
  const [thirdPlaceTeam, setThirdPlaceTeam] = useState(null)
  const [fourthPlaceTeam, setFourthPlaceTeam] = useState(null)

  const allGroupMatchesDone = groupMatches
    ? Object.keys(groupMatches).every((letter) => (
        groupMode[letter] === 'manual'
          ? !!manualStandings[letter]
          : groupMatches[letter].every((m) => m !== null)
      ))
    : true

  // Used to disable the top-level "simulate" buttons only when there's
  // nothing left to simulate (manual-mode groups don't count).
  const anySimulatableGroupMatchLeft = groupMatches
    ? Object.entries(groupMatches).some(([letter, arr]) => groupMode[letter] !== 'manual' && arr.some((m) => m === null))
    : false

  function simulateOneGroupMatch() {
    setGroupMatches((prev) => {
      const next = { ...prev }
      for (const letter of Object.keys(next)) {
        if (groupMode[letter] === 'manual') continue
        const arr = [...next[letter]]
        const idx = arr.findIndex((m) => m === null)
        if (idx !== -1) {
          const [nameA, nameB] = fixtures[letter].pairs[idx]
          arr[idx] = simulateMatch(teamsByName[nameA], teamsByName[nameB], { seedKey: letter + idx })
          next[letter] = arr
          return next
        }
      }
      return prev
    })
  }

  function simulateAllGroupMatches() {
    setGroupMatches((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((letter) => {
        if (groupMode[letter] === 'manual') return
        next[letter] = next[letter].map((m, idx) => {
          if (m) return m
          const [nameA, nameB] = fixtures[letter].pairs[idx]
          return simulateMatch(teamsByName[nameA], teamsByName[nameB], { seedKey: letter + idx })
        })
      })
      return next
    })
  }

  // Manual override -- lets the user set/replace the exact scoreline for any
  // group match (played or not) instead of relying on the simulation.
  function editGroupMatchResult(letter, idx, scoreA, scoreB) {
    setGroupMatches((prev) => {
      const next = { ...prev }
      const arr = [...next[letter]]
      const [nameA, nameB] = fixtures[letter].pairs[idx]
      arr[idx] = buildManualResult(nameA, nameB, scoreA, scoreB)
      next[letter] = arr
      return next
    })
  }

  function chooseGroupMode(letter, nextMode) {
    setGroupMode((prev) => ({ ...prev, [letter]: nextMode }))
  }

  function confirmManualStandings(letter, order) {
    setManualStandings((prev) => ({ ...prev, [letter]: order }))
  }

  const groupStandings = useMemo(() => {
    if (!groupMatches || !allGroupMatchesDone) return null
    const out = {}
    Object.entries(initialGroups).forEach(([letter, teams]) => {
      if (groupMode[letter] === 'manual' && manualStandings[letter]) {
        out[letter] = manualStandingRows(manualStandings[letter])
      } else {
        out[letter] = computeStandings(teams.map((t) => t.name), groupMatches[letter])
      }
    })
    return out
  }, [groupMatches, allGroupMatchesDone, initialGroups, groupMode, manualStandings])

  const thirdPlaceRows = useMemo(() => {
    if (!groupStandings || !format.bestThirds) return []
    return Object.entries(groupStandings).map(([letter, rows]) => ({
      ...rows[format.advancePerGroup],
      groupLetter: letter,
      isManual: groupMode[letter] === 'manual',
    }))
  }, [groupStandings, format, groupMode])

  const suggestedThirds = useMemo(() => {
    if (!thirdPlaceRows.length) return []
    return rankThirdPlace(thirdPlaceRows).slice(0, format.bestThirds).map((r) => r.team)
  }, [thirdPlaceRows, format])

  function goToGroupReview() {
    setStage('group_review')
  }

  function proceedFromReview() {
    if (format.bestThirds > 0) {
      setStage('third_place_pick')
    } else {
      startKnockout([])
    }
  }

  function startKnockout(selectedThirds) {
    // The 12-group/8-thirds shape (literal WC2026 mode and the 48-team
    // custom simulator) uses the real-world 2026 FIFA draw structure instead
    // of the generic crisscross (irregular runner-up pairings + a
    // winner-specific third-place eligibility table -- see tournamentEngine).
    const isWC2026Shape = Object.keys(groupStandings).length === 12 && format.bestThirds === 8

    let pairs
    if (isWC2026Shape) {
      const thirdEntries = thirdPlaceRows
        .filter((r) => selectedThirds.includes(r.team))
        .map((r) => ({ team: r.team, groupLetter: r.groupLetter }))
      pairs = buildWC2026BracketPairs(groupStandings, thirdEntries)
    } else {
      let rankedThirds = []
      if (selectedThirds.length) {
        rankedThirds = rankThirdPlace(thirdPlaceRows)
          .map((r) => r.team)
          .filter((name) => selectedThirds.includes(name))
      }
      pairs = buildGroupCrisscrossPairs(groupStandings, format, rankedThirds)
    }
    const roundTeamCount = pairs.length * 2
    setRounds([makeRound(roundLabelForTeamCount(roundTeamCount), pairs)])
    setStage('knockout')
  }

  const currentRound = rounds ? rounds[rounds.length - 1] : null
  const roundComplete = currentRound ? currentRound.matches.every((m) => m.result !== null) : false

  function simulateKnockoutMatchById(id) {
    setRounds((prev) => {
      const next = [...prev]
      const round = { ...next[next.length - 1] }
      round.matches = round.matches.map((m) => {
        if (m.id !== id || m.result) return m
        return { ...m, result: simulateMatch(teamsByName[m.teamA], teamsByName[m.teamB], { knockout: true, seedKey: id }) }
      })
      next[next.length - 1] = round
      return next
    })
  }

  // Manual override -- lets the user set/replace the exact scoreline (and,
  // for a level score, the tiebreak winner) for any match in the current
  // knockout round, instead of relying on the simulation.
  function editKnockoutMatchResult(id, scoreA, scoreB, tiebreakWinner) {
    setRounds((prev) => {
      const next = [...prev]
      const round = { ...next[next.length - 1] }
      round.matches = round.matches.map((m) => (
        m.id !== id ? m : { ...m, result: buildManualResult(m.teamA, m.teamB, scoreA, scoreB, tiebreakWinner) }
      ))
      next[next.length - 1] = round
      return next
    })
  }

  function setKnockoutPrediction(id, teamName) {
    setRounds((prev) => {
      const next = [...prev]
      const round = { ...next[next.length - 1] }
      round.matches = round.matches.map((m) => {
        if (m.id !== id || m.result) return m
        return { ...m, predicted: m.predicted === teamName ? null : teamName }
      })
      next[next.length - 1] = round
      return next
    })
  }

  function simulateOneKnockoutMatch() {
    setRounds((prev) => {
      const next = [...prev]
      const round = { ...next[next.length - 1] }
      const idx = round.matches.findIndex((m) => m.result === null)
      if (idx === -1) return prev
      const m = round.matches[idx]
      const matches = [...round.matches]
      matches[idx] = { ...m, result: simulateMatch(teamsByName[m.teamA], teamsByName[m.teamB], { knockout: true, seedKey: m.id }) }
      round.matches = matches
      next[next.length - 1] = round
      return next
    })
  }

  function simulateAllKnockoutMatches() {
    setRounds((prev) => {
      const next = [...prev]
      const round = { ...next[next.length - 1] }
      round.matches = round.matches.map((m) => (
        m.result ? m : { ...m, result: simulateMatch(teamsByName[m.teamA], teamsByName[m.teamB], { knockout: true, seedKey: m.id }) }
      ))
      next[next.length - 1] = round
      return next
    })
  }

  function continueAfterRound() {
    const round = currentRound
    const resolvedMatches = round.matches.map((m) => ({ teamA: m.teamA, teamB: m.teamB, ...m.result }))
    const hasCustomLabels = round.matches.some((m) => m.label)

    // Archive this round (with per-match custom labels if present, e.g. Final + 3rd Place).
    if (hasCustomLabels) {
      round.matches.forEach((m, idx) => {
        setBracketHistory((prev) => [...prev, { label: m.label, matches: [resolvedMatches[idx]] }])
      })
    } else {
      setBracketHistory((prev) => [...prev, { label: round.label, matches: resolvedMatches }])
    }

    // Final round with a 3rd place match bundled in.
    if (hasCustomLabels) {
      const finalIdx = round.matches.findIndex((m) => m.label === 'Final')
      const thirdIdx = round.matches.findIndex((m) => m.label === '3rd Place Playoff')
      const finalMatch = round.matches[finalIdx]
      const finalWinner = finalMatch.result.winner
      setChampion(finalWinner)
      setRunnerUpTeam(finalWinner === finalMatch.teamA ? finalMatch.teamB : finalMatch.teamA)
      if (thirdIdx !== -1) {
        const thirdMatch = round.matches[thirdIdx]
        const thirdWinner = thirdMatch.result.winner
        setThirdPlaceTeam(thirdWinner)
        setFourthPlaceTeam(thirdWinner === thirdMatch.teamA ? thirdMatch.teamB : thirdMatch.teamA)
      }
      setStage('celebration')
      return
    }

    const winners = round.matches.map((m) => m.result.winner || m.teamA)

    if (winners.length === 1) {
      const m = round.matches[0]
      setChampion(winners[0])
      setRunnerUpTeam(winners[0] === m.teamA ? m.teamB : m.teamA)
      setStage('celebration')
      return
    }

    if (round.matches.length === 2 && format.has3rdPlace) {
      // Just completed the Semifinals (4 teams in). Build combined Final + 3rd place round.
      const losers = round.matches.map((m) => (m.result.winner === m.teamA ? m.teamB : m.teamA))
      const pairs = [[losers[0], losers[1]], [winners[0], winners[1]]]
      setRounds((prev) => [...prev, makeRound('Final', pairs, ['3rd Place Playoff', 'Final'])])
      setStage('knockout')
      return
    }

    const pairs = nextRoundPairs(winners)
    setRounds((prev) => [...prev, makeRound(roundLabelForTeamCount(winners.length), pairs)])
    setStage('knockout')
  }

  // Log the outcome once, the first time this tournament reaches celebration.
  const loggedRef = useRef(false)
  useEffect(() => {
    if (stage !== 'celebration' || loggedRef.current || !mode) return
    loggedRef.current = true
    logSimulationResult({
      mode,
      descriptor,
      winner: champion,
      runnerUp: runnerUpTeam,
      third: thirdPlaceTeam,
      fourth: fourthPlaceTeam,
    })
  }, [stage, mode, descriptor, champion, runnerUpTeam, thirdPlaceTeam, fourthPlaceTeam])

  // ---------- Render ----------

  if (stage === 'groups') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Header title={title} hostLabel={hostLabel} />
        <div className="flex gap-2 flex-wrap">
          <SambaButton onClick={simulateOneGroupMatch} disabled={!anySimulatableGroupMatchLeft}>Simulate Next Match</SambaButton>
          <SambaButton variant="secondary" onClick={simulateAllGroupMatches} disabled={!anySimulatableGroupMatchLeft}>
            Simulate Rest of Group Stage
          </SambaButton>
          {allGroupMatchesDone && (
            <SambaButton variant="gold" onClick={goToGroupReview}>View Group Results</SambaButton>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(initialGroups).map(([letter, teams]) => {
            const matches = groupMatches[letter]
            const nextIdx = matches.findIndex((m) => m === null)
            const playedIdxs = matches
              .map((m, idx) => idx)
              .filter((idx) => matches[idx] !== null)
              .reverse()
            const mode = groupMode[letter]
            const showManual = interactivity === 'full' && mode === 'manual'
            return (
              <div key={letter} className="rounded-2xl bg-white/70 shadow-depth p-3 space-y-3">
                <p className="font-display font-semibold text-charcoal-900">Group {letter}</p>
                {interactivity === 'full' && (
                  <div className="grid grid-cols-2 gap-2">
                    <SambaButton
                      size="sm"
                      variant={mode === 'manual' ? 'outline' : 'primary'}
                      onClick={() => chooseGroupMode(letter, 'simulate')}
                    >
                      Simulate Matches
                    </SambaButton>
                    <SambaButton
                      size="sm"
                      variant={mode === 'manual' ? 'primary' : 'outline'}
                      onClick={() => chooseGroupMode(letter, 'manual')}
                    >
                      Set Final Standings
                    </SambaButton>
                  </div>
                )}
                {showManual && (
                  <ManualGroupPanel
                    letter={letter}
                    teams={teams}
                    teamsByName={teamsByName}
                    advanceCount={format.advancePerGroup}
                    manualOrder={manualStandings[letter]}
                    onConfirm={(order) => confirmManualStandings(letter, order)}
                    onBackToPicker={() => chooseGroupMode(letter, 'simulate')}
                  />
                )}
                {!showManual && (
                  <>
                    {nextIdx !== -1 && (
                      <MatchCard
                        variant="hero"
                        label={`Matchday ${fixtures[letter].matchday[nextIdx] + 1}`}
                        teamA={teamsByName[fixtures[letter].pairs[nextIdx][0]]}
                        teamB={teamsByName[fixtures[letter].pairs[nextIdx][1]]}
                        onEdit={interactivity === 'full' ? (scoreA, scoreB) => editGroupMatchResult(letter, nextIdx, scoreA, scoreB) : undefined}
                      />
                    )}
                    {playedIdxs.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] uppercase tracking-wide text-charcoal-600/70 font-semibold">Past Results</p>
                        {playedIdxs.map((idx) => (
                          <MatchCard
                            key={idx}
                            variant="compact"
                            label={`Matchday ${fixtures[letter].matchday[idx] + 1}`}
                            match={matches[idx]}
                            teamA={teamsByName[fixtures[letter].pairs[idx][0]]}
                            teamB={teamsByName[fixtures[letter].pairs[idx][1]]}
                            onEdit={interactivity === 'full' ? (scoreA, scoreB) => editGroupMatchResult(letter, idx, scoreA, scoreB) : undefined}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (stage === 'group_review') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Header title={title} hostLabel={hostLabel} subtitle="Group Stage Results" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupStandings).map(([letter, rows]) => (
            groupMode[letter] === 'manual' ? (
              <ManualStandingsList
                key={letter}
                letter={letter}
                order={manualStandings[letter] || rows.map((r) => r.team)}
                teamsByName={teamsByName}
                advanceCount={format.advancePerGroup}
              />
            ) : (
              <GroupTable key={letter} letter={letter} standings={rows} teamsByName={teamsByName} advanceCount={format.advancePerGroup} />
            )
          ))}
        </div>
        <div className="flex justify-center gap-2">
          <SambaButton variant="outline" size="lg" onClick={() => setStage('groups')}>Back to Matches</SambaButton>
          <SambaButton variant="primary" size="lg" onClick={proceedFromReview}>
            {format.bestThirds > 0 ? 'Continue to Third-Place Selection' : 'Continue to Knockouts'}
          </SambaButton>
        </div>
      </div>
    )
  }

  if (stage === 'third_place_pick') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Header title={title} hostLabel={hostLabel} subtitle="Best Third-Place Teams" />
        <ThirdPlacePicker
          rows={thirdPlaceRows}
          teamsByName={teamsByName}
          needed={format.bestThirds}
          selected={thirdPlaceSelected}
          onToggle={(name) => setThirdPlaceSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])}
          onAutoFill={() => setThirdPlaceSelected(suggestedThirds)}
        />
        <div className="flex justify-center">
          <SambaButton
            variant="primary"
            size="lg"
            disabled={thirdPlaceSelected.length !== format.bestThirds}
            onClick={() => startKnockout(thirdPlaceSelected)}
          >
            Confirm &amp; Start Knockouts
          </SambaButton>
        </div>
      </div>
    )
  }

  if (stage === 'knockout') {
    const isFinalRound = currentRound.matches.some((m) => m.label)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Header title={title} hostLabel={hostLabel} subtitle={currentRound.label} />
        <div className="flex gap-2 flex-wrap">
          <SambaButton onClick={simulateOneKnockoutMatch} disabled={roundComplete}>Simulate Next Match</SambaButton>
          <SambaButton variant="secondary" onClick={simulateAllKnockoutMatches} disabled={roundComplete}>
            Simulate Rest of Round
          </SambaButton>
          {roundComplete && (
            <SambaButton variant="gold" onClick={continueAfterRound}>Continue</SambaButton>
          )}
        </div>
        {isFinalRound ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {currentRound.matches.map((m) => (
              <div key={m.id} className="space-y-2">
                <MatchCard
                  variant={m.label === 'Final' ? 'final' : 'bronze'}
                  match={m.result}
                  teamA={teamsByName[m.teamA]}
                  teamB={teamsByName[m.teamB]}
                  requireWinner
                  onEdit={interactivity === 'full' ? (scoreA, scoreB, tiebreakWinner) => editKnockoutMatchResult(m.id, scoreA, scoreB, tiebreakWinner) : undefined}
                />
                {!m.result && (
                  <SambaButton size="sm" variant="outline" className="w-full" onClick={() => simulateKnockoutMatchById(m.id)}>
                    Simulate {m.label}
                  </SambaButton>
                )}
              </div>
            ))}
          </div>
        ) : (
          <BracketTree
            matches={currentRound.matches}
            teamsByName={teamsByName}
            onSimulateMatch={simulateKnockoutMatchById}
            onPredict={setKnockoutPrediction}
            onEditMatch={interactivity === 'full' ? editKnockoutMatchResult : undefined}
          />
        )}
        <BracketView history={bracketHistory} teamsByName={teamsByName} userNation={userNation} />
      </div>
    )
  }

  if (stage === 'celebration') {
    const championTeam = teamsByName[champion]
    const quarterfinalLosers = bracketHistory
      .filter((r) => r.label === 'Quarterfinals')
      .flatMap((r) => r.matches.map((m) => (m.winner === m.teamA ? m.teamB : m.teamA)))
    const roundOf16Losers = bracketHistory
      .filter((r) => r.label === 'Round of 16')
      .flatMap((r) => r.matches.map((m) => (m.winner === m.teamA ? m.teamB : m.teamA)))
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="text-left mb-8">
          <NavBar title={title} subtitle={hostLabel} />
        </div>
        <p className="uppercase tracking-widest text-gold font-semibold mb-3">Champions</p>
        <div className="flex flex-col items-center gap-4 mb-6">
          <CountryFlag nation={championTeam} size="xl" />
          <h1 className="font-display text-4xl font-extrabold text-forest">{champion}</h1>
          <p className="text-charcoal-600">{title}{hostLabel ? ` · ${hostLabel}` : ''}</p>
        </div>
        <div className="mb-6">
          <TournamentSummary
            champion={champion}
            runnerUp={runnerUpTeam}
            thirdPlace={thirdPlaceTeam}
            fourthPlace={fourthPlaceTeam}
            quarterfinalLosers={quarterfinalLosers}
            roundOf16Losers={roundOf16Losers}
            teamsByName={teamsByName}
          />
        </div>
        <BracketView history={bracketHistory} teamsByName={teamsByName} userNation={userNation} />
        <div className="mt-8">
          <SambaButton variant="gold" size="lg" onClick={onRestart}>Simulate Again</SambaButton>
        </div>
      </div>
    )
  }

  return null
}

function Header({ title, hostLabel, subtitle }) {
  return <NavBar title={title} subtitle={subtitle || hostLabel} />
}
