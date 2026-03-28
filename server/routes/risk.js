import { Router } from 'express'
import { callGroqJSON } from '../groq.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { company, contact, stage, daysSilent, value, note } = req.body
    const result = await callGroqJSON(
      `You are a deal risk analyst specializing in B2B sales pipeline management. Assess deal risk honestly and provide actionable recovery tactics. Don't sugarcoat — flag real problems.

Consider these risk factors:
- Days of silence (>7 is concerning, >14 is critical)
- Deal stage vs. engagement level
- Competitor mentions in notes
- Budget concerns
- Missing stakeholders
- Stalled momentum

Return exactly this JSON structure:
{
  "riskLevel": "low or medium or high or critical",
  "riskScore": 75,
  "reasons": ["specific risk reason 1", "specific risk reason 2", "specific risk reason 3"],
  "warningSignals": ["behavioral signal 1", "behavioral signal 2"],
  "suggestedAction": "one specific, immediate action the rep should take TODAY",
  "recoveryPlay": "detailed tactical approach to save this deal, including timing and messaging",
  "urgency": "immediate or this-week or monitor",
  "draftMessage": "short re-engagement message under 60 words that addresses the specific situation"
}

riskScore: 0-100 where 100 = maximum risk. Factor in deal value, silence duration, and stage.`,
      `Company: ${company}, Contact: ${contact}
Stage: ${stage}, Days silent: ${daysSilent}, Deal value: $${value}
Notes: ${note}`
    )
    res.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ success: false, error: msg })
  }
})

export default router
