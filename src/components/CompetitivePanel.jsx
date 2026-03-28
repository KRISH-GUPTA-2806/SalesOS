import { useState } from 'react'

export default function CompetitivePanel({ onResult, onActivity }) {
  const [competitor, setCompetitor] = useState('')
  const [ourProduct, setOurProduct] = useState('B2B SaaS sales intelligence platform')
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!competitor.trim()) return
    setLoading(true)
    onActivity(`Scanning "${competitor}"...`)
    try {
      const res = await fetch('/api/competitive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitor, ourProduct, dealContext: 'Active enterprise deal' }),
      })
      const json = await res.json()
      if (json.success) {
        onResult(json.data)
        onActivity(`Battlecard ready for ${competitor}`)
      } else {
        onActivity(`Error: ${json.error ?? 'Unknown'}`)
      }
    } catch {
      onActivity('Error generating battlecard')
    }
    setLoading(false)
  }

  return (
    <div className="glass-card-static p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">⚔️</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5cf6' }}>Competitive Intel</span>
      </div>
      <div className="space-y-2 mb-3">
        <input value={competitor} onChange={e => setCompetitor(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="Competitor name (e.g. Salesforce)" className="w-full text-sm px-3 py-2 rounded-lg glass-input" />
        <input value={ourProduct} onChange={e => setOurProduct(e.target.value)}
          placeholder="Your product category" className="w-full text-sm px-3 py-2 rounded-lg glass-input" />
      </div>
      <button onClick={run} disabled={loading || !competitor.trim()}
        className="glow-btn w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
        style={{
          background: loading ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.12)',
          color: !competitor.trim() ? '#475569' : '#a78bfa',
          border: '1px solid rgba(139,92,246,0.25)',
          cursor: loading || !competitor.trim() ? 'not-allowed' : 'pointer',
        }}>
        {loading ? (
          <>
            <svg className="spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.3"/><path d="M12 3a9 9 0 0 1 9 9"/>
            </svg>
            Generating battlecard...
          </>
        ) : '⚔️ Generate Battlecard'}
      </button>
    </div>
  )
}
