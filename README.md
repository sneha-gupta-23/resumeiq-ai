# 🚀 ResumeIQ AI

AI-powered Resume Analyzer & Interview Preparation Platform

ResumeIQ AI is a full-stack web application that analyzes a resume against a job description using Google Gemini AI. It extracts text from uploaded PDF resumes and generates resume scores, strengths, missing skills, resume improvement suggestions, interview questions, personalized self-introductions, and learning recommendations.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js) ![Google Gemini](https://img.shields.io/badge/Google-Gemini-blue?logo=google) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://resumeiq-ai-red.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge)](https://resumeiq-ai-vcee.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/sneha-gupta-23/resumeiq-ai)

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📊 Resume Scoring** | Get a 0–100 match score with animated progress visualization |
| **💪 Strengths Analysis** | Identify your key strengths that align with the job |
| **⚠️ Gap Detection** | Discover missing skills and qualifications |
| **✏️ Resume Improvements** | Receive actionable suggestions to enhance your resume |
| **💻 Technical Questions** | Practice with AI-generated technical interview questions |
| **🤝 HR Questions** | Prepare for behavioral and HR interview questions |
| **🎤 Self Introduction** | Get a polished 30-second self-introduction script |
| **📚 Learning Resources** | Personalized study topics to fill knowledge gaps |
| **🌙 Dark Mode** | Easy on the eyes with a beautiful dark theme toggle |
| **📋 Copy to Clipboard** | One-click copy for any question or section |
| **📄 Download as PDF** | Export your full analysis report |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4**
- **React Router v7**
- **Axios**

### Backend
- **Node.js** + **Express.js**
- **Multer** (PDF upload handling)
- **pdf-parse** (PDF text extraction)
- **@google/genai** (Gemini API)

### Deployment
- **Frontend** → Vercel
- **Backend** → Render

---

## 📁 Project Structure

```
resumeiq-ai/
├── client/                       # React frontend (Vite)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx   # Dark mode context
│   │   ├── pages/
│   │   │   ├── AnalyzePage.jsx   # Upload & analyze
│   │   │   ├── HomePage.jsx      # Landing page
│   │   │   └── ResultsPage.jsx   # Analysis results
│   │   ├── services/
│   │   │   └── api.js            # Axios HTTP client
│   │   ├── App.jsx               # Root component
│   │   ├── index.css             # Design system & Tailwind
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                       # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── analyzeController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js
│   │   ├── routes/
│   │   │   └── analyzeRoutes.js
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   └── pdfService.js
│   │   └── utils/
│   │       └── validateInputs.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20 or later
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/sneha-gupta-23/resumeiq-ai.git

cd resumeiq-ai
```

### 2. Set Up the Backend

```bash
cd server
npm install

# Create your environment file
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Set Up the Frontend

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Edit `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 5. Run Locally

**Start the backend** (from `server/` directory):
```bash
npm run dev
```

**Start the frontend** (from `client/` directory, in a new terminal):
```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to the backend at `http://localhost:5000`.

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL` = your deployed backend URL
4. Deploy!

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Set the **Root Directory** to `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add environment variables: `GEMINI_API_KEY`, `CLIENT_URL` (your Vercel frontend URL)
6. Deploy!

---

## 🔌 API Reference

### `POST /api/analyze`

Analyzes a resume against a job description.

**Request** (multipart/form-data):
| Field | Type | Description |
|-------|------|-------------|
| `resume` | File (PDF) | Resume PDF file (max 10 MB) |
| `jobDescription` | String | Job description text |

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "resumeScore": 75,
    "strengths": ["..."],
    "missingSkills": ["..."],
    "resumeImprovements": ["..."],
    "technicalQuestions": ["..."],
    "hrQuestions": ["..."],
    "selfIntroduction": "...",
    "learningResources": ["..."]
  }
}
```

### `GET /api/health`

Health check endpoint. Returns `{ "status": "ok" }`.

---

## 🔮 Future Improvements

- [ ] **Multiple Resume Formats** — Support DOCX, TXT uploads
- [ ] **Analysis History** — Save and compare past analyses (database)
- [ ] **Mock Interview Mode** — Interactive AI-driven interview simulation
- [ ] **Resume Builder** — Generate an improved resume based on suggestions
- [ ] **LinkedIn Integration** — Import profile data directly
- [ ] **Batch Analysis** — Analyze against multiple job descriptions at once
- [ ] **User Authentication** — Save preferences and history with login
- [ ] **Real-time Streaming** — Stream AI responses for faster perceived performance

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ using React, Node.js, and Google Gemini AI
</p>

## 👩‍💻 Author

**Sneha Gupta**

- GitHub: https://github.com/sneha-gupta-23
- Live Demo: https://resumeiq-ai-red.vercel.app/
