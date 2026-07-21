import { useRef, useState } from 'react'
import LeagueShareCard from './LeagueShareCard'
import SambaButton from '../common/SambaButton'
import { captureNode, shareOrDownload } from '../../lib/shareImage'
import { useTranslation } from '../../lib/i18n'

const TABS = ['top8', 'full']

// Tab switcher between the two share-card variants. The active card is
// rendered off-screen (fixed pixel width, positioned far outside the
// viewport rather than display:none, since html2canvas needs real layout/
// paint to capture from) so captures are resolution-consistent regardless
// of the viewport size that triggered them.
export default function LeagueShareModal({ league, order, clubs, nation, onClose }) {
  const { t } = useTranslation()
  const [tab, setTab] = useState('top8')
  const [busy, setBusy] = useState(false)
  const cardRef = useRef(null)

  async function handleExport() {
    if (!cardRef.current || busy) return
    setBusy(true)
    try {
      const blob = await captureNode(cardRef.current)
      await shareOrDownload(blob, `mundial-${league.key}-${tab}.png`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white dark:bg-night-card rounded-3xl shadow-depth-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-charcoal-900 dark:text-sand">{t('leagues.shareModalTitle')}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-900/5 dark:hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 p-1 rounded-2xl bg-sand dark:bg-night">
            {TABS.map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`flex-1 py-2 rounded-xl text-sm font-display font-semibold transition-colors
                  ${tab === tb ? 'bg-white dark:bg-night-card text-charcoal-900 dark:text-sand shadow-depth' : 'text-charcoal-600 dark:text-charcoal-300'}`}
              >
                {tb === 'top8' ? t('leagues.shareTop8Title') : t('leagues.shareFullTitle')}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-charcoal-900/10 dark:border-white/10 max-h-[50vh] overflow-y-auto">
            <div className="origin-top-left" style={{ transform: 'scale(0.55)', width: 600, height: 'fit-content' }}>
              <LeagueShareCard league={league} nation={nation} clubs={clubs} order={order} variant={tab} />
            </div>
          </div>

          <div className="flex gap-2">
            <SambaButton variant="outline" className="flex-1" onClick={onClose}>
              {t('leagues.close', null, 'Close')}
            </SambaButton>
            <SambaButton variant="gold" className="flex-1" onClick={handleExport} disabled={busy}>
              {t('leagues.downloadImage')}
            </SambaButton>
          </div>
        </div>
      </div>

      {/* Off-screen full-resolution render used for the actual capture --
          kept far outside the viewport (not display:none) so html2canvas
          has real, painted layout to read from. */}
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <div ref={cardRef}>
          <LeagueShareCard league={league} nation={nation} clubs={clubs} order={order} variant={tab} />
        </div>
      </div>
    </div>
  )
}
