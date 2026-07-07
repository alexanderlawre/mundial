import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TournamentPlay from '../components/TournamentPlay'
import AppBackground from '../components/AppBackground'
import SambaButton from '../components/SambaButton'
import { buildTeam } from '../lib/tournamentEngine'
import { getProfile } from '../lib/storage'

export default function SimulatorPlay() {
  const location = useLocation()
  const navigate = useNavigate()
  const { teamCount, groupNames } = location.state || {}
  const groups = useMemo(() => {
    if (!groupNames) return null
    const result = {}
    Object.entries(groupNames).forEach(([letter, names]) => {
      result[letter] = names.map((n) => buildTeam(n))
    })
    return result
  }, [groupNames])
  const profile = getProfile()

  if (!groups) {
    return (
      <AppBackground>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-charcoal-600 mb-4">No tournament in progress. Please start from setup.</p>
          <SambaButton onClick={() => navigate('/simulator/setup')}>Back to Setup</SambaButton>
        </div>
      </AppBackground>
    )
  }

  const format = teamCount === 48
    ? { advancePerGroup: 2, bestThirds: 8, has3rdPlace: true }
    : { advancePerGroup: 2, bestThirds: 0, has3rdPlace: true }

  return (
    <AppBackground>
      <TournamentPlay
        key={JSON.stringify(groups) /* fresh engine state per new draw */}
        initialGroups={groups}
        format={format}
        title={`Custom World Cup · ${teamCount} Teams`}
        userNation={profile?.supportedCountry}
        onRestart={() => navigate('/simulator/setup')}
        interactivity="full"
        mode="custom"
        descriptor={teamCount}
      />
    </AppBackground>
  )
}
