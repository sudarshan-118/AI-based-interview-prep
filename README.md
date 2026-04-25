# PrepAI - AI-Powered Interview Preparation Platform 🚀

A modern, full-stack web application that uses Claude AI to provide real-time interview coaching, resume analysis, and personalized practice sessions.

## Features ✨

### 1. **AI-Powered Question Generation**
- Generate custom interview questions based on role, experience level, and question type
- Questions include hints, difficulty ratings, and expected answer duration
- Covers technical, behavioral, situational, and system design questions

### 2. **Live Mock Interviews**
- Real-time AI interviewer that adapts to your responses
- Supports multiple interview types (Technical, Behavioral, System Design, Leadership)
- Track interview duration and get performance metrics
- Export interview transcripts for review

### 3. **Answer Evaluation**
- Get instant feedback on your practice answers
- Detailed scoring across communication, technical knowledge, and relevance
- Identify strengths and areas for improvement
- See sample strong answers for reference

### 4. **Resume Analysis & Optimization**
- Analyze resume for ATS compatibility and quality
- Get detailed feedback on each section (Summary, Experience, Skills, Education)
- Identify missing keywords for your target role
- Tailor resume to specific job descriptions
- Match score indicates how well your resume aligns with job requirements

### 5. **Progress Dashboard**
- Track your practice sessions and scores over time
- Visualize your improvement with session analytics
- Get personalized tips and recommendations
- Maintain your practice streak

## Tech Stack 🛠️

### Backend
- **Runtime**: Node.js with Express.js
- **AI**: Claude Sonnet 4 via Anthropic API
- **Security**: Helmet, CORS, Rate Limiting
- **API Format**: RESTful JSON

### Frontend
- **Framework**: React 18 with React Router
- **Styling**: Custom CSS with design system variables
- **HTTP Client**: Axios
- **UI/Animation**: Framer Motion, React Hot Toast
- **Icons**: Lucide React
- **Utilities**: Date-fns, React Circular Progressbar

## Project Structure

```
interview-prep/
├── backend/
│   ├── controllers/
│   │   ├── interviewController.js
│   │   ├── resumeController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── interview.js
│   │   ├── resume.js
│   │   └── dashboard.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js
│   │   ├── pages/
│   │   │   ├── Landing.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PracticeSession.js
│   │   │   ├── QuestionBank.js
│   │   │   ├── MockInterview.js
│   │   │   └── ResumeAnalyzer.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
└── README.md
```

## Installation & Setup 📋

