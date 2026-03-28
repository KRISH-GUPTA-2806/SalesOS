# SalesOS AI — Multi-Agent Sales Intelligence Platform

> 🚀 **6 AI agents** that collaborate autonomously to research leads, write outreach, assess risk, recover stalled deals, generate competitive battlecards, and forecast your pipeline — all powered by **Groq** (100% free).

![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express)
![AI](https://img.shields.io/badge/Llama_3.3_70B-Groq-orange?style=flat-square)

---

## ✨ What This Does

SalesOS AI is a **multi-agent AI system** where 6 specialized agents work together to automate the entire sales workflow:

| Agent | What It Does |
|---|---|
| 🔍 **Research Agent** | Deep-dives into a company — overview, pain points, tech stack, buying signals, fit score |
| 📧 **Outreach Agent** | Writes hyper-personalized cold emails, LinkedIn messages, follow-ups, and call scripts |
| ⚠️ **Risk Agent** | Assesses deal risk with warning signals, urgency levels, and recovery plays |
| 🔄 **Recovery Agent** | Creates creative win-back strategies for stalled/lost deals |
| ⚔️ **Competitive Agent** | Generates tactical battlecards with weaknesses, objections, and landmine questions |
| 📊 **Forecast Agent** | Analyzes the entire pipeline — win probabilities, revenue forecast, priority actions |

### 🚀 Auto Pilot Mode

The **Auto Pilot** feature chains agents together intelligently:
1. **Research** → discovers pain points and outreach angles
2. **Outreach** → uses research to write surgically targeted emails
3. **Risk Assessment** → evaluates deal health
4. **Recovery** → auto-triggers if risk is high/critical, using risk analysis for targeted strategies

All with a **single click**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express |
| **AI** | Groq API with Llama 3.3 70B (FREE — no credit card) |
| **Styling** | Tailwind CSS + Custom glassmorphism design system |
| **Deploy** | Vercel / Render / Railway (all FREE) |

---

## 📋 Setup Guide

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org/)
- **A Groq API key** (free, takes 2 minutes)

### Step 1: Get Your FREE Groq API Key

1. Go to **https://console.groq.com**
2. Sign up with Google or email (free, no credit card)
3. Click **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Copy the key — it looks like `gsk_...`

### Step 2: Clone & Install

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/salesos-ai.git
cd salesos-ai

# Install all dependencies
npm install
```

### Step 3: Configure Environment

```bash
# Create your .env file from the example
# On Mac/Linux:
cp .env.example .env

# On Windows (Command Prompt):
copy .env.example .env

