import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import researchRoute from './routes/research.js'
import outreachRoute from './routes/outreach.js'
import riskRoute from './routes/risk.js'
import recoveryRoute from './routes/recovery.js'
import competitiveRoute from './routes/competitive.js'
import forecastRoute from './routes/forecast.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors())
app.use(express.json())

// API routes
app.use('/api/research', researchRoute)
app.use('/api/outreach', outreachRoute)
app.use('/api/risk', riskRoute)
app.use('/api/recovery', recoveryRoute)
app.use('/api/competitive', competitiveRoute)
app.use('/api/forecast', forecastRoute)

// Serve built React app in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ SalesOS AI server running on http://localhost:${PORT}`)
})
