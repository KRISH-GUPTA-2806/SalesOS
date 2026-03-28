import { useState } from 'react'

export default function AgentPanel({ result, resultHistory, onClose, onSelectHistory }) {
  if (!result) return (
    <div className="glass-card-static p-8 text-center">
      <div className="text-4xl mb-3 float">🤖</div>
      <div className="text-sm font-semibold mb-1" style={{ color: '#94a3b8' }}>AI Agent Output</div>
      <div className="text-xs leading-relaxed" style={{ color: '#475569' }}>
        Click any agent button on a lead card to see results here.
        <br />Try <span className="font-medium" style={{ color: '#06b6d4' }}>Auto Pilot</span> for the full agent chain.
      </div>
    </div>
  )

  const { type, company, data } = result

  return (
    <div className="glass-card-static slide-in" style={{ overflow: 'hidden' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">{typeIcon(type)}</span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: typeColor(type) }}>{typeLabel(type)}</span>
          <span className="text-xs font-medium" style={{ color: '#cbd5e1' }}>· {company}</span>
        </div>
        <button onClick={onClose} className="text-xs px-2 py-1 rounded-md hover:bg-white/10 transition-colors" style={{ color: '#64748b' }}>✕</button>
      </div>

      {resultHistory.length > 1 && (
        <div className="flex gap-1 px-4 py-2 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {resultHistory.map((h, i) => {
            const isActive = h === result
            return (
              <button
                key={i}
                onClick={() => onSelectHistory(i)}
                className="text-xs px-2 py-1 rounded-md whitespace-nowrap transition-all"
                style={{
                  background: isActive ? `${typeColor(h.type)}20` : 'transparent',
                  color: isActive ? typeColor(h.type) : '#475569',
                  border: `1px solid ${isActive ? `${typeColor(h.type)}30` : 'transparent'}`,
                }}
              >
                {typeIcon(h.type)} {h.company}
              </button>
            )
          })}
        </div>
      )}

      <div className="p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
        <ResultBody type={type} data={data} />
      </div>
    </div>
  )
}

