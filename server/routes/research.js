import { Router } from 'express'
import { callGroqJSON } from '../groq.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { company, industry, note } = req.body
    const result = await callGroqJSON(
      `You are an elite B2B sales research analyst with deep industry knowledge. Given a target company, produce actionable intelligence that a sales rep can use immediately.

Research deeply. Be specific. Use real industry context. No generic filler.

Return exactly this JSON structure:
{
  "overview": "2-3 sentence company overview with recent traction, funding stage, and market position",
  "recentNews": ["specific recent news/event 1", "specific recent news/event 2", "specific recent news/event 3"],
  "painPoints": ["specific operational pain point 1", "specific pain point 2", "specific pain point 3"],
  "techStack": ["tool/platform 1", "tool/platform 2", "tool/platform 3", "tool/platform 4"],
  "decisionMakers": [{"name": "Name", "role": "Role", "linkedin": "linkedin.com/in/..."}],
  "buyingSignals": ["specific signal 1", "specific signal 2", "specific signal 3"],
  "fitScore": 85,
  "outreachAngle": "One specific, compelling hook for outreach based on their current situation",
  "competitorRisk": "low or medium or high"
}

fitScore should be 0-100 based on: company size, industry fit, timing, budget indicators, and tech compatibility.`,
      `Company: ${company}\nIndustry: ${industry}\nContext: ${note}`
    )
    res.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ success: false, error: msg })
  }
})

export default router
