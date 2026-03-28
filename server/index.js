import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import researchRoute from './routes/research.js'
import outreachRoute from './routes/outreach.js'
import riskRoute from './routes/risk.js'
import recoveryRoute from './routes/recovery.js'
import competitiveRoute from './routes/competitive.js'
import forecastRoute from './routes/forecast.js'

const app = express()

app.use(cors())
app.use(express.json())
app.get("/", (req, res) => {
  res.send("SalesOS Backend Running ✅")
})


// API routes
app.use('/api/research', researchRoute)
app.use('/api/outreach', outreachRoute)
app.use('/api/risk', riskRoute)
app.use('/api/recovery', recoveryRoute)
app.use('/api/competitive', competitiveRoute)
app.use('/api/forecast', forecastRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`✅ SalesOS AI server running on http://localhost:${PORT}`)
})
