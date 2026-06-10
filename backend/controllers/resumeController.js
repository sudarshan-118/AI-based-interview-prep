const { generateWithFallback } = require('../utils/geminiHelper');

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

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, targetRole, targetLevel } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const prompt = `Analyze this resume for a ${targetRole || 'software engineer'} (${targetLevel || 'mid-level'}) position.

Resume:
${resumeText}

Return ONLY a valid JSON object with no extra text, no markdown, no code fences:
{
  "overallScore": <0-100>,
  "atsScore": <0-100>,
  "sections": {
    "summary": {"score": <0-100>, "feedback": "..."},
    "experience": {"score": <0-100>, "feedback": "..."},
    "skills": {"score": <0-100>, "feedback": "..."},
    "education": {"score": <0-100>, "feedback": "..."}
  },
  "strengths": ["s1", "s2", "s3"],
  "weaknesses": ["w1", "w2", "w3"],
  "missingKeywords": ["k1", "k2", "k3", "k4", "k5"],
  "suggestedKeywords": ["k1", "k2", "k3"],
  "actionItems": ["a1", "a2", "a3", "a4"],
  "estimatedInterviewRate": <percentage 0-100>
}`;

    const result = await generateWithFallback(prompt, {
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const content = result.response.text();
    const analysis = extractJSON(content, 'object');

    res.json({ analysis });
  } catch (error) {
    console.error('analyzeResume error:', error.message);
    res.status(500).json({ error: 'Failed to analyze resume', message: error.message });
  }
};

exports.improveResume = async (req, res) => {
  try {
    const { resumeText, section, targetRole } = req.body;

    const prompt = `Improve the ${section || 'entire'} section of this resume for a ${targetRole || 'software engineer'} role.

Original:
${resumeText}

Return ONLY a valid JSON object with no extra text, no markdown, no code fences:
{
  "improvedText": "The improved resume text...",
  "changes": ["change1", "change2", "change3"],
  "explanation": "Why these changes improve the resume"
}`;

    const result = await generateWithFallback(prompt, {
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const content = result.response.text();
    const resultJson = extractJSON(content, 'object');

    res.json(resultJson);
  } catch (error) {
    console.error('improveResume error:', error.message);
    res.status(500).json({ error: 'Failed to improve resume', message: error.message });
  }
};

exports.tailorResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    const prompt = `Tailor this resume to match the job description. Highlight relevant experience, add matching keywords, and restructure as needed.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY a valid JSON object with no extra text, no markdown, no code fences:
{
  "tailoredResume": "The full tailored resume text...",
  "matchScore": <0-100>,
  "keywordMatches": ["k1", "k2"],
  "addedKeywords": ["k1", "k2"],
  "recommendations": ["r1", "r2", "r3"]
}`;

    const result = await generateWithFallback(prompt, {
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });
    const content = result.response.text();
    const resultJson = extractJSON(content, 'object');

    res.json(resultJson);
  } catch (error) {
    console.error('tailorResume error:', error.message);
    res.status(500).json({ error: 'Failed to tailor resume', message: error.message });
  }
};