function ResultBody({ type, data }) {
  if (type === 'research') {
    return (
      <div className="space-y-4">
        <ScoreRow score={data.fitScore ?? 0} label="Fit Score" />
        {data.overview && <Field label="Overview" value={data.overview} />}
        {data.outreachAngle && <Field label="Outreach Angle" value={data.outreachAngle} highlight />}
        {data.painPoints && <ListField label="Pain Points" items={data.painPoints} color="#ef4444" />}
        {data.buyingSignals && <ListField label="Buying Signals" items={data.buyingSignals} color="#10b981" />}
        {data.techStack && <TagField label="Tech Stack" items={data.techStack} />}
        {data.recentNews && <ListField label="Recent News" items={data.recentNews} color="#6366f1" />}
        {data.competitorRisk && <Field label="Competitor Risk" value={String(data.competitorRisk).toUpperCase()} />}
      </div>
    )
  }
  if (type === 'outreach') {
    return (
      <div className="space-y-4">
        {data.subject && <Field label="Subject Line" value={data.subject} highlight />}
        {data.email && <EmailBlock label="Cold Email" content={data.email} />}
        {data.linkedin && <EmailBlock label="LinkedIn Message" content={data.linkedin} />}
        {data.callScript && <Field label="Call Opening" value={data.callScript} />}
        {data.followUp1 && <EmailBlock label="Follow-up Day 3" content={data.followUp1} />}
        {data.followUp2 && <EmailBlock label="Follow-up Day 7" content={data.followUp2} />}
      </div>
    )
  }
  if (type === 'risk') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ScoreRow score={data.riskScore ?? 0} label="Risk Score" invert />
          {data.urgency && <span className="text-xs px-2 py-1 rounded-full font-semibold uppercase" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>{data.urgency}</span>}
        </div>
        {data.reasons && <ListField label="Risk Reasons" items={data.reasons} color="#ef4444" />}
        {data.warningSignals && <ListField label="Warning Signals" items={data.warningSignals} color="#f59e0b" />}
        {data.suggestedAction && <Field label="Suggested Action" value={data.suggestedAction} highlight />}
        {data.recoveryPlay && <Field label="Recovery Play" value={data.recoveryPlay} />}
        {data.draftMessage && <EmailBlock label="Draft Re-engagement" content={data.draftMessage} />}
      </div>
    )
  }
  if (type === 'recovery') {
    return (
      <div className="space-y-4">
        {data.successProbability && <Field label="Success Probability" value={String(data.successProbability).toUpperCase()} highlight />}
        {data.hook && <Field label="Hook Used" value={data.hook} />}
        {data.subject && <Field label="Subject Line" value={data.subject} />}
        {data.email && <EmailBlock label="Recovery Email" content={data.email} />}
        {data.incentive && <Field label="Suggested Incentive" value={data.incentive} />}
        {data.alternativePath && <Field label="Alternative Path" value={data.alternativePath} />}
      </div>
    )
  }
  if (type === 'competitive') {
    return (
      <div className="space-y-4">
        {data.competitorOverview && <Field label="Competitor Overview" value={data.competitorOverview} />}
        {data.landmineQuestion && <Field label="Landmine Question" value={data.landmineQuestion} highlight />}
        {data.theirWeaknesses && <ListField label="Their Weaknesses" items={data.theirWeaknesses} color="#ef4444" />}
        {data.ourAdvantages && <ListField label="Our Advantages" items={data.ourAdvantages} color="#10b981" />}
        {data.winningTalkingPoints && <ListField label="Winning Talking Points" items={data.winningTalkingPoints} color="#6366f1" />}
        {data.objections && data.objections.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Objection Handling</div>
            {data.objections.map((o, i) => (
              <div key={i} className="rounded-lg p-3 mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xs mb-1 font-medium" style={{ color: '#ef4444' }}>&quot;{o.objection}&quot;</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>→ {o.response}</div>
              </div>
            ))}
          </div>
        )}
        {data.pricingNote && <Field label="Pricing Note" value={data.pricingNote} />}
      </div>
    )
  }
  if (type === 'forecast') {
    return (
      <div className="space-y-4">
        {data.pipelineHealth != null && <ScoreRow score={data.pipelineHealth} label="Pipeline Health" />}
        {data.totalForecast && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Revenue Forecast</div>
            <div className="grid grid-cols-3 gap-2">
              {['best', 'expected', 'worst'].map(key => {
                const val = data.totalForecast?.[key]
                const colors = { best: '#10b981', expected: '#3b82f6', worst: '#ef4444' }
                return (
                  <div key={key} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs uppercase mb-1" style={{ color: '#64748b' }}>{key}</div>
                    <div className="text-lg font-bold" style={{ color: colors[key] }}>${val ? (val / 1000).toFixed(0) + 'k' : '—'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {data.dealForecasts && data.dealForecasts.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Deal-Level Forecast</div>
            {data.dealForecasts.map((df, i) => (
              <div key={i} className="rounded-lg p-3 mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: '#cbd5e1' }}>{df.company}</span>
                  <span className="text-xs font-bold" style={{ color: (df.winProbability ?? 0) >= 70 ? '#10b981' : (df.winProbability ?? 0) >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {df.winProbability}% win
                  </span>
                </div>
                {df.estimatedClose && <div className="text-xs" style={{ color: '#64748b' }}>Close: {df.estimatedClose}</div>}
                {df.nextAction && <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>→ {df.nextAction}</div>}
              </div>
            ))}
          </div>
        )}
        {data.priorityActions && <ListField label="Priority Actions" items={data.priorityActions} color="#f59e0b" />}
        {data.insights && <ListField label="Strategic Insights" items={data.insights} color="#6366f1" />}
      </div>
    )
  }
  return <pre className="text-xs whitespace-pre-wrap" style={{ color: '#94a3b8' }}>{JSON.stringify(data, null, 2)}</pre>
}

function Field({ label, value, highlight }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{label}</div>
      <div className="text-sm leading-relaxed rounded-lg p-3" style={{
        color: '#cbd5e1',
        background: highlight ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${highlight ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)'}`,
      }}>{value}</div>
    </div>
  )
}

function EmailBlock({ label, content }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="copy-parent">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{label}</div>
        <button onClick={handleCopy} className="copy-btn text-xs px-2 py-0.5 rounded-md transition-all"
          style={{ background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', color: copied ? '#10b981' : '#64748b' }}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <div className="text-xs leading-relaxed rounded-lg p-3 whitespace-pre-wrap"
        style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace" }}>
        {content}
      </div>
    </div>
  )
}

function ListField({ label, items, color }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>{label}</div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs flex gap-2 leading-relaxed" style={{ color: '#94a3b8' }}>
            <span style={{ color, flexShrink: 0, marginTop: '2px' }}>▸</span>{item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TagField({ label, items }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function ScoreRow({ score, label, invert }) {
  const pct = Math.min(100, Math.max(0, score))
  const color = invert
    ? pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#10b981'
    : pct > 70 ? '#10b981' : pct > 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs font-medium" style={{ color: '#64748b' }}>{label}</div>
      <div className="flex-1 rounded-full h-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)`, transition: 'width 1s ease-out' }} />
      </div>
      <div className="text-sm font-bold" style={{ color }}>{pct}</div>
    </div>
  )
}

function typeLabel(t) {
  const map = { research: 'Research Agent', outreach: 'Outreach Agent', risk: 'Risk Agent', recovery: 'Recovery Agent', competitive: 'Competitive Agent', forecast: 'Forecast Agent', autopilot: 'Auto Pilot' }
  return map[t] ?? t
}
function typeColor(t) {
  const map = { research: '#6366f1', outreach: '#10b981', risk: '#ef4444', recovery: '#f59e0b', competitive: '#8b5cf6', forecast: '#3b82f6', autopilot: '#06b6d4' }
  return map[t] ?? '#94a3b8'
}
function typeIcon(t) {
  const map = { research: '🔍', outreach: '📧', risk: '⚠️', recovery: '🔄', competitive: '⚔️', forecast: '📊', autopilot: '🚀' }
  return map[t] ?? '🤖'
}
