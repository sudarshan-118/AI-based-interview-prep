import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, MessageSquare, FileText, TrendingUp, ChevronRight, Star, Zap, Target, Award } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Question Generation', desc: 'Get personalized questions tailored to your role, level, and target company', color: '#6366f1' },
  { icon: MessageSquare, title: 'Live Mock Interviews', desc: 'Practice with an AI interviewer that adapts and gives real-time coaching', color: '#10b981' },
  { icon: FileText, title: 'Resume Analysis', desc: 'ATS optimization and AI-powered resume improvements for your target role', color: '#f59e0b' },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Detailed analytics and performance insights to track your improvement', color: '#06b6d4' },
];

const stats = [
  { value: '50K+', label: 'Interviews Practiced' },
  { value: '94%', label: 'Success Rate' },
  { value: '200+', label: 'Job Roles Covered' },
  { value: '4.9★', label: 'User Rating' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav style={{
        padding: '20px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99,102,241,0.5)'
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>PrepAI</span>
        </div>
        <Link to="/app/dashboard" className="btn btn-primary" style={{ fontFamily: 'var(--font-display)' }}>
          Start Practicing <ChevronRight size={16} />
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          marginBottom: 32, fontSize: '0.82rem', color: 'var(--accent-bright)'
        }}>
          <Zap size={13} /> Powered by Claude AI • Now with Mock Interviews
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          lineHeight: 1.1, marginBottom: 24, maxWidth: 800, margin: '0 auto 24px'
        }}>
          Ace Your Next<br />
          <span className="glow-text">Technical Interview</span><br />
          with AI Coaching
        </h1>

        <p style={{
          fontSize: '1.1rem', color: 'var(--text-secondary)',
          maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7
        }}>
          Practice with an AI interviewer that knows your target company's style. Get instant feedback, personalized questions, and a detailed roadmap to your dream job.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/app/dashboard" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>
            Start Free Practice <ChevronRight size={18} />
          </Link>
          <Link to="/app/mock" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            Try Mock Interview
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24, maxWidth: 700, margin: '80px auto 0',
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-bright)' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 60px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 16 }}>
            Everything You Need to <span className="glow-text">Land the Job</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            A complete AI-powered system designed to turn interview anxiety into interview confidence.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, maxWidth: 1100, margin: '0 auto'
        }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card" style={{ padding: 28 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${color}20`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          padding: '60px 48px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-glow)',
        }}>
          <Award size={40} color="var(--accent-bright)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
            Ready to Get Hired?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of engineers who've landed their dream jobs using PrepAI's AI-powered coaching system.
          </p>
          <Link to="/app/dashboard" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }}>
            <Target size={18} /> Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
