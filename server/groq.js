import Groq from 'groq-sdk'

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const MODEL = 'llama-3.3-70b-versatile'

const MAX_RETRIES = 3
const RETRY_DELAYS = [500, 1500, 3000]

async function withRetry(fn) {
  let lastError = null
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      const errMsg = lastError.message.toLowerCase()
      if (errMsg.includes('rate_limit') || errMsg.includes('429') || errMsg.includes('500') || errMsg.includes('timeout') || errMsg.includes('econnreset')) {
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]))
          continue
        }
      }
      throw lastError
    }
  }
  throw lastError ?? new Error('All retries exhausted')
}

function extractJSON(text) {
  try { return JSON.parse(text) } catch { /* continue */ }

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()) } catch { /* continue */ }
  }

  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)) } catch { /* continue */ }
  }

  return { error: 'Failed to parse response', raw: text.slice(0, 500) }
}

export async function callGroq(systemPrompt, userMessage) {
  return withRetry(async () => {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })
    return completion.choices[0]?.message?.content ?? ''
  })
}

export async function callGroqJSON(systemPrompt, userMessage) {
  return withRetry(async () => {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.' },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    })
    const text = completion.choices[0]?.message?.content ?? '{}'
    return extractJSON(text)
  })
}
