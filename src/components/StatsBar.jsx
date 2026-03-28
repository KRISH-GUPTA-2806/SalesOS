import { useEffect, useState } from 'react'

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 30
    const increment = value / steps
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        setDisplayed(value)
        clearInterval(interval)
      } else {
        setDisplayed(Math.round(increment * step))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [value])

  return <span>{prefix}{displayed}{suffix}</span>
}

const STAT_ICONS = ['📊', '💰', '🔥', '⚠️', '✅']

export default function StatsBar({ leads }) {
  const total = leads.length
  const totalValue = leads.reduce((s, l) => s + l.value, 0)
  const risky = leads.filter(l => l.riskLevel === 'high' || l.riskLevel === 'critical').length
  const hot = leads.filter(l => l.score >= 80 && l.stage !== 'Closed').length
  const closed = leads.filter(l => l.stage === 'Closed').length

  const stats = [
    { label: 'Total Leads', value: total, displayValue: total, color: '#6366f1', prefix: '', suffix: '' },
    { label: 'Pipeline Value', value: totalValue, displayValue: Math.round(totalValue / 1000), color: '#10b981', prefix: '$', suffix: 'k' },
    { label: 'Hot Deals', value: hot, displayValue: hot, color: '#f59e0b', prefix: '', suffix: '' },
    { label: 'At Risk', value: risky, displayValue: risky, color: '#ef4444', prefix: '', suffix: '' },
    { label: 'Won', value: closed, displayValue: closed, color: '#8b5cf6', prefix: '', suffix: '' },
  ]

  return (
    <div className="grid gap-3 mb-6 stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {stats.map((s, i) => (
        <div key={s.label} className="glass-card p-4 slide-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium tracking-wide" style={{ color: '#64748b' }}>{s.label}</span>
            <span className="text-lg">{STAT_ICONS[i]}</span>
          </div>
          <div className="text-2xl font-bold count-up" style={{ color: s.color }}>
            <AnimatedNumber value={s.displayValue} prefix={s.prefix} suffix={s.suffix} />
          </div>
          <div className="mt-3 rounded-full h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full" style={{
              width: `${Math.min(100, (s.value / Math.max(1, stats[0].value)) * 100)}%`,
              background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
              transition: 'width 1s ease-out',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}
