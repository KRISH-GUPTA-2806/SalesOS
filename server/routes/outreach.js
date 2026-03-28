import { Router } from 'express'
import { callGroqJSON } from '../groq.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { company, contact, role, industry, painPoints, outreachAngle, researchContext } = req.body
    const result = await callGroqJSON(
      `You are an expert B2B sales copywriter who writes hyper-personalized outreach that gets replies. 

Rules:
- Never use generic openers like "Hope this finds you well" or "I came across your profile"
- Reference something specific about their company or role
- Be brief, human, and value-first
- Each piece of content should feel hand-written, not templated
- Use the research context if provided to make outreach surgically targeted

Return exactly this JSON structure:
{
  "subject": "compelling email subject line under 8 words - create curiosity",
  "email": "cold email body under 130 words. Lead with insight. Be specific. Sound human. End with soft CTA.",
  "linkedin": "LinkedIn connection message under 75 words. Casual, peer-to-peer tone.",
  "followUp1": "follow-up email for day 3 — add new value, don't just bump",
  "followUp2": "follow-up email for day 7 — different angle entirely, maybe reference a competitor or industry trend",
  "callScript": "30-second cold call opening. Name drop a relevant insight. Ask a provocative question."
}`,
      `Contact: ${contact}, ${role} at ${company} (${industry})
Pain points: ${painPoints?.join(', ') ?? 'Unknown'}
Outreach angle: ${outreachAngle ?? 'General'}
${researchContext ? `Research context: ${JSON.stringify(researchContext)}` : ''}`
    )
    res.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ success: false, error: msg })
  }
})

export default router
