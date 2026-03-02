<div align="center">
  <img src="https://img.icons8.com/external-solid-gradient-user-interface/64/000000/external-ai-brain-solid-gradient-solid-gradient-user-interface.png" alt="AI Job Matcher Logo" />
  <h1 align="center">🎯 AI Job Matcher</h1>
  <p align="center">
    <strong>Your Intelligent Career Compass</strong><br>
    <i>"Find your dream job with Precision AI."</i>
  </p>
  <p align="center">
    <a href="#sparkles-key-features">Features</a> •
    <a href="#hammer_and_wrench-tech-stack">Tech Stack</a> •
    <a href="#rocket-quick-start">Quick Start</a> •
    <a href="#brain-how-it-works">How It Works</a>
  </p>
</div>

---

## 🚀 Overview

**AI Job Matcher** is a next-generation SaaS platform designed to eliminate the noise of job hunting. Say goodbye to scrolling through hundreds of irrelevant job postings. 

Our application allows users to upload their resumes, seamlessly extracts and analyzes core skills using deep learning algorithms, and live-scans real-time job listings from the deep web (e.g., LinkedIn). The result? Highly accurate, intelligently scored job recommendations tailored perfectly to your unique professional DNA. 

## ✨ Key Features

- **🧠 Deep Learning Skill Parsing**  
  Uses advanced Google Gemini AI to analyze your uploaded resume and extract semantic meaning, uncovering your *true* value beyond simple keyword matching.
  
- **🕸️ Deep Web Search & Scoring**  
  Live-scans top employment platforms (like LinkedIn) and immediately scores open opportunities against your profile parameters providing a personalized "Match Score" with AI reasoning.

- **🛡️ 100% Safe Manual Apply**  
  Zero risk of account bans or CAPTCHAs. We do the heavy lifting of finding the absolute best matches, and you execute the final click to safely apply.

- **📊 Beautiful, Functional UI/UX**  
  Built with Framer Motion, Tailwind CSS, and Lucide icons, the platform boasts buttery-smooth glassmorphic animations and a premium dark-mode aesthetic.

- **🔒 Secure Authentication**  
  Robust user registration and login handled seamlessly through Firebase Authentication.

---

## 🛠️ Tech Stack

### Frontend
- **React 18 & Next.js 14** - App Router for optimized, server-rendered React applications.
- **Tailwind CSS** - Rapid, utility-first UI styling.
- **Framer Motion** - Cinematic, high-performance UI animations.
- **Lucide React** - Clean and consistent iconography.

### Backend & DB
- **Next.js API Routes** - Serverless backend logic.
- **Firebase Auth** - Secure, scalable user authentication.
- **Firestore Database** - NoSQL cloud database for storing user profiles and match history.

### AI & Automation
- **Playwright** - Robust browser automation for dynamically scraping external job platforms.
- **Google Gemini API** - State-of-the-art LLM used for intelligent resume parsing and job suitability reasoning.
- **RapidAPI** - Fetching structured job data fallback mechanisms.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Muthurasu-6319/AI-Job-Matcher---Your-Intelligent-Career-Compass.git
cd AI-Job-Matcher---Your-Intelligent-Career-Compass
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and configure the following variables:
```env
# Firebase Credentials (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key_here"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# AI & Scraper APIs (Server-side)
NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_api_key"
RAPIDAPI_KEY="your_rapidapi_key"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the platform in action.

---

## 🧠 How It Works

1. **Create a Profile:** Sign up securely via Firebase.
2. **Setup Matcher Data:** Upload your PDF resume. The AI automatically fills out your structured timeline and extracts your skills. Set your target location and role.
3. **Launch Matcher Engine:** Click "Refresh Matches" in the dashboard. The backend Playwright agent discreetly fetches live roles based on your inputs.
4. **AI Processing:** Gemini scores each job, checks for skill gaps, and returns an overarching "Match Score". 
5. **Take Action:** Review the AI reasoning behind each match, and securely click "Manual Apply" to finalize your application on the native platform.

---

## 🤝 Contribution
Contributions, issues, and feature requests are welcome!

<div align="center">
  <i>Built with ❤️ by a passionate developer exploring the future of Agentic automation.</i>
</div>
