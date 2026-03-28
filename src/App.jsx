import { useState, useCallback, useRef } from 'react'
import { initialLeads, STAGES, STAGE_COLORS, AGENT_CONFIG } from './data/mockData'
import StatsBar from './components/StatsBar'
import LeadCard from './components/LeadCard'
import AgentPanel from './components/AgentPanel'
import ActivityFeed from './components/ActivityFeed'
import CompetitivePanel from './components/CompetitivePanel'

let activityCounter = 0
let leadIdCounter = 100

// ─── Toast ───
function Toast({ message, type, onClose }) {
  const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1' }
  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  return (
    <div className="toast slide-in-right" onClick={onClose}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#1e293b', border: `1px solid ${colors[type]}40`, boxShadow: `0 8px 32px -8px ${colors[type]}30` }}>
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${colors[type]}20`, color: colors[type] }}>{icons[type]}</span>
        <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{message}</span>
      </div>
    </div>
  )
}

// ─── Add Lead Modal ───
function AddLeadModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ company: '', contact: '', role: '', email: '', value: '', industry: '', note: '', stage: 'Lead' })
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    if (!form.company.trim() || !form.contact.trim()) return
    onAdd({
      id: ++leadIdCounter,
      company: form.company.trim(),
      contact: form.contact.trim(),
      role: form.role.trim() || 'Contact',
      email: form.email.trim() || `${form.contact.split(' ')[0].toLowerCase()}@${form.company.toLowerCase().replace(/\s+/g, '')}.com`,
      value: parseInt(form.value) || 25000,
      stage: form.stage,
      daysSilent: 0,
      riskLevel: 'low',
      score: 70,
      industry: form.industry.trim() || 'Technology',
      note: form.note.trim() || 'Newly added lead. Needs research.',
    })
  }

  const fields = [
    { key: 'company', label: 'Company Name *', placeholder: 'e.g. Stripe' },
    { key: 'contact', label: 'Contact Name *', placeholder: 'e.g. John Doe' },
    { key: 'role', label: 'Role', placeholder: 'e.g. VP Sales' },
    { key: 'email', label: 'Email', placeholder: 'e.g. john@stripe.com' },
    { key: 'industry', label: 'Industry', placeholder: 'e.g. Fintech' },
    { key: 'value', label: 'Deal Value ($)', placeholder: 'e.g. 50000' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-static p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold gradient-text">Add New Lead</h2>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded-md hover:bg-white/10" style={{ color: '#64748b' }}>✕</button>
        </div>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#64748b' }}>{f.label}</label>
              <input value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full text-sm px-3 py-2 rounded-lg glass-input" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: '#64748b' }}>Stage</label>
            <select value={form.stage} onChange={e => update('stage', e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg glass-input" style={{ appearance: 'none' }}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: '#64748b' }}>Note</label>
            <textarea value={form.note} onChange={e => update('note', e.target.value)} placeholder="Any context about this lead..."
              rows={2} className="w-full text-sm px-3 py-2 rounded-lg glass-input resize-none" />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!form.company.trim() || !form.contact.trim()}
          className="glow-btn w-full mt-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
            opacity: (!form.company.trim() || !form.contact.trim()) ? 0.4 : 1,
            cursor: (!form.company.trim() || !form.contact.trim()) ? 'not-allowed' : 'pointer' }}>
          ✨ Add Lead to Pipeline
        </button>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───
export default function App() {
  const [leads, setLeads] = useState(initialLeads)
  const [loadingMap, setLoadingMap] = useState({})
  const [agentResult, setAgentResult] = useState(null)
  const [resultHistory, setResultHistory] = useState([])
  const [activityItems, setActivityItems] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  const [toast, setToast] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [dragOverStage, setDragOverStage] = useState(null)
  const dragLeadId = useRef(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const addActivity = useCallback((agent, message, type) => {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setActivityItems(prev => [...prev, { id: ++activityCounter, agent, message, time, type }])
  }, [])

  const setLeadLoading = (id, state) => setLoadingMap(prev => ({ ...prev, [id]: state }))

  const pushResult = useCallback((entry) => {
    setAgentResult(entry)
    setResultHistory(prev => [...prev, entry])
  }, [])

  // ─── Individual Agent Runner ───
  async function runAgent(lead, agentType, extraContext) {
    setLeadLoading(lead.id, agentType)
    setIsRunning(true)
    const cfg = AGENT_CONFIG[agentType]
    addActivity(cfg.name, `Analyzing ${lead.company}...`, agentType)

    try {
      let body = {}
      if (agentType === 'research') {
        body = { company: lead.company, industry: lead.industry, note: lead.note }
      } else if (agentType === 'outreach') {
        body = { company: lead.company, contact: lead.contact, role: lead.role, industry: lead.industry,
          painPoints: extraContext?.painPoints ?? [`scaling ${lead.industry} operations`, 'manual sales processes', 'poor pipeline visibility'],
          outreachAngle: extraContext?.outreachAngle ?? `Help ${lead.company} accelerate revenue with AI-driven sales automation`,
          researchContext: extraContext?.researchContext ?? null }
      } else if (agentType === 'risk') {
        body = { company: lead.company, contact: lead.contact, stage: lead.stage, daysSilent: lead.daysSilent, value: lead.value, note: lead.note }
      } else if (agentType === 'recovery') {
        body = { company: lead.company, contact: lead.contact, role: lead.role, note: lead.note,
          lastActivity: lead.daysSilent > 0 ? `${lead.daysSilent} days ago` : 'recently',
          riskContext: extraContext?.riskContext ?? null }
      }

      const res = await fetch(`/api/${agentType}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()

      if (json.success) {
        pushResult({ type: agentType, company: lead.company, data: json.data })
        addActivity(cfg.name, `✓ Completed analysis for ${lead.company}`, agentType)
        return json.data
      } else {
        addActivity(cfg.name, `✕ Error: ${json.error ?? 'Unknown error'}`, agentType)
        return null
      }
    } catch {
      addActivity(cfg.name, `✕ Failed to reach agent — check API key`, agentType)
      return null
    } finally {
      setLeadLoading(lead.id, null)
      setIsRunning(false)
    }
  }

  // ─── Auto Pilot: Orchestrated Agent Chain ───
  async function runAutoPilot(lead) {
    setLeadLoading(lead.id, 'autopilot')
    setIsRunning(true)
    addActivity('Auto Pilot', `🚀 Starting orchestrated analysis for ${lead.company}...`, 'autopilot')

    try {
      // Step 1: Research
      setLeadLoading(lead.id, 'research')
      addActivity('Auto Pilot', `Step 1/4: Running Research Agent on ${lead.company}...`, 'autopilot')
      const researchData = await runAgentSilent(lead, 'research')
      if (researchData) {
        pushResult({ type: 'research', company: lead.company, data: researchData })
        addActivity(AGENT_CONFIG.research.name, `✓ Research complete for ${lead.company}`, 'research')
      }

      // Step 2: Outreach (fed by research)
      setLeadLoading(lead.id, 'outreach')
      addActivity('Auto Pilot', `Step 2/4: Generating outreach using research insights...`, 'autopilot')
      const outreachContext = researchData ? { painPoints: researchData.painPoints, outreachAngle: researchData.outreachAngle, researchContext: researchData } : undefined
      const outreachData = await runAgentSilent(lead, 'outreach', outreachContext)
      if (outreachData) {
        pushResult({ type: 'outreach', company: lead.company, data: outreachData })
        addActivity(AGENT_CONFIG.outreach.name, `✓ Personalized outreach generated for ${lead.company}`, 'outreach')
      }

      // Step 3: Risk
      setLeadLoading(lead.id, 'risk')
      addActivity('Auto Pilot', `Step 3/4: Running Risk Assessment...`, 'autopilot')
      const riskData = await runAgentSilent(lead, 'risk')
      if (riskData) {
        pushResult({ type: 'risk', company: lead.company, data: riskData })
        addActivity(AGENT_CONFIG.risk.name, `✓ Risk assessment complete for ${lead.company}`, 'risk')
      }

      // Step 4: Recovery (only if high/critical risk)
      const riskLevel = String(riskData?.riskLevel ?? '').toLowerCase()
      if (riskLevel === 'high' || riskLevel === 'critical') {
        setLeadLoading(lead.id, 'recovery')
        addActivity('Auto Pilot', `Step 4/4: High risk detected → Running Recovery Agent...`, 'autopilot')
        const recoveryData = await runAgentSilent(lead, 'recovery', { riskContext: riskData })
        if (recoveryData) {
          pushResult({ type: 'recovery', company: lead.company, data: recoveryData })
          addActivity(AGENT_CONFIG.recovery.name, `✓ Recovery strategy generated for ${lead.company}`, 'recovery')
        }
      } else {
        addActivity('Auto Pilot', `Step 4/4: Risk is ${riskLevel || 'low'} — recovery not needed`, 'autopilot')
      }

      addActivity('Auto Pilot', `🎯 Auto Pilot complete for ${lead.company}!`, 'autopilot')
      showToast(`Auto Pilot complete for ${lead.company}`, 'success')
    } catch {
      addActivity('Auto Pilot', `✕ Auto Pilot failed for ${lead.company}`, 'autopilot')
      showToast('Auto Pilot failed', 'error')
    }

    setLeadLoading(lead.id, null)
    setIsRunning(false)
  }

  // Silent agent runner (for autopilot — no individual loading state)
  async function runAgentSilent(lead, agentType, extraContext) {
    try {
      let body = {}
      if (agentType === 'research') {
        body = { company: lead.company, industry: lead.industry, note: lead.note }
      } else if (agentType === 'outreach') {
        body = { company: lead.company, contact: lead.contact, role: lead.role, industry: lead.industry,
          painPoints: extraContext?.painPoints ?? [`scaling ${lead.industry} operations`, 'manual sales processes'],
          outreachAngle: extraContext?.outreachAngle ?? `Help ${lead.company} accelerate revenue`,
          researchContext: extraContext?.researchContext ?? null }
      } else if (agentType === 'risk') {
        body = { company: lead.company, contact: lead.contact, stage: lead.stage, daysSilent: lead.daysSilent, value: lead.value, note: lead.note }
      } else if (agentType === 'recovery') {
        body = { company: lead.company, contact: lead.contact, role: lead.role, note: lead.note,
          lastActivity: lead.daysSilent > 0 ? `${lead.daysSilent} days ago` : 'recently',
          riskContext: extraContext?.riskContext ?? null }
      }
      const res = await fetch(`/api/${agentType}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      return json.success ? json.data : null
    } catch { return null }
  }

  // ─── Pipeline Forecast ───
  async function runForecast() {
    setForecastLoading(true)
    setIsRunning(true)
    addActivity(AGENT_CONFIG.forecast.name, 'Analyzing entire pipeline...', 'forecast')
    try {
      const activeLeads = leads.filter(l => l.stage !== 'Closed')
      const res = await fetch('/api/forecast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leads: activeLeads }) })
      const json = await res.json()
      if (json.success) {
        pushResult({ type: 'forecast', company: 'Pipeline Forecast', data: json.data })
        addActivity(AGENT_CONFIG.forecast.name, '✓ Pipeline forecast generated', 'forecast')
        showToast('Pipeline forecast ready', 'success')
      } else {
        addActivity(AGENT_CONFIG.forecast.name, `✕ Error: ${json.error}`, 'forecast')
      }
    } catch {
      addActivity(AGENT_CONFIG.forecast.name, '✕ Forecast failed', 'forecast')
    }
    setForecastLoading(false)
    setIsRunning(false)
  }

  // ─── Competitive ───
  const handleCompetitiveResult = (data) => pushResult({ type: 'competitive', company: 'Competitive Analysis', data })
  const handleCompetitiveActivity = (msg) => addActivity(AGENT_CONFIG.competitive.name, msg, 'competitive')

  // ─── Lead Management ───
  function addLead(lead) {
    setLeads(prev => [...prev, lead])
    setShowAddModal(false)
    showToast(`${lead.company} added to pipeline`, 'success')
    addActivity('System', `New lead added: ${lead.company}`, 'research')
  }

  // ─── Drag & Drop ───
  function handleDragStart(e, leadId) {
    dragLeadId.current = leadId
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => e.currentTarget?.classList?.add('dragging'), 0)
  }
  function handleDragOver(e, stage) { e.preventDefault(); setDragOverStage(stage) }
  function handleDragLeave() { setDragOverStage(null) }
  function handleDrop(e, stage) {
    e.preventDefault()
    setDragOverStage(null)
    if (dragLeadId.current !== null) {
      const lead = leads.find(l => l.id === dragLeadId.current)
      if (lead && lead.stage !== stage) {
        setLeads(prev => prev.map(l => l.id === dragLeadId.current ? { ...l, stage } : l))
        showToast(`${lead.company} moved to ${stage}`, 'info')
        addActivity('System', `${lead.company} moved from ${lead.stage} to ${stage}`, 'research')
      }
      dragLeadId.current = null
    }
  }

  // ─── Filter ───
  const filteredLeads = leads.filter(l => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!l.company.toLowerCase().includes(q) && !l.contact.toLowerCase().includes(q) && !l.industry.toLowerCase().includes(q)) return false
    }
    if (filterRisk !== 'all' && l.riskLevel !== filterRisk) return false
    return true
  })

  const getStageLeads = (stage) => filteredLeads.filter(l => l.stage === stage)

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm gradient-shift" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', color: '#fff' }}>S</div>
            <div>
              <span className="font-bold text-sm" style={{ color: '#f1f5f9' }}>SalesOS AI</span>
              <span className="text-xs ml-2 font-medium" style={{ color: '#475569' }}>Multi-Agent Sales Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={runForecast} disabled={forecastLoading}
              className="glow-btn text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
              style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', cursor: forecastLoading ? 'not-allowed' : 'pointer' }}>
              {forecastLoading ? (<><svg className="spinner" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" strokeOpacity="0.3"/><path d="M12 3a9 9 0 0 1 9 9"/></svg>Forecasting...</>) : '📊 Pipeline Forecast'}
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="glow-btn text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
              ✨ Add Lead
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#10b981' }} />
              <span className="text-xs" style={{ color: '#475569' }}>Groq · Llama 3.3 70B</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          <StatsBar leads={leads} />

          {/* Search & Filters */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#475569' }}>🔍</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search leads..."
                className="w-full text-sm pl-8 pr-3 py-2 rounded-lg glass-input" />
            </div>
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg glass-input" style={{ appearance: 'none', minWidth: '120px' }}>
              <option value="all">All Risk Levels</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <span className="text-xs" style={{ color: '#475569' }}>{filteredLeads.length} of {leads.length} leads</span>
          </div>

          {/* Main layout */}
          <div className="grid gap-5 main-layout" style={{ gridTemplateColumns: '1fr 360px' }}>
            {/* Pipeline Board */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>Pipeline Board</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#475569' }}>Drag to move</span>
              </div>
              <div className="grid grid-cols-4 gap-4 pipeline-grid">
                {STAGES.map(stage => {
                  const stageLeads = getStageLeads(stage)
                  const isOver = dragOverStage === stage
                  return (
                    <div key={stage}
                      onDragOver={e => handleDragOver(e, stage)} onDragLeave={handleDragLeave} onDrop={e => handleDrop(e, stage)}
                      className={`rounded-xl p-3 transition-all ${isOver ? 'drag-over' : ''}`}
                      style={{ background: isOver ? undefined : 'rgba(255,255,255,0.02)', border: isOver ? undefined : '1px solid rgba(255,255,255,0.05)', minHeight: '200px' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: STAGE_COLORS[stage] }}>{stage}</span>
                        <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${STAGE_COLORS[stage]}15`, color: STAGE_COLORS[stage] }}>{stageLeads.length}</span>
                      </div>
                      <div>
                        {stageLeads.map((lead, i) => (
                          <div key={lead.id} className="slide-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                            <LeadCard lead={lead} loading={loadingMap[lead.id] ?? null}
                              onResearch={() => runAgent(lead, 'research')} onOutreach={() => runAgent(lead, 'outreach')}
                              onRisk={() => runAgent(lead, 'risk')} onRecovery={() => runAgent(lead, 'recovery')}
                              onAutoPilot={() => runAutoPilot(lead)} onDragStart={handleDragStart} />
                          </div>
                        ))}
                        {stageLeads.length === 0 && (
                          <div className="text-xs text-center py-8 rounded-xl" style={{ color: '#334155', border: '1px dashed rgba(255,255,255,0.06)' }}>
                            {searchQuery || filterRisk !== 'all' ? 'No matches' : 'Drop leads here'}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4">
              <AgentPanel result={agentResult} resultHistory={resultHistory} onClose={() => setAgentResult(null)} onSelectHistory={i => setAgentResult(resultHistory[i])} />
              <CompetitivePanel onResult={handleCompetitiveResult} onActivity={handleCompetitiveActivity} />
              <ActivityFeed items={activityItems} isRunning={isRunning} />
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddLeadModal onAdd={addLead} onClose={() => setShowAddModal(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
