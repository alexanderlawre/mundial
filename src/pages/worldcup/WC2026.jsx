import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WC2026_GROUPS, WC2026_HOST } from '../../data/wc2026'
import { buildTeam } from '../../lib/tournamentEngine'
import TournamentPlay from '../../components/worldcup/TournamentPlay'
import AppBackground from '../../components/common/AppBackground'
import { getProfile } from '../../lib/storage'

function buildGroups() {
  const groups = {}
  Object.entries(WC2026_GROUPS).forEach(([letter, names]) => {
    groups[letter] = names.map((n) => buildTeam(n))
  })
  return groups
}

export default function WC2026() {
  const navigate = useNavigate()
  const profile = getProfile()
  const [runKey, setRunKey] = useState(0)
  const [groups] = useState(buildGroups)

  const format = { advancePerGroup: 2, bestThirds: 8, has3rdPlace: true }

  return (
    <AppBackground>
      <TournamentPlay
        key={runKey}
        initialGroups={groups}
        format={format}
        title="World Cup 2026"
        hostLabel={WC2026_HOST}
        userNation={profile?.supportedCountry}
        onRestart={() => setRunKey((k) => k + 1)}
        interactivity="full"
        mode="wc2026"
        descriptor="2026"
      />
    </AppBackground>
  )
}
