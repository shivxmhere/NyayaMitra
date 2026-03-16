# न्यायमित्र | NyayaMitra

> **"Justice shouldn't depend on who you know."**

AI Legal Co-Pilot for families of India's 40 million undertrial prisoners.

## 🎯 Mission

NyayaMitra helps families of undertrial prisoners understand the legal system, generate bail applications, find free lawyers, and navigate court hearings — all in Hindi and regional languages.

## 🏗️ Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React 18 + Vite + TailwindCSS   |
| Backend   | FastAPI + SQLAlchemy + SQLite    |
| AI        | Google Gemini Pro                |
| Auth      | JWT (python-jose + bcrypt)       |

## 🚀 Quick Start

### Backend
```bash
cd nyayamitra/backend
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

### Frontend
```bash
cd nyayamitra/frontend
npm install
npm run dev
```

## 🔑 Demo Accounts

| Role     | Username  | Password  |
|----------|-----------|-----------|
| Citizen  | meena     | meena123  |
| Lawyer   | advocate  | adv123    |

## 📍 URLs

- **App**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## ✨ Features

1. **Hindi Case Summaries** — AI translates legal jargon into plain Hindi
2. **Bail Application Generator** — Creates court-ready bail applications in Hindi & English
3. **Bail Eligibility Checker** — Auto-analyzes IPC sections for bail eligibility
4. **Lawyer Finder** — Find DLSA-empanelled free lawyers in your district
5. **Legal Aid Info** — DLSA/NALSA helpline numbers and eligibility info
6. **AI Legal Chat** — Ask questions in Hindi, Bhojpuri, Urdu, or English
7. **Hearing Timeline** — Track all court hearings with reminders

## 🌐 Languages Supported

Hindi, English, Bhojpuri, Hinglish, Awadhi, Urdu

## ⚖️ Important Disclaimer

NyayaMitra is an AI-assisted legal information tool. It does NOT provide legal advice. Users should always consult a qualified lawyer. Free legal aid is available through DLSA/NALSA (Helpline: 15100).

## 📁 Project Structure

```
nyayamitra/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── config.py        # Settings
│   │   ├── database.py      # SQLAlchemy async
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT auth
│   │   ├── seed.py          # Demo data seeder
│   │   ├── api/             # Route handlers
│   │   └── services/        # AI & business logic
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API client & demo data
│   └── package.json
├── DEMO_SCRIPT.md
└── README.md
```

## 🇮🇳 Built for India

*"40 million cases. 75% can't afford lawyers. NyayaMitra: Free for all."*
