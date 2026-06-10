import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import {
  Brain, MessageSquare, FileText, BookOpen,
  TrendingUp, Flame, Target, Clock, ChevronRight,
  Award, Zap, ArrowUpRight, Sparkles, Activity
} from 'lucide-react';

const quickActions = [
  {
    to: '/app/practice', icon: Brain, label: 'Quick Practice',
    desc: 'AI-generated questions for your role',
    color: '#6366f1', glow: 'rgba(99,102,241,0.2)',
    badge: 'Popular',
  },
  {
    to: '/app/mock', icon: MessageSquare, label: 'Mock Interview',
    desc: 'Full live interview simulation',
    color: '#10b981', glow: 'rgba(16,185,129,0.2)',
    badge: null,
  },
  {
    to: '/app/resume', icon: FileText, label: 'Resume Optimizer',
    desc: 'ATS-friendly resume analysis',
    color: '#f59e0b', glow: 'rgba(245,158,11,0.2)',
    badge: null,
  },
  {
    to: '/app/questions', icon: BookOpen, label: 'Question Bank',
    desc: '500+ curated practice questions',
    color: '#06b6d4', glow: 'rgba(6,182,212,0.2)',
    badge: 'New',
  },
];

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '22px 24px',
        borderRadius: 14,
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? `${color}35` : 'var(--border)'}`,
        transition: 'all 0.25s var(--ease)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 8px 32px ${color}20` : 'none',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}15`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s var(--ease)',
          boxShadow: hovered ? `0 0 0 4px ${color}10` : 'none',
        }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
          lineHeight: 1, marginBottom: 4,
          color: 'var(--text-primary)',
        }}>{value}</div>
        {sub && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {trend && (
              <span style={{
                color: trend > 0 ? 'var(--emerald)' : 'var(--rose)',
                display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600,
              }}>
                <TrendingUp size={11} />
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({ to, icon: Icon, label, desc, color, glow, badge }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '20px 22px',
          borderRadius: 14,
          background: hovered ? `linear-gradient(135deg, ${color}10 0%, var(--bg-card) 100%)` : 'var(--bg-card)',
          border: `1px solid ${hovered ? `${color}35` : 'var(--border)'}`,
          transition: 'all 0.25s var(--ease)',
          transform: hovered ? 'translateY(-3px)' : 'none',
          boxShadow: hovered ? `0 8px 32px ${glow}` : 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: `${color}15`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s var(--ease)',
          boxShadow: hovered ? `0 4px 16px ${glow}` : 'none',
        }}>
          <Icon size={21} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.93rem' }}>{label}</div>
            {badge && (
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: badge === 'New' ? 'var(--emerald-dim)' : 'var(--accent-glow)',
                color: badge === 'New' ? 'var(--emerald-light)' : 'var(--accent-bright)',
                border: `1px solid ${badge === 'New' ? 'var(--emerald-border)' : 'rgba(99,102,241,0.2)'}`,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>{badge}</span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
        </div>
        <ArrowUpRight
          size={16}
          color={hovered ? color : 'var(--text-muted)'}
          style={{ flexShrink: 0, transition: 'all 0.25s', opacity: hovered ? 1 : 0.4 }}
        />
      </div>
    </Link>
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
      } catch {
        setStats({ totalSessions: 0, totalQuestions: 0, avgScore: 0, streak: 0 });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--emerald)';
    if (score >= 50) return 'var(--amber)';
    return 'var(--rose)';
  };

  const statCards = [
    { icon: Brain, label: 'Sessions Completed', value: loading ? '—' : (stats?.totalSessions || 0), sub: 'Total practice sessions', color: '#6366f1', trend: null },
    { icon: Target, label: 'Questions Answered', value: loading ? '—' : (stats?.totalQuestions || 0), sub: 'All time', color: '#10b981', trend: null },
    { icon: Activity, label: 'Average Score', value: loading ? '—' : `${stats?.avgScore || 0}%`, sub: 'Across all sessions', color: '#f59e0b', trend: 8 },
    { icon: Flame, label: 'Day Streak', value: loading ? '—' : `${stats?.streak || 0}d`, sub: 'Keep it going!', color: '#f43f5e', trend: null },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Welcome header */}
      <div className="animate-in" style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800, letterSpacing: '-0.02em',
              }}>
                Good morning! 👋
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Ready to crush your next interview? Here's your prep overview.
            </p>
          </div>
          <Link to="/app/practice" className="btn btn-primary" style={{ gap: 8 }}>
            <Sparkles size={16} /> Start Practicing
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="animate-in" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14, marginBottom: 36,
        animationDelay: '0.05s',
      }}>
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-in" style={{ marginBottom: 36, animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={16} color="var(--accent-bright)" fill="var(--accent-bright)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {quickActions.map(action => (
            <QuickActionCard key={action.to} {...action} />
          ))}
        </div>
      </div>

      {/* Bottom two-column section */}
      <div className="animate-in" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20,
        animationDelay: '0.15s',
      }}>
        {/* Recent sessions */}
        <div style={{
          padding: 24, borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} color="var(--accent-bright)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700 }}>Recent Sessions</h3>
            </div>
            <Link to="/app/practice" style={{ fontSize: '0.75rem', color: 'var(--accent-bright)', textDecoration: 'none', fontWeight: 500 }}>
              View all →
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <Brain size={24} color="var(--text-muted)" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 14 }}>No sessions yet.</p>
              <Link to="/app/practice" className="btn btn-secondary btn-sm">
                Start your first session <ChevronRight size={13} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessions.map((s, i) => (
                <div key={s.id || i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 2, color: 'var(--text-primary)' }}>{s.role}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.type} • {s.level}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    background: `${getScoreColor(s.score)}18`,
                    border: `1px solid ${getScoreColor(s.score)}35`,
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
                    color: getScoreColor(s.score),
                  }}>
                    {s.score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pro Tips */}
        <div style={{
          padding: 24, borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Award size={15} color="var(--amber)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700 }}>Interview Tips</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { num: '01', tip: 'Use the STAR method', detail: 'Situation · Task · Action · Result for behavioral answers', color: '#6366f1' },
              { num: '02', tip: 'Think out loud', detail: 'Interviewers value your reasoning, not just the solution', color: '#10b981' },
              { num: '03', tip: 'Ask clarifying questions', detail: 'Demonstrates seniority and collaborative thinking', color: '#f59e0b' },
              { num: '04', tip: 'Practice 3× per week', detail: 'Consistency beats cramming — build the habit', color: '#f43f5e' },
            ].map(({ num, tip, detail, color }) => (
              <div key={num} style={{
                display: 'flex', gap: 14, padding: '12px 14px',
                borderRadius: 10, background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                  color, minWidth: 24, paddingTop: 1,
                }}>{num}</div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3, color: 'var(--text-primary)' }}>{tip}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
