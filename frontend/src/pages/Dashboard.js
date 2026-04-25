import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { Brain, MessageSquare, FileText, BookOpen, TrendingUp, Flame, Target, Clock, ChevronRight, Award, Zap } from 'lucide-react';

const quickActions = [
  { to: '/app/practice', icon: Brain, label: 'Quick Practice', desc: 'Answer AI-generated questions', color: '#6366f1' },
  { to: '/app/mock', icon: MessageSquare, label: 'Mock Interview', desc: 'Full AI interview simulation', color: '#10b981' },
  { to: '/app/resume', icon: FileText, label: 'Resume AI', desc: 'Analyze & improve your resume', color: '#f59e0b' },
  { to: '/app/questions', icon: BookOpen, label: 'Question Bank', desc: 'Browse curated questions', color: '#06b6d4' },
];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}20`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, sessionsRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getSessions(),
        ]);
        setStats(statsRes.data.stats);
        setSessions(sessionsRes.data.sessions.slice(0, 5));
      } catch (e) {
        // Use defaults if backend not running
        setStats({ totalSessions: 0, totalQuestions: 0, avgScore: 0, streak: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--emerald)';
    if (score >= 50) return 'var(--amber)';
    return 'var(--rose)';
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
            Welcome back! 👋
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Ready to crush your next interview? Let's get started.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        <StatCard icon={Brain} label="Sessions Completed" value={loading ? '—' : stats?.totalSessions || 0} sub="Total practice sessions" color="#6366f1" />
        <StatCard icon={Target} label="Questions Answered" value={loading ? '—' : stats?.totalQuestions || 0} sub="All time" color="#10b981" />
        <StatCard icon={TrendingUp} label="Average Score" value={loading ? '—' : `${stats?.avgScore || 0}%`} sub="Across all sessions" color="#f59e0b" />
        <StatCard icon={Flame} label="Day Streak" value={loading ? '—' : `${stats?.streak || 0}d`} sub="Keep it going!" color="#f43f5e" />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 36 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} color="var(--accent-bright)" /> Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {quickActions.map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '22px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Sessions */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} color="var(--accent-bright)" /> Recent Sessions
          </h3>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Brain size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No sessions yet.</p>
              <Link to="/app/practice" style={{ color: 'var(--accent-bright)', fontSize: '0.85rem', marginTop: 8, display: 'inline-block' }}>
                Start your first session →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sessions.map((s) => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px', borderRadius: 10,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{s.role}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.type} • {s.level}</div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
                    color: getScoreColor(s.score)
                  }}>
                    {s.score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={16} color="var(--accent-bright)" /> Pro Tips
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { tip: 'Use STAR method for behavioral questions', detail: 'Situation, Task, Action, Result' },
              { tip: 'Think out loud during technical problems', detail: 'Interviewers value your thought process' },
              { tip: 'Research the company before mock interviews', detail: 'Show genuine interest and fit' },
              { tip: 'Practice 3+ sessions per week', detail: 'Consistency beats cramming' },
            ].map(({ tip, detail }, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12,
                padding: '12px', borderRadius: 10,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-bright)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 2 }}>{tip}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
