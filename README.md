# Hirely — AI Resume & ATS Strategic Optimizer

![Hirely App](frontend/src/assets/hero.png)

> **Hirely** is a high-performance desktop application designed to score, analyze, and optimize resumes for enterprise Applicant Tracking Systems (ATS) using AI. Designed with Apple macOS & iOS Human Interface Guidelines (HIG) aesthetics, Hirely provides job seekers and recruitment consultants with actionable feedback to maximize interview callback rates.

---

## 🚀 Key Features

- ⚡ **ATS Pass Rate Scoring**: Instant 0–100% compatibility score based on formatting, keyword density, and section hierarchy.
- 🎯 **Job Description Matching**: Compare your resume directly against specific job postings to view exact match percentages and critical missing keywords.
- 📊 **Skill Gap Analysis**: Breakdown of hard skills, soft skills, recommended certifications, and missing industry term recommendations.
- 🌓 **macOS Light & Dark Theme Support**: Liquid glassmorphism UI with native theme switching tailored for macOS and Windows.
- 🔑 **1-Click Authentication & Session Persistence**: Auto-login session memory that skips login screens on startup and supports 1-click credential loading.
- 📄 **Exportable Reports**: Generate detailed PDF diagnostic reports for resume optimization.
- 🔒 **End-to-End Privacy**: All data is stored locally in an encrypted SQLite database.

---

## 🛠️ Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Desktop App** | Electron 33, Electron Builder |
| **Frontend UI** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend Service** | Node.js, Express, Sequelize ORM |
| **Database** | SQLite3 (Desktop/Local), MySQL (Production ready) |
| **AI Integration** | OpenAI API Services (PDF Extraction & ATS Parsing) |

---

## 📁 Project Structure

```
ai-resume-analyser/
├── backend/                  # Express REST API Server
│   ├── data/                 # SQLite Database storage
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers (Auth, Resumes, Analyses)
│   │   ├── middleware/       # Auth JWT & Multer upload handling
│   │   ├── models/           # Sequelize Models (User, Resume, Analysis)
│   │   ├── routes/           # Express API endpoints
│   │   └── services/         # OpenAI & PDF parsing services
│   └── package.json
├── electron/                 # Electron Desktop Wrapper
│   ├── assets/               # App icons (.icns, .ico, .png)
│   ├── main.js               # Main process & Express server manager
│   └── preload.js            # Secure IPC Bridge
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── api/              # Axios instance & endpoint definitions
│   │   ├── components/       # UI Components & Layouts (Sidebar, AppLayout, etc.)
│   │   ├── context/          # Auth & Theme Context Providers
│   │   ├── pages/            # App Views (Landing, Dashboard, Upload, Analysis, etc.)
│   │   └── types/            # TypeScript Interface definitions
│   └── package.json
├── package.json              # Root build & distribution scripts
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (`v18.0.0` or higher)
- `npm` (`v9.0.0` or higher)

### 1. Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-.git
cd AI_Resume_Analyser-Hirely-
npm run postinstall
```

### 2. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5050
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key
```

---

## 💻 Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both Frontend (Vite) and Backend (Nodemon) concurrently |
| `npm run dev:desktop` | Launches the Electron desktop app connected to Vite dev server |
| `npm run dev:frontend` | Runs Frontend only on `http://localhost:5173` |
| `npm run dev:backend` | Runs Backend only on `http://localhost:5050` |

---

## 📦 Building Distribution Installers

Build standalone installers for macOS and Windows:

```bash
# Build production frontend bundle
npm run build:frontend

# Package unpacked desktop application
npm run pack

# Build macOS DMG & ZIP installers
npm run dist:mac

# Build Windows NSIS & Portable EXE installers
npm run dist:win

# Build all platform installers (macOS + Windows)
npm run dist:all
```

Generated installer packages will be placed in the `dist_electron/` directory:
- 🍏 **macOS**: `dist_electron/Hirely-1.0.0-arm64.dmg`
- 🪟 **Windows**: `dist_electron/Hirely Setup 1.0.0.exe`

---

## 🔒 Security & Privacy

Hirely processes resume files locally. User data and analysis records are saved in your local SQLite storage (`ai_resume_analyser.sqlite`). No user data is sent to external third parties other than direct OpenAI API endpoints for document evaluation.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
