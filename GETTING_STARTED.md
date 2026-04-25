# Getting Started with PrepAI 🚀

## Quick Start (5 minutes)

### 1. Get Your API Key
- Go to https://console.anthropic.com/
- Sign up or log in
- Create API key from dashboard
- Copy your key (starts with `sk-`)

### 2. Setup Backend

```bash
cd interview-prep/backend

# Install dependencies
npm install

# Create .env file with your API key
echo "PORT=5000
ANTHROPIC_API_KEY=sk-your-api-key-here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development" > .env

# Start server
npm start
```

You should see: `🚀 Server running on http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd interview-prep/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## First Steps

1. **Click "Start Practicing"** on the landing page
2. **Configure your session:**
   - Select target role (e.g., "Software Engineer")
   - Choose level (e.g., "Mid-level")
   - Pick interview type (e.g., "Technical")
   - Select number of questions (e.g., 5)
3. **Click "Generate Questions"** and wait 10-15 seconds
4. **Answer the question** with a detailed response
5. **Click "Submit Answer"** to get evaluation
6. **Review feedback:**
   - Your score (0-100)
   - Grade (A-F)
   - Strengths
   - Areas to improve
   - Sample answer
7. **Continue** to next question or finish session

## Key Features to Explore

### 📊 Dashboard
- View practice statistics
- See recent sessions
- Get daily tips

### 🧠 Practice Session
- Answer AI-generated questions
- Get real-time feedback
- Track improvement

### 📚 Question Bank
- Browse all generated questions
- Filter by role, level, type, difficulty
- Search and study

### 💬 Mock Interview
- Have a conversation with AI interviewer
- Get natural follow-up questions
- Export transcript

### 📄 Resume AI
- Paste your resume
- Get ATS score and feedback
- Tailor to job descriptions

## Common Questions

### Q: Why is the first request slow?
A: Claude AI needs to process your request. First request takes 10-15 seconds, subsequent ones are faster.

### Q: Can I use without API key?
A: No, you need an Anthropic API key. It's free to sign up and get credits.

### Q: Where does my data go?
A: Currently stored in backend memory (resets on server restart). For production, use a database.

### Q: Can I use on mobile?
A: Yes! The app is responsive and works on phones/tablets.

### Q: How do I export my data?
A: Session transcripts can be copied from mock interview results.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Enter` | New line in textarea |
| `Enter` | Submit answer/message (in chat) |
| `Esc` | Close dialogs (if added later) |

## Troubleshooting

### "Cannot POST /api/interview/generate-questions"
- ✅ Backend not running? Start it with `npm start` in backend folder
- ✅ Check API key is valid in .env
- ✅ Verify ports (backend 5000, frontend 3000)

### "API key not valid"
- ✅ Go to console.anthropic.com
- ✅ Generate new key
- ✅ Copy exact value (including `sk-` prefix)
- ✅ Update .env file

### Blank screen after clicking Generate
- ✅ Check browser console (F12) for errors
- ✅ Verify backend is running
- ✅ Wait 10-15 seconds for AI response
- ✅ Try refreshing the page

### Resume Analysis not working
- ✅ Paste complete resume text
- ✅ Include all sections
- ✅ Keep under 10,000 characters (trim if needed)
- ✅ Ensure proper formatting

## File Structure Overview

```
interview-prep/
├── backend/
│   ├── server.js              ← Main server
│   ├── package.json           ← Dependencies
│   ├── .env                   ← Your API key here
│   ├── routes/                ← API endpoints
│   └── controllers/           ← Business logic
└── frontend/
    ├── package.json           ← Dependencies
    ├── src/
    │   ├── App.js            ← Main app
    │   ├── pages/            ← Different pages
    │   ├── utils/api.js      ← API calls
    │   └── index.css         ← Styles
    └── public/index.html      ← HTML file
```

## Performance Tips

1. **Close unused tabs** to free up memory
2. **Clear browser cache** if UI looks weird
3. **Restart servers** if something breaks
4. **Use incognito mode** to test without cache

## Next Steps

### To Extend the App:
1. Add database (MongoDB, PostgreSQL)
2. Implement user authentication
3. Add more interview types
4. Create custom question sets
5. Add video recording
6. Build mobile app

### To Deploy:
1. Backend: Deploy to Railway/Render/Heroku
2. Frontend: Deploy to Vercel/Netlify
3. Set environment variables on platform
4. Use production-grade database

## Code Walkthrough

### Adding a New Feature

**Backend:**
1. Create route in `routes/` folder
2. Create controller in `controllers/` folder
3. Add API logic using Claude

**Frontend:**
1. Create page in `pages/` folder
2. Call API using `utils/api.js`
3. Add styling with CSS variables
4. Add navigation to `Layout.js`

## Support Resources

- Anthropic Docs: https://docs.anthropic.com
- React Docs: https://react.dev
- Node.js Docs: https://nodejs.org/docs

## You're Ready! 🎉

Start practicing and crushing those interviews!

---

**Need help?** Check README.md for more details or review the code comments.
