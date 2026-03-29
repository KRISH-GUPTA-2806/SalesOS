# SalesOS — AI-Powered Sales Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq_Llama_3.3_70B-FF6B35?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<p align="center">
  <b>6 AI agents that collaborate to automate your entire sales workflow — research, outreach, risk, recovery, competitive intel, and pipeline forecasting.</b>
</p>

<p align="center">
  <a href="https://agent-69c8afea9b35a6b658e908fa--sales-os-et.netlify.app/" target="_blank">🚀 Live Demo</a>
</p>

---

## Overview

SalesOS is a multi-agent AI sales platform where six specialized agents work together to replace hours of manual sales work. Each agent handles a distinct part of the sales process — and they chain together intelligently so the output of one feeds directly into the next.

The platform runs on **Groq's free API** with **Llama 3.3 70B**, delivering sub-2-second AI responses on a fully open, zero-cost stack.

---

## Agents

| Agent | Responsibility |
|---|---|
| 🔍 **Research Agent** | Analyzes a target company — overview, pain points, tech stack, buying signals, and a fit score |
| 📧 **Outreach Agent** | Writes personalized cold emails, LinkedIn messages, follow-ups, and call scripts using research output |
| ⚠️ **Risk Agent** | Flags deal risk with warning signals, urgency levels, and recommended recovery plays |
| 🔄 **Recovery Agent** | Generates win-back strategies for stalled or lost deals, informed by risk analysis |
| ⚔️ **Competitive Agent** | Produces tactical battlecards with competitor weaknesses, objection handling, and landmine questions |
| 📊 **Forecast Agent** | Analyses the full pipeline — win probabilities, revenue forecast, and priority actions |

### Auto Pilot

Auto Pilot chains agents together with a single click:

```
Research → Outreach → Risk Assessment → Recovery (if risk is high/critical)
```

Research output feeds directly into Outreach. Risk output feeds directly into Recovery. No copy-pasting, no switching tabs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite |
| **Backend** | Node.js, Express |
| **AI Model** | Llama 3.3 70B via Groq API |
| **Styling** | Tailwind CSS, custom glassmorphism design system |
| **Deployment** | Netlify (frontend) / Render (backend) |

---

## Features

- **Agent Orchestration** — Auto Pilot chains agents so research feeds outreach, and risk analysis drives recovery strategy
- **Drag & Drop Pipeline** — Move leads across stages (Lead → Qualified → Demo → Closed) visually
- **Add / Remove Leads** — Dynamically manage your pipeline
- **Search & Filter** — Find leads by name, company, industry, or risk level
- **Result History** — Browse all past agent outputs per lead with tabbed navigation
- **Copy to Clipboard** — One-click copy on every generated email or battlecard
- **Pipeline Forecast** — AI-powered revenue forecast with deal-level win probability
- **Retry Logic** — Automatic retries with exponential backoff on API errors
- **Glassmorphism UI** — Dark-mode premium design with smooth animations and count-up stats

---

## Project Structure

```
salesos-ai/
├── server/                    # Express backend
│   ├── index.js               # Server entry point + static file serving
│   ├── groq.js                # Groq client, retry logic, JSON extraction
│   └── routes/
│       ├── research.js        # Research Agent endpoint
│       ├── outreach.js        # Outreach Agent endpoint (consumes research)
│       ├── risk.js            # Risk Agent endpoint
│       ├── recovery.js        # Recovery Agent endpoint (consumes risk)
│       ├── competitive.js     # Competitive Agent endpoint
│       └── forecast.js        # Forecast Agent endpoint
│
├── src/                       # React frontend
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main dashboard — pipeline board & orchestration
│   ├── App.css                # Design system (glassmorphism, animations)
│   ├── api.js                 # API client
│   ├── data/
│   │   └── mockData.js        # Sample leads, stage config, agent config
│   └── components/
│       ├── StatsBar.jsx       # Animated pipeline stats with count-up
│       ├── LeadCard.jsx       # Lead card with score ring & Auto Pilot button
│       ├── AgentPanel.jsx     # Agent result panel with history tabs
│       ├── ActivityFeed.jsx   # Timeline activity log
│       └── CompetitivePanel.jsx  # Competitor battlecard generator
│
├── index.html
├── vite.config.js             # Vite config — proxies /api to Express
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Groq API key** (free, no credit card required)

### 1. Get a Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google or email
3. Open **API Keys** in the sidebar
4. Click **Create API Key** and copy it — it starts with `gsk_`

### 2. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/salesos-ai.git
cd salesos-ai
npm install
```

### 3. Configure Environment

```bash
# Mac / Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Open `.env` and add your key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

### 4. Run Locally

```bash
npm run dev
```

This starts both servers simultaneously:
- **React dev server** → [http://localhost:3000](http://localhost:3000)
- **Express API server** → [http://localhost:5000](http://localhost:5000)

The Vite proxy in `vite.config.js` forwards all `/api` requests from port 3000 to the Express server on port 5000 automatically.

---

## API Endpoints

All endpoints accept `POST` requests with `Content-Type: application/json`.

| Endpoint | Body | Description |
|---|---|---|
| `POST /api/research` | `{ company, contact, role, industry, note }` | Deep-dive company research |
| `POST /api/outreach` | `{ company, contact, role, industry, note, researchData? }` | Generate personalized outreach |
| `POST /api/risk` | `{ company, contact, value, stage, daysSilent, note }` | Assess deal risk |
| `POST /api/recovery` | `{ company, contact, value, stage, note, riskData? }` | Win-back strategies |
| `POST /api/competitive` | `{ competitor, ourProduct }` | Generate competitive battlecard |
| `POST /api/forecast` | `{ leads }` | Full pipeline forecast |

When `researchData` is passed to `/api/outreach`, the Outreach Agent uses it to write more targeted messaging. Similarly, `riskData` passed to `/api/recovery` produces more specific win-back strategies.

---

## Deployment

### Render (Recommended — full-stack)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm start`
6. Add environment variable: `GROQ_API_KEY`

### Netlify (Frontend) + Render (Backend)

Deploy the frontend separately on Netlify and point the Vite proxy (or a `_redirects` rule) at your Render backend URL.

### Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
3. Add `GROQ_API_KEY` as an environment variable
4. Railway auto-detects Node.js and runs `npm start`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key from [console.groq.com](https://console.groq.com) |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm install` fails | Ensure Node.js 18+ is installed: `node --version` |
| Port 3000 already in use | Change the port in `vite.config.js` |
| Agent returns an error | Verify your `.env` has the correct Groq key |
| API calls fail in dev | Confirm both servers are running — `npm run dev` starts both |
| Production build fails | Run `npm run build` to see specific errors |

---

## License

MIT — free for personal projects, hackathons, and learning.
