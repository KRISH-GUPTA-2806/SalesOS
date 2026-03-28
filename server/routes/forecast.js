import { Router } from 'express'
import { callGroqJSON } from '../groq.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { leads } = req.body

    const leadsContext = leads.map(l =>
      `${l.company}: stage=${l.stage}, value=$${l.value}, daysSilent=${l.daysSilent}, risk=${l.riskLevel}, score=${l.score}, note="${l.note}"`
    ).join('\n')

    const result = await callGroqJSON(
      `You are a sales forecasting analyst. Analyze the entire pipeline and provide a strategic forecast.
Return exactly this structure:
{
  "pipelineHealth": 72,
  "totalForecast": {
    "best": 295000,
    "expected": 210000,
    "worst": 120000
  },
  "dealForecasts": [
    {
      "company": "Company Name",
      "winProbability": 75,
      "estimatedClose": "2-3 weeks",
      "nextAction": "specific recommended next step"
    }
  ],
  "priorityActions": [
    "action 1 with specific company name",
    "action 2 with specific company name",
    "action 3"
  ],
  "insights": [
    "strategic insight about the pipeline",
    "risk pattern observation",
    "revenue optimization suggestion"
  ]
}
Pipeline health should be 0-100 based on deal velocity, risk distribution, and stage coverage.
dealForecasts should include every deal that is not yet Closed.
Be specific — use actual company names and real numbers from the data.`,
      `Current Pipeline:\n${leadsContext}`
    )
    res.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ success: false, error: msg })
  }
})

export default router
