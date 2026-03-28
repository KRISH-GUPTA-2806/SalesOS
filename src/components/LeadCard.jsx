import { RISK_CONFIG } from '../data/mockData'

function ScoreRing({ score, size = 36, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="score-ring" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          className="score-ring-circle"
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{score}</span>
    </div>
  )
}

export default function LeadCard({ lead, onResearch, onOutreach, onRisk, onRecovery, onAutoPilot, loading, onDragStart }) {
  const risk = RISK_CONFIG[lead.riskLevel]
  const isLoading = loading !== null
  const isCritical = lead.riskLevel === 'critical'
  const initials = lead.company.slice(0, 2).toUpperCase()

  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, lead.id)}
      className={`glass-card p-4 mb-3 risk-border-${lead.riskLevel}`}
      style={{ cursor: 'grab' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${risk.color}30, ${risk.color}10)`,
            color: risk.color,
            border: `1px solid ${risk.color}25`,
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate" style={{ color: '#f1f5f9' }}>{lead.company}</div>
          <div className="text-xs mt-0.5 truncate" style={{ color: '#64748b' }}>{lead.contact} · {lead.role}</div>
        </div>
        <ScoreRing score={lead.score} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
          style={{ background: risk.bg, color: risk.color, ...(isCritical ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}) }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: risk.color }} />
          {risk.label}
        </span>
        <span className="text-sm font-semibold" style={{ color: '#10b981' }}>
          ${(lead.value / 1000).toFixed(0)}k
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
          {lead.industry}
        </span>
        {lead.daysSilent > 0 && (
          <span className="text-xs ml-auto" style={{ color: lead.daysSilent > 7 ? '#ef4444' : '#475569' }}>
            🕐 {lead.daysSilent}d
          </span>
        )}
      </div>

      {/* Note */}
      {lead.note && (
        <div className="text-xs mb-3 leading-relaxed" style={{ color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {lead.note}
        </div>
      )}

      {/* Action buttons */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <ActionBtn label="Research" icon="🔍" onClick={onResearch} loading={loading === 'research'} disabled={isLoading} color="#6366f1" />
        <ActionBtn label="Outreach" icon="📧" onClick={onOutreach} loading={loading === 'outreach'} disabled={isLoading} color="#10b981" />
        <ActionBtn label="Risk" icon="⚠️" onClick={onRisk} loading={loading === 'risk'} disabled={isLoading} color="#ef4444" />
      </div>
      <div className="grid gap-1.5 mt-1.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <ActionBtn label="Recovery" icon="🔄" onClick={onRecovery} loading={loading === 'recovery'} disabled={isLoading} color="#f59e0b" />
        <ActionBtn label="Auto Pilot" icon="🚀" onClick={onAutoPilot} loading={loading === 'autopilot'} disabled={isLoading} color="#06b6d4" highlight />
      </div>
    </div>
  )
}

function ActionBtn({ label, icon, onClick, loading, disabled, color, highlight }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="glow-btn text-xs py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1"
      style={{
        background: loading ? `${color}25` : highlight ? `${color}20` : `${color}12`,
        color: disabled && !loading ? '#374151' : color,
        border: `1px solid ${highlight ? `${color}40` : `${color}20`}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !loading ? 0.4 : 1,
        transition: 'all 150ms ease',
      }}
    >
      {loading ? (
        <>
          <svg className="spinner" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="9" strokeOpacity="0.3"/><path d="M12 3a9 9 0 0 1 9 9"/>
          </svg>
          <span className="truncate">Running...</span>
        </>
      ) : (
        <>
          <span className="text-[10px]">{icon}</span>
          <span className="truncate">{label}</span>
        </>
      )}
    </button>
  )
}
