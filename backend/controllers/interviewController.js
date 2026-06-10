const { generateWithFallback } = require('../utils/geminiHelper');

const JOB_ROLES = [
  { id: 'software-engineer', label: 'Software Engineer', icon: '💻' },
  { id: 'product-manager', label: 'Product Manager', icon: '📊' },
  { id: 'data-scientist', label: 'Data Scientist', icon: '🔬' },
  { id: 'frontend-developer', label: 'Frontend Developer', icon: '🎨' },
  { id: 'backend-developer', label: 'Backend Developer', icon: '⚙️' },
  { id: 'devops-engineer', label: 'DevOps Engineer', icon: '🚀' },
  { id: 'machine-learning', label: 'ML Engineer', icon: '🤖' },
  { id: 'system-design', label: 'System Design', icon: '🏗️' },
  { id: 'marketing', label: 'Marketing Manager', icon: '📢' },
  { id: 'ux-designer', label: 'UX Designer', icon: '✏️' },
];

function extractJSON(text, type = 'object') {
  try {
    return JSON.parse(text.trim());
  } catch (_) {
    const pattern = type === 'array' ? /\[\s*[\s\S]*?\s*\]/ : /\{\s*[\s\S]*?\s*\}/;
    const match = text.match(pattern);
    if (!match) throw new Error('Could not parse response as JSON');
    return JSON.parse(match[0]);
  }
}

exports.getJobRoles = (req, res) => {
  res.json({ roles: JOB_ROLES });
};

exports.generateQuestions = async (req, res) => {
  try {
    const { role, level, type, count = 5, topics = [] } = req.body;

    if (!role || !level) {
      return res.status(400).json({ error: 'Role and level are required' });
    }

    const topicsStr = topics.length > 0 ? `focusing on: ${topics.join(', ')}` : '';
    const prompt = `Generate ${count} ${type || 'mixed'} interview questions for a ${level} ${role} position ${topicsStr}.

Return ONLY a valid JSON array with no extra text, no markdown, no code fences:
[
  {
    "id": "q1",
    "question": "...",
    "type": "behavioral|technical|situational|system-design",
    "difficulty": "easy|medium|hard",
    "topic": "...",
    "hints": ["hint1", "hint2"],
    "expectedDuration": 120
  }
]

Make questions realistic, challenging, and specific to the role.`;

    const result = await generateWithFallback(prompt, {
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const content = result.response.text();
    const questions = extractJSON(content, 'array');

    res.json({ questions, role, level, type });
  } catch (error) {
    console.error('generateQuestions error:', error.message);
    res.status(500).json({ error: 'Failed to generate questions', message: error.message });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, role, level } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${level || 'mid-level'} ${role || 'software engineer'} position.

Question: ${question}

Candidate's Answer: ${answer}

Evaluate the answer and return ONLY a valid JSON object with no extra text, no markdown, no code fences:
{
  "score": <number 0-100>,
  "grade": "A|B|C|D|F",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "missedPoints": ["point1", "point2"],
  "sampleAnswer": "A strong answer would be...",
  "feedback": "Overall feedback paragraph",
  "communicationScore": <0-100>,
  "technicalScore": <0-100>,
  "relevanceScore": <0-100>
}

Be honest, constructive, and specific.`;

    const result = await generateWithFallback(prompt, {
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const content = result.response.text();
    const evaluation = extractJSON(content, 'object');

    res.json({ evaluation });
  } catch (error) {
    console.error('evaluateAnswer error:', error.message);
    res.status(500).json({ error: 'Failed to evaluate answer', message: error.message });
  }
};

exports.startMockInterview = async (req, res) => {
  try {
    const { role, level, interviewType, previousMessages = [] } = req.body;

    const systemPrompt = `You are an experienced interviewer at a top tech company conducting a ${interviewType || 'technical'} interview for a ${level} ${role} position.

Your style:
- Professional but friendly
- Ask one question at a time
- Follow up on answers naturally
- Provide brief acknowledgments before moving on
- After 5-7 exchanges, wrap up and give final feedback

Keep responses concise (2-4 sentences max unless giving final feedback). When giving feedback at the end, include scores for: communication, technical knowledge, problem-solving, and overall fit.`;

    const messages = previousMessages.length === 0
      ? [{ role: 'user', content: 'Start the interview. Greet me briefly and ask your first question.' }]
      : previousMessages;

    // Map messages to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const result = await generateWithFallback({ contents }, {
      systemInstruction: systemPrompt
    });
    const responseText = result.response.text();

    res.json({
      response: responseText,
      role: 'assistant',
    });
  } catch (error) {
    console.error('startMockInterview error:', error.message);
    res.status(500).json({ error: 'Failed to run mock interview', message: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const { sessionData } = req.body;

    const prompt = `Analyze this interview session data and provide comprehensive feedback.

Session: ${JSON.stringify(sessionData)}

Return ONLY a valid JSON object with no extra text, no markdown, no code fences:
{
  "overallScore": <0-100>,
  "summary": "2-3 sentence summary",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "criticalImprovements": ["area1", "area2"],
  "actionPlan": [
    {"week": 1, "focus": "...", "tasks": ["task1", "task2"]},
    {"week": 2, "focus": "...", "tasks": ["task1", "task2"]},
    {"week": 3, "focus": "...", "tasks": ["task1", "task2"]}
  ],
  "resourceRecommendations": ["resource1", "resource2", "resource3"],
  "readinessLevel": "not-ready|almost-ready|ready|highly-ready"
}`;

    const result = await generateWithFallback(prompt, {
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const content = result.response.text();
    const feedback = extractJSON(content, 'object');

    res.json({ feedback });
  } catch (error) {
    console.error('getFeedback error:', error.message);
    res.status(500).json({ error: 'Failed to get feedback', message: error.message });
  }
};
