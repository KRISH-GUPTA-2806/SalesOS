import { AGENT_CONFIG } from '../data/mockData'

export default function ActivityFeed({ items, isRunning }) {
  return (
    <div className="glass-card-static flex flex-col" style={{ height: '100%' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-2 h-2 rounded-full"
          style={{ background: isRunning ? '#10b981' : '#334155', ...(isRunning ? { animation: 'pulse-dot 1.5s ease-in-out infinite' } : {}) }}
        />
        <span className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>Agent Activity</span>
        <span className="text-xs ml-auto px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
          {items.length}
        </span>
        {isRunning && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>Live</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: '400px' }}>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">📡</div>
            <div className="text-sm" style={{ color: '#475569' }}>No activity yet. Click an agent button to start.</div>
          </div>
        ) : (
          <div className="space-y-1">
            {[...items].reverse().map(item => {
              const cfg = AGENT_CONFIG[item.type] ?? AGENT_CONFIG.research
              return (
                <div key={item.id} className="timeline-item slide-in">
                  <div className="timeline-dot" style={{ borderColor: cfg.color, background: `${cfg.color}20` }} />
                  <div className="rounded-lg p-3" style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}15` }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px]">{cfg.icon}</span>
                      <span className="text-xs font-semibold" style={{ color: cfg.color }}>{item.agent}</span>
                      <span className="text-[10px] ml-auto" style={{ color: '#475569' }}>{item.time}</span>
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{item.message}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