# On Windows (PowerShell):
Copy-Item .env.example .env
```

Open `.env` in any text editor and paste your Groq key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

### Step 4: Run Locally

```bash
npm run dev
```

This starts **both** the Express API server (port 5000) and the Vite React dev server (port 3000) simultaneously.

Open **http://localhost:3000** in your browser.

### Verify It Works

- Click **"Research"** on any lead card → AI analyzes the company
- Click **"Outreach"** → AI generates a personalized cold email
- Click **"Risk Scan"** → AI flags deal risk and suggests recovery
- Click **🚀 Auto Pilot** → Watch all agents chain together automatically
- Click **📊 Pipeline Forecast** in the header → AI forecasts your entire pipeline
- Type a competitor name in the **Competitive Intel** panel → AI generates a battlecard
- **Drag and drop** leads between pipeline stages
- Click **✨ Add Lead** to add new leads

---

## 🚀 Deploy

### Option A: Deploy to Render (Recommended for Express apps)

1. Push your code to GitHub
2. Go to **https://render.com** → sign in → New Web Service
3. Connect your repo
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. Add environment variable: `GROQ_API_KEY` = your key
7. Deploy!

### Option B: Deploy to Vercel

1. Push to GitHub
2. Go to **https://vercel.com** → New Project → import repo
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Add `GROQ_API_KEY` in Settings → Environment Variables
6. You'll also need a [Vercel Serverless Function](https://vercel.com/docs/functions) or use the Express server on a separate service

### Option C: Deploy to Railway

1. Push to GitHub
2. Go to **https://railway.app** → New Project → Deploy from GitHub
3. Add `GROQ_API_KEY` environment variable
4. Railway auto-detects Node.js — it will run `npm start`
5. Done!

### Push to GitHub

```bash
git init
git add .
git commit -m "SalesOS AI - multi-agent sales intelligence"
git remote add origin https://github.com/YOUR_USERNAME/salesos-ai.git
git branch -M main
git push -u origin main
```

---

## 📁 Project Structure

```
salesos-ai/
├── server/                    ← Express Backend
│   ├── index.js               ← Server entry + static file serving
│   ├── groq.js                ← Groq client with retries
│   └── routes/
│       ├── research.js        ← Research Agent API
│       ├── outreach.js        ← Outreach Agent API (chains from research)
│       ├── risk.js            ← Risk Agent API
│       ├── recovery.js        ← Recovery Agent API (chains from risk)
│       ├── competitive.js     ← Competitive Agent API
│       └── forecast.js        ← Forecast Agent API
├── src/                       ← React Frontend
│   ├── main.jsx               ← React entry point
│   ├── App.jsx                ← Dashboard (orchestration + pipeline)
│   ├── App.css                ← Design system (glassmorphism, animations)
│   ├── data/
│   │   └── mockData.js        ← Sample leads & agent configs
│   └── components/
│       ├── StatsBar.jsx       ← Animated stats with count-up
│       ├── LeadCard.jsx       ← Lead card with score ring & auto-pilot
│       ├── AgentPanel.jsx     ← Agent results with copy & history tabs
│       ├── ActivityFeed.jsx   ← Timeline-style agent activity log
│       └── CompetitivePanel.jsx ← Competitor battlecard generator
├── index.html                 ← HTML entry point
├── vite.config.js             ← Vite config with API proxy
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example               ← Environment template
└── README.md
```

---

## 🧠 Key Features

| Feature | Description |
|---|---|
| **Agent Orchestration** | Auto Pilot chains agents: Research → Outreach → Risk → Recovery |
| **Agent Collaboration** | Research feeds into Outreach; Risk feeds into Recovery |
| **Drag & Drop Pipeline** | Move leads between stages visually |
| **Add/Remove Leads** | Dynamically manage your pipeline |
| **Search & Filter** | Find leads by name, company, industry, or risk level |
| **Result History** | Browse all past agent results with tabs |
| **Copy to Clipboard** | One-click copy on all generated emails |
| **Pipeline Forecast** | AI-powered revenue forecast with deal-level predictions |
| **Retry Logic** | Automatic retries with exponential backoff on API errors |
| **Glassmorphism UI** | Premium dark-mode design with animations |

---

## 🎤 Demo Script (3 Minutes)

1. **Open the live URL** — show the animated pipeline board with stats counting up
2. **Click 🚀 Auto Pilot** on "Razorpay" — watch 4 agents chain together live
3. While that runs, show the **score ring**, **risk badges**, and **drag-and-drop**
4. Show the **Agent Output panel** — flip through history tabs (Research → Outreach → Risk)
5. Click **📊 Pipeline Forecast** — show AI forecasting the entire pipeline
6. Type "Salesforce" in **Competitive Intel** → instant battlecard
7. Click **✨ Add Lead** → add a new company → show it appear in the pipeline

**Key talking points:**
- "6 AI agents that actually collaborate, not just run independently"
- "Auto Pilot chains agents intelligently — research feeds into outreach, risk triggers recovery"
- "Node.js + Express backend, React frontend — clean separation of concerns"
- "Runs on Llama 3.3 70B via Groq — completely free and sub-2-second responses"

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| `npm install` fails | Make sure Node.js 18+ is installed: `node --version` |
| Port 3000 in use | Change the port in `vite.config.js` |
| Agent returns error | Check your `.env` has the correct Groq key |
| API calls fail in dev | Make sure both servers are running (`npm run dev` runs both) |
| Production build fails | Run `npm run build` to see errors |

---

## 📄 License

MIT — built for hackathons, learning, and building the future of AI-powered sales.
