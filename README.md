# InterviewForge

InterviewForge is a full-stack platform designed for software engineers to streamline their technical interview preparation. It helps candidates track coding problems, organize study schedules, write revision notes, and run AI-powered mock interviews with real-time feedback.

The platform integrates secure JWT authentication, Google OAuth2 sign-in, and the Gemini API for intelligence and feedback generation.

Node.js | Express | React | Vite | MongoDB | Gemini API

## Features

### Learning & Assessment
- Curated company-specific DSA sheet tracking
- Topic-wise problem checklists (Status: To Do, In Progress, Completed)
- Study planner with automated schedules
- Markdown notes editor for storing DSA patterns and solutions
- Automated revision cards for spaced repetition

### AI Intelligence
- AI Mock Interviews with custom topics and real-time questions
- Comprehensive mock feedback (scores, strengths, weaknesses)
- AI-generated solutions and complexity explanations for tracked problems

### Authentication & Security
- JWT-based email/password registration and login
- Google OAuth2 Social Login integration
- Password reset flow via secure email tokens
- Protected routes on both frontend and backend

## Repository Structure

```
InterviewForge
│
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controllers/  # API route handlers
│   │   ├── middleware/   # Authentication & error middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express route mapping
│   │   └── server.js     # Express app setup
│
├── frontend/
│   ├── public/           # Static assets & vercel configuration
│   ├── src/
│   │   ├── components/   # UI components (modals, sidebar, navbar)
│   │   ├── context/      # React context (Auth, Theme, Toast)
│   │   ├── pages/        # Views (Dashboard, Problems, Planner, Notes)
│   │   ├── utils/        # Axios clients and error handlers
│   │   ├── App.jsx       # Client router and layouts
│   │   └── main.jsx      # Vite entrypoint
│
└── README.md
```

## Core Models

### User
Tracks basic user profile information, encrypted passwords, and password reset tokens.

### Problem
Stores tracked DSA problems, difficulty level, platform origin, status, and custom notes.

### Note
Keeps user-written DSA notes linked to specific topics or problems.

### StudyPlan
Saves generated weekly study schedules, goals, and daily tasks.

### Revision
Manages revision items with spaced repetition loops (Easy, Medium, Hard feedback).

### Feedback
Stores detailed performance evaluations and scores from AI mock interviews.

## Development Setup

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (see `.env.example`).
4. Run the development server (runs on `http://localhost:5001`):
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file containing `VITE_GOOGLE_CLIENT_ID`.
4. Run the frontend development server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

## Production Build

### Frontend
Build static output directory:
```bash
cd frontend
npm run build
```

### Backend
Start the server in production mode:
```bash
cd backend
npm install --production
node src/server.js
```

## Future Roadmap
- Collaborative mock interview rooms with real-time video/chat
- Embedded code editor with live execution sandbox
- Spaced repetition notification system (email updates)
- In-depth performance dashboard metrics

## Resume Highlights
Key engineering components implemented:
- Full-stack Vite + React and Express Node.js architecture
- Secure token-based password reset authentication loop
- Google OAuth2 Social Login verification pipeline
- Spaced repetition revision logic with MongoDB scheduling
- Live Gemini API integration for interactive technical interviewing and feedback scoring
- Vercel multi-service routing configurations

## License
Distributed under the MIT License. See LICENSE for more details.