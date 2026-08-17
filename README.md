# Hirely - AI Resume & ATS Strategic Optimizer

An AI-powered desktop application built with **Electron** and **React** that helps job seekers analyze, evaluate, and optimize their resumes for Applicant Tracking Systems (ATS) and specific job opportunities.

---

## Features

* ATS Compatibility Scoring (0–100%)
* Job Description Matching & Keyword Analysis
* Missing Keyword Suggestions
* Technical & Soft Skill Gap Analysis
* Resume Quality & Readability Analysis
* ATS Filter Risk Detection
* Actionable Resume Improvement Recommendations
* Resume Analysis History & Version Tracking
* PDF & JSON Report Export
* Light & Dark Mode
* Modern macOS-inspired UI
* Persistent Login & 1-Click Sign In
* Local SQLite Data Storage
* Cross-platform desktop support (Windows & macOS)

---

## Tech Stack

* Electron 33
* React 18
* TypeScript
* Vite
* Tailwind CSS
* Node.js
* Express.js
* Sequelize ORM
* SQLite
* OpenAI API
* JWT Authentication
* Electron Builder

---

## Download

Download the latest version from the **Releases** section.

**Latest Release:** https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-/releases/latest

### Supported Platforms

* Windows (.exe)
* macOS (.dmg)

---

## Installation

### Clone the repository

```bash
git clone https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-.git
```

### Navigate to the project

```bash
cd AI_Resume_Analyser-Hirely-
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5050
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key
```

### Run the application

```bash
npm run dev
```

### Run the desktop application

```bash
npm run dev:desktop
```

---

## Build the Application

### Build frontend

```bash
npm run build:frontend
```

### Package the desktop application

```bash
npm run pack
```

### Build macOS installer

```bash
npm run dist:mac
```

### Build Windows installer

```bash
npm run dist:win
```

### Build all platforms

```bash
npm run dist:all
```

Generated installers will be available in:

```text
dist_electron/
```

---

## Project Structure

```text
ai-resume-analyser/
│
├── backend/
│   ├── data/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── services/
│
├── electron/
│   ├── assets/
│   ├── main.js
│   └── preload.js
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── types/
│
├── package.json
└── README.md
```

---

## Security & Privacy

Hirely uses **local SQLite storage** for application data and analysis records.

Resume content is sent to the **OpenAI API** when AI-powered analysis is requested.

Authentication is handled using **JWT-based security**, and API keys are stored through environment variables rather than being committed to the repository.

> **Note:** Users should avoid uploading highly sensitive documents unless they are comfortable with the applicable OpenAI API data-processing terms.

---

## Contributing

Contributions, suggestions, bug reports, and feature requests are welcome.

Feel free to fork the project, create a feature branch, and submit a pull request.

---

## License

This project is licensed under the MIT License.

---

## Developer

**Govinda Herath**

* GitHub: https://github.com/govindasathruwan
* LinkedIn: https://www.linkedin.com/in/govindaherath/

---

⭐ If you find **Hirely** useful, consider giving the repository a star!

🔗 **GitHub Repository:**
https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-
