const { supabase } = require('../utils/supabaseClient');

function calculateStreak(sessionsList) {
  if (!sessionsList || sessionsList.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique days of sessions, sorted descending
  const days = [...new Set(
    sessionsList.map(s => {
      const d = new Date(s.completed_at || s.completedAt || s.completedAt);
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

exports.getStats = async (req, res) => {
  try {
    const userId = req.auth?.userId || 'anonymous';
    
    // Fetch sessions from Supabase for this user (ordered from oldest to newest)
    const { data: userSessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    if (error) {
      throw error;
    }

    const sessionsList = userSessions || [];
    const totalSessions = sessionsList.length;
    const avgScore = sessionsList.length > 0
      ? Math.round(sessionsList.reduce((sum, s) => sum + (s.score || 0), 0) / sessionsList.length)
      : 0;

    const questionsByType = sessionsList.reduce((acc, s) => {
      const questions = s.questions_answered || s.questionsAnswered || [];
      questions.forEach(q => {
        acc[q.type] = (acc[q.type] || 0) + 1;
      });
      return acc;
    }, {});

    // Calculate score trend (last 5 sessions)
    const recentScores = sessionsList.slice(-5).map(s => s.score || 0);
    const improvement = recentScores.length >= 2
      ? `${recentScores[recentScores.length - 1] - recentScores[0] >= 0 ? '+' : ''}${recentScores[recentScores.length - 1] - recentScores[0]}%`
      : '0%';

    // Map sessions to frontend format: completed_at -> completedAt, questions_answered -> questionsAnswered
    const mappedRecentSessions = sessionsList.slice(-5).reverse().map(s => ({
      id: s.id,
      role: s.role,
      level: s.level,
      score: s.score,
      duration: s.duration,
      type: s.type,
      questionsAnswered: s.questions_answered || s.questionsAnswered || [],
      completedAt: s.completed_at || s.completedAt
    }));

    res.json({
      stats: {
        totalSessions,
        totalQuestions: sessionsList.reduce((sum, s) => {
          const questions = s.questions_answered || s.questionsAnswered || [];
          return sum + (questions.length || 0);
        }, 0),
        avgScore,
        streak: calculateStreak(sessionsList),
        improvement,
        topRole: sessionsList.length > 0
          ? Object.entries(
              sessionsList.reduce((acc, s) => { acc[s.role] = (acc[s.role] || 0) + 1; return acc; }, {})
            ).sort((a, b) => b[1] - a[1])[0]?.[0]
          : 'Not started',
      },
      recentSessions: mappedRecentSessions,
      questionsByType,
    });
  } catch (error) {
    console.error('getStats error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve statistics', message: error.message });
  }
};

exports.saveSession = async (req, res) => {
  try {
    const { role, level, score, questionsAnswered, duration, type } = req.body;
    const userId = req.auth?.userId || 'anonymous';

    const session = {
      id: `session_${Date.now()}`,
      user_id: userId,
      role,
      level,
      score,
      questions_answered: questionsAnswered || [],
      duration,
      type,
      completed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Return in frontend format
    const returnedSession = {
      id: data.id,
      role: data.role,
      level: data.level,
      score: data.score,
      duration: data.duration,
      type: data.type,
      questionsAnswered: data.questions_answered,
      completedAt: data.completed_at
    };

    res.json({ session: returnedSession, message: 'Session saved successfully' });
  } catch (error) {
    console.error('saveSession error:', error.message);
    res.status(500).json({ error: 'Failed to save session', message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const userId = req.auth?.userId || 'anonymous';

    const { data: userSessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw error;
    }

    const mappedSessions = (userSessions || []).map(s => ({
      id: s.id,
      role: s.role,
      level: s.level,
      score: s.score,
      duration: s.duration,
      type: s.type,
      questionsAnswered: s.questions_answered || s.questionsAnswered || [],
      completedAt: s.completed_at || s.completedAt
    }));

    res.json({ sessions: mappedSessions });
  } catch (error) {
    console.error('getSessions error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve sessions', message: error.message });
  }
};

