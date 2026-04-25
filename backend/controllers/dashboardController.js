// In-memory storage (replace with DB in production)
const sessions = [];

function calculateStreak(sessions) {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique days of sessions, sorted descending
  const days = [...new Set(
    sessions.map(s => {
      const d = new Date(s.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )].sort((a, b) => b - a);

  let streak = 0;
  let expected = today.getTime();

  for (const day of days) {
    if (day === expected) {
      streak++;
      expected -= 86400000; // go back one day
    } else if (day < expected) {
      break; // gap in days
    }
  }

  return streak;
}

exports.getStats = (req, res) => {
  const totalSessions = sessions.length;
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length)
    : 0;

  const questionsByType = sessions.reduce((acc, s) => {
    (s.questionsAnswered || []).forEach(q => {
      acc[q.type] = (acc[q.type] || 0) + 1;
    });
    return acc;
  }, {});

  // Calculate score trend (last 5 sessions)
  const recentScores = sessions.slice(-5).map(s => s.score || 0);
  const improvement = recentScores.length >= 2
    ? `${recentScores[recentScores.length - 1] - recentScores[0] >= 0 ? '+' : ''}${recentScores[recentScores.length - 1] - recentScores[0]}%`
    : '0%';

  res.json({
    stats: {
      totalSessions,
      totalQuestions: sessions.reduce((sum, s) => sum + (s.questionsAnswered?.length || 0), 0),
      avgScore,
      streak: calculateStreak(sessions),
      improvement,
      topRole: sessions.length > 0
        ? Object.entries(
            sessions.reduce((acc, s) => { acc[s.role] = (acc[s.role] || 0) + 1; return acc; }, {})
          ).sort((a, b) => b[1] - a[1])[0]?.[0]
        : 'Not started',
    },
    recentSessions: sessions.slice(-5).reverse(),
    questionsByType,
  });
};

exports.saveSession = (req, res) => {
  try {
    const { role, level, score, questionsAnswered, duration, type } = req.body;

    const session = {
      id: `session_${Date.now()}`,
      role,
      level,
      score,
      questionsAnswered: questionsAnswered || [],
      duration,
      type,
      completedAt: new Date().toISOString(),
    };

    sessions.push(session);

    res.json({ session, message: 'Session saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save session' });
  }
};

exports.getSessions = (req, res) => {
  res.json({ sessions: sessions.slice().reverse() });
};
