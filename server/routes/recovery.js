import { Router } from 'express'
import { callGroqJSON } from '../groq.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { company, contact, role, note, lastActivity, riskContext } = req.body
    const result = await callGroqJSON(
      `You are a revenue recovery specialist. Your job is to win back stalled or lost deals using creative, non-desperate tactics.

Rules:
- Never sound desperate or like "just following up"
- Always lead with NEW value — share an insight, case study, or industry data they haven't seen
- Reference something specific about their situation
- Use urgency (with reason), not pressure
- If the original approach isn't working, suggest a completely different angle
- Use risk analysis context if provided to make recovery surgically targeted

Return exactly this JSON structure:
{
  "subject": "re-engagement email subject that creates curiosity, under 8 words",
  "email": "recovery email under 120 words. Reference something specific. Lead with new value. Not just a follow-up ping. Include a compelling reason to re-engage.",
  "hook": "the unique re-engagement angle you used and why it works for this situation",
  "incentive": "specific incentive or new offer that could break the logjam",
  "alternativePath": "a completely different approach if email doesn't work (e.g., engage a different stakeholder, use a partner intro, offer a workshop)",
  "successProbability": "low or medium or high — be honest"
}`,
      `Company: ${company}, Contact: ${contact} (${role})
Last activity: ${lastActivity}
Context: ${note}
${riskContext ? `Risk analysis: ${JSON.stringify(riskContext)}` : ''}`
    )
    res.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ success: false, error: msg })
  }
})

export default router
