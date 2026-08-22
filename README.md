# 🥗 FoodBridge — AI-Powered Surplus Food Rescue & NGO Matching Platform

> **Connecting Surplus Food Suppliers with Local NGOs & Volunteers using AI Governance and Smart Matching**

FoodBridge is a full-stack hackathon project designed to combat food waste and hunger by facilitating instant, intelligent redistribution of surplus meals from restaurants, hotels, and caterers to verified local NGOs and community shelters.

---

## 🌟 Key Features

- **🤖 AI Food Rescue Coordinator Agent**: Governed by strict rules (`constitution.md`), analyzing food spoilage, calculating urgency scores, and matching donations with optimal NGOs.
- **🎯 4-Tier NGO Matching Skill**: Evaluates demand alignment (40%), proximity (30%), receiving capacity (20%), and urgency (10%).
- **⚡ Instant Pickup Scheduling**: Automated assignment of nearby volunteers with real-time ETA tracking.
- **📊 Real-time Impact Metrics**: Tracks meals rescued, kilograms of food diverted from landfills, and CO₂ emissions offset.
- **🛡️ Governance Layer**: Built-in constitution enforcing food safety, transparency, and human administrator override.

---

## 📁 Repository Structure

```text
FoodBridge/
│
├── frontend/             # React (Vite) application with interactive UI
├── backend/              # Node.js + Express API & NGO matching engine
├── agents/               # AI Agent specifications (food_rescue_agent.md)
├── skills/               # Custom Skill specifications (ngo_matching_skill.md)
├── docs/                 # System Architecture & Database schema (ARCHITECTURE.md)
├── .github/workflows/    # Automated CI/CD pipeline (ci.yml)
├── AGENTS.md             # Agent governance & registry
├── AGENTS_AND_SKILLS.md  # Detailed Agent & Skill documentation
├── constitution.md       # AI Agent safety constitution
├── README.md
└── package.json          # Root workspace configuration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Tests
```bash
cd backend
npm test
```

### 3. Start Development Servers
```bash
# Start backend server (port 5000)
cd backend
npm run dev

# Start frontend app (port 5173)
cd ../frontend
npm run dev
```

Open `http://localhost:5173` in your browser to view the application.

---

## 🧪 CI/CD Pipeline
Every push and pull request runs automated dependency installation, linting, unit testing, and production builds via GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).
