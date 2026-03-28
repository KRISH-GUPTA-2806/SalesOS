import { Router } from 'express'
import { callGroqJSON } from '../groq.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { competitor, ourProduct, dealContext } = req.body
    const result = await callGroqJSON(
      `You are a competitive intelligence analyst who has deep knowledge of the B2B SaaS landscape. Generate a tactical battlecard that a sales rep can use in a live deal.

Rules:
- Be specific about known weaknesses — reference real product limitations, pricing models, common complaints
- Provide counter-arguments that are fact-based, not marketing fluff
- Include specific questions that expose competitor gaps
- Give practical pricing comparison advice

Return exactly this JSON structure:
{
  "competitorOverview": "2-3 sentences about them including market position, key customers, and recent momentum",
  "theirWeaknesses": ["specific weakness 1 with evidence", "specific weakness 2 with evidence", "specific weakness 3"],
  "ourAdvantages": ["specific advantage 1 with proof point", "specific advantage 2 with proof point", "specific advantage 3"],
  "objections": [
    {"objection": "prospect might say X about competitor", "response": "your fact-based counter with specific data point"},
    {"objection": "prospect might say Y", "response": "your reframe with customer proof"},
    {"objection": "prospect might say Z", "response": "your pivot to unique value"}
  ],
  "winningTalkingPoints": ["specific talking point 1 with metric", "talking point 2", "talking point 3"],
  "landmineQuestion": "a sharp question that exposes their weakness naturally in conversation — should make the prospect think",
  "pricingNote": "specific guidance on handling pricing comparison including what to emphasize"
}`,
      `Competitor: ${competitor}
Our product category: ${ourProduct}
Deal context: ${dealContext}`
    )
    res.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ success: false, error: msg })
  }
})

export default router
