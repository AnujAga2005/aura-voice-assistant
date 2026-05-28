import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `You are Aura, a warm and intelligent AI voice assistant. Keep all responses concise and conversational — 2 to 4 sentences maximum. Never use markdown, bullet points, headers, or lists. Speak naturally as if talking in person.`

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('GROQ_API_KEY not set in .env')
      return res.status(500).json({ error: 'GROQ_API_KEY not configured' })
    }

    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return res.status(500).json({ error: 'Internal error' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || ''

    return res.json({ reply })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