### Prerequisites
- Node.js 16+ and npm/yarn
- Anthropic API key (get from https://console.anthropic.com)

### Backend Setup

1. **Clone or extract the project:**
```bash
cd interview-prep/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Add your API key:**
```env
PORT=5000
ANTHROPIC_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

5. **Start the backend:**
```bash
npm start
# For development with auto-reload:
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **In another terminal, navigate to frontend:**
```bash
cd interview-prep/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Start the development server:**
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Usage 🎯

### Dashboard
- View your practice statistics and recent sessions
- See quick action buttons to access all features
- Get personalized tips for interview success

### Practice Session
1. Select your target role, experience level, and interview type
2. Configure number of questions (3-10)
3. Answer each question with detailed responses
4. Get instant evaluation with scoring and feedback
5. Review improvements and sample strong answers
6. See overall session performance

### Question Bank
- Browse AI-generated questions filtered by role, level, type, and difficulty
- View hints for each question
- Search for specific topics
- Use as study material or generate new questions

### Mock Interview
1. Configure your interview (role, level, type)
2. Conduct a real-time conversation with the AI interviewer
3. Receive natural follow-up questions based on your answers
4. Get session summary and feedback when complete
5. Export interview transcript for review

### Resume Analysis
**Analyze:**
- Paste your resume to get comprehensive feedback
- View ATS compatibility score
- See detailed breakdown by section
- Get keyword recommendations
- Identify strengths and areas to improve

**Tailor:**
- Paste job description
- Get AI-tailored version of your resume
- See keyword match score
- Get recommendations for specific job

## API Endpoints 📡

### Interview APIs
- `POST /api/interview/job-roles` - Get available job roles
- `POST /api/interview/generate-questions` - Generate interview questions
- `POST /api/interview/evaluate-answer` - Evaluate answer to a question
- `POST /api/interview/mock-interview` - Conduct mock interview
- `POST /api/interview/feedback` - Get session feedback

### Resume APIs
- `POST /api/resume/analyze` - Analyze resume
- `POST /api/resume/improve` - Get improvement suggestions
- `POST /api/resume/tailor` - Tailor resume to job description

### Dashboard APIs
- `GET /api/dashboard/stats` - Get user statistics
- `POST /api/dashboard/session` - Save practice session
- `GET /api/dashboard/sessions` - Get past sessions

## Design System 🎨

### Color Palette
- **Primary**: Indigo (#6366f1)
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Alert**: Rose (#f43f5e)
- **Info**: Cyan (#06b6d4)

### Typography
- **Display**: Syne (bold, headings)
- **Body**: DM Sans (clean, readable)
- **Code**: JetBrains Mono (technical)

### Key UI Components
- Responsive cards with glassmorphism
- Smooth animations and transitions
- Progress bars and score visualizations
- Tag system for categorization
- Modal and toast notifications

## Features Breakdown 🔧

### AI Integration
- Uses Claude Sonnet 4 for all AI operations
- Processes responses in JSON format for structured data
- Handles errors gracefully with fallback responses

### Security
- Environment variable protection
- CORS configuration
- Rate limiting (100 requests per 15 min)
- Helmet.js for HTTP header security

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-optimized buttons
- Proper viewport scaling

## Customization 🎨

### Modify Interview Settings
Edit `ROLES`, `LEVELS`, `TYPES` in controllers and pages:
```javascript
const JOB_ROLES = [
  { id: 'role-id', label: 'Role Name', icon: '🎯' }
];
```

### Adjust Scoring
Modify evaluation logic in `interviewController.js`:
```javascript
// Customize scoring weights and criteria
```

### Customize Styling
Edit CSS variables in `index.css`:
```css
:root {
  --primary-color: #6366f1;
  --success-color: #10b981;
  /* ... more variables */
}
```

## Troubleshooting 🔧

### Backend won't start
- Check if port 5000 is available
- Verify ANTHROPIC_API_KEY is set
- Check Node.js version (need 16+)

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Verify CORS settings in backend

### API key errors
- Verify API key is valid at https://console.anthropic.com
- Check that it has appropriate permissions
- Ensure it's not rate-limited

### Resume/Question generation slow
- Normal for first request (cold start)
- AI model processes complex tasks
- Subsequent requests are faster

## Performance Tips ⚡

1. **Caching**: Backend stores session data (implement DB for production)
2. **Lazy Loading**: Pages load on demand
3. **Code Splitting**: React Router enables route-based splitting
4. **Optimization**: Images/fonts load asynchronously

## Deployment 🚀

### Backend (Node.js)
```bash
# Build
npm install --production

# Deploy to Heroku, Railway, Render, etc.
# Set environment variables in platform
```

### Frontend (React)
```bash
# Build production bundle
npm run build

# Deploy to Vercel, Netlify, etc.
# Set environment variables in platform
```

## Advanced Features (Future) 🔮

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication & profiles
- [ ] Saved practice history
- [ ] Video recording for mock interviews
- [ ] Code editor for technical interviews
- [ ] Custom question creation
- [ ] Interview scheduling
- [ ] Peer review system
- [ ] Achievement badges
- [ ] Study group collaboration

## Contributing 🤝

Contributions welcome! Areas to improve:
- Additional interview types
- More evaluation metrics
- Enhanced resume analysis
- Video interview support
- Database integration
- Mobile app version

## License 📄

MIT License - feel free to use for personal and commercial projects

## Support 💬

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Claude AI documentation
4. Contact support

---

**Built with ❤️ using Claude AI**

Make your interview preparation count. Good luck! 🎯
