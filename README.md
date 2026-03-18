# न्यायमित्र | NyayaMitra

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://iitp-nyayamitra-ai.vercel.app/dashboard)

> **"Justice shouldn't depend on who you know."**

**NyayaMitra** is an AI Legal Co-Pilot designed for the families of India's 40 million undertrial prisoners. Our mission is to democratize legal aid and navigate the complex Indian judicial system using advanced AI.

## 🎯 Mission

NyayaMitra helps families of undertrial prisoners understand the legal system, generate bail applications, find free lawyers, and navigate court hearings — all in Hindi and regional languages.

## 🚀 Live Application

You can access the live dashboard here:  
🔗 **[IITP NyayaMitra AI Dashboard](https://iitp-nyayamitra-ai.vercel.app/dashboard)**

---

## ✨ Features

1.  **⚖️ Hindi Case Summaries** — AI translates complex legal jargon into plain, actionable Hindi.
2.  **📄 Bail Application Generator** — Creates court-ready bail applications in Hindi & English based on case details.
3.  **✅ Bail Eligibility Checker** — Automatically analyzes IPC sections to determine bail eligibility for early release.
4.  **🔍 Lawyer Finder** — Connects users with DLSA-empanelled free legal aid lawyers in their specific district.
5.  **📞 Legal Aid Info** — Instant access to DLSA/NALSA helpline numbers and eligibility criteria for free aid.
6.  **💬 AI Legal Chat** — An intelligent assistant that understands Hindi, Bhojpuri, Urdu, Awadhi, and English.
7.  **📅 Hearing Timeline** — Manage and track court hearing dates with automated reminders.

---

## 🏗️ Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| **Frontend**  | React 18 + Vite + TailwindCSS   |
| **Backend**   | FastAPI + SQLAlchemy + SQLite    |
| **AI Engine** | Google Gemini Pro                |
| **Security**  | JWT (python-jose + bcrypt)       |

---

## 🚀 Local Quick Start

### 1. Backend Setup
```bash
cd nyayamitra/backend
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd nyayamitra/frontend
npm install
npm run dev
```

---

## 🔑 Demo Access

| Role     | Username  | Password  |
|----------|-----------|-----------|
| **Citizen**  | `meena`     | `meena123`  |
| **Lawyer**   | `advocate`  | `adv123`    |

---

## 📁 Project Structure

```text
nyayamitra/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application entry
│   │   ├── config.py        # Configuration & Settings
│   │   ├── database.py      # Database connection & models
│   │   ├── api/             # API Route handlers
│   │   └── services/        # AI logic & Legal engine
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (BailGen, LawyerCard, etc.)
│   │   ├── pages/           # Screen views (Dashboard, Hearings, etc.)
│   │   └── services/        # API integration
│   └── package.json
└── README.md
```

## ⚖️ Disclaimer

NyayaMitra is an AI-assisted legal information tool. It **does NOT provide legal advice**. It is intended to bridge the information gap. Users should always consult a qualified lawyer. Free legal aid is available through DLSA/NALSA (Emergency Helpline: **15100**).

---

## 🇮🇳 Built for India

*"40 million cases. 75% can't afford lawyers. NyayaMitra: Empowering the underserved through technology."*
