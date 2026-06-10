import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Brain, Sparkles, CheckCircle2, MessageSquare,
  ClipboardCheck, Sliders, ArrowRight, Zap, Target, TrendingUp,
  Star, Shield, Clock, Users, Sun, Moon
} from 'lucide-react';

/* ─── Typing animation ─── */
function TypingText({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let delay = deleting ? 60 : 100;
    if (!deleting && charIdx === word.length) delay = 1800;
    if (deleting && charIdx === 0) {
      delay = 300;
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) setCharIdx(i => i + 1);
      else if (!deleting && charIdx === word.length) setDeleting(true);
      else if (deleting) setCharIdx(i => i - 1);
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words]);

  return (
    <span className="gradient-text" style={{ display: 'inline-block', minWidth: 2 }}>
      {words[wordIdx].slice(0, charIdx)}
      <span style={{
        display: 'inline-block', width: 3, height: '0.9em',
        background: 'var(--accent-bright)', marginLeft: 2, verticalAlign: 'middle',
        borderRadius: 2, animation: 'pulse-dot 1s ease-in-out infinite',
      }} />
    </span>
  );
}

/* ─── Stat counter ─── */
function StatCounter({ value, suffix, label, icon: Icon, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = parseInt(value);
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 24);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}18`, border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px',
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800,
        color: 'var(--text-primary)', lineHeight: 1,
      }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ─── Interactive Demo ─── */
function ProductDemo() {
  const [step, setStep] = useState(0);

  const steps = [
    { id: 0, icon: Sliders, label: 'Setup', shortLabel: '1. Setup' },
    { id: 1, icon: MessageSquare, label: 'Answer', shortLabel: '2. Answer' },
    { id: 2, icon: ClipboardCheck, label: 'Feedback', shortLabel: '3. Feedback' },
  ];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-mid)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15)',
      textAlign: 'left',
    }}>
      {/* macOS-style window bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'block' }} />
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          prepdeck://mock-session
        </span>
        <div style={{ width: 50 }} />
      </div>

      {/* Step tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
      }}>
        {steps.map(s => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            style={{
              flex: 1, padding: '12px 10px',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${step === s.id ? 'var(--accent-mid)' : 'transparent'}`,
              color: step === s.id ? 'var(--accent-bright)' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.2s',
              fontFamily: 'var(--font-body)',
            }}
          >
            <s.icon size={14} />
            {s.shortLabel}
          </button>
        ))}
      </div>

      {/* Demo body */}
      <div style={{ padding: '32px', minHeight: 340 }}>
        {step === 0 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>STEP 1 OF 3</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
              Configure your session
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.6 }}>
              Pick your target role and experience level. Our AI will generate tailored questions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, marginBottom: 28 }}>
              {[
                { label: 'Target Role', value: 'Software Engineer (Frontend)' },
                { label: 'Experience Level', value: 'Mid-level (3–5 years)' },
                { label: 'Interview Type', value: 'Technical' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{label}</div>
                  <div style={{
                    padding: '9px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 8, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500,
                  }}>{value}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Generate Questions <ChevronRight size={15} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              <span className="tag tag-technical">Technical</span>
              <span className="tag tag-medium">Medium</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Q1 / 5</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 18, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              "How do you handle performance optimization in a large React application?"
            </h4>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Answer</div>
              <div style={{
                padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
                borderRadius: 8, fontSize: '0.86rem', minHeight: 100, lineHeight: 1.65,
                color: 'var(--text-secondary)',
              }}>
                I would use React.memo to prevent unnecessary re-renders. Also useMemo and useCallback to memoize values and functions. For large lists, react-window handles virtualization well...
              </div>
            </div>
            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Submit for AI Evaluation <ChevronRight size={15} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>AI Evaluation Report</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>React Performance Answer</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--emerald)', lineHeight: 1 }}>85</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 3 }}>out of 100</div>
              </div>
            </div>
            <div className="responsive-grid-2" style={{ gap: 14, marginBottom: 20 }}>
              {[['Communication', 82, 'var(--accent-bright)'], ['Technical Depth', 88, 'var(--emerald)'], ['Relevance', 90, 'var(--emerald)'], ['Clarity', 78, 'var(--amber)']].map(([label, score, color]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontSize: '0.72rem', color, fontWeight: 700 }}>{score}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 5 }}>
                    <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="responsive-grid-2" style={{ gap: 10 }}>
              <div style={{ padding: '12px', borderRadius: 8, background: 'var(--emerald-dim)', border: '1px solid var(--emerald-border)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--emerald-light)', marginBottom: 6 }}>✓ STRENGTHS</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Correctly identified React.memo and useMemo hooks with clear reasoning.</div>
              </div>
              <div style={{ padding: '12px', borderRadius: 8, background: 'var(--amber-dim)', border: '1px solid var(--amber-border)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber-light)', marginBottom: 6 }}>→ IMPROVE</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Mention React DevTools Profiler for benchmarking before optimizing.</div>
              </div>
            </div>
            <button onClick={() => setStep(0)} className="btn btn-secondary" style={{ marginTop: 16, fontSize: '0.82rem', padding: '8px 16px' }}>
              ← Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({ icon: Icon, title, desc, color, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px',
        borderRadius: 16,
        background: hovered
          ? `linear-gradient(135deg, ${color}12 0%, var(--bg-card) 100%)`
          : 'var(--bg-card)',
        border: `1px solid ${hovered ? color + '35' : 'var(--border)'}`,
        transition: 'all 0.3s var(--ease)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 12px 40px ${color}20` : 'none',
        cursor: 'default',
        animationDelay: `${delay}ms`,
      }}
      className="animate-in"
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        transition: 'all 0.3s var(--ease)',
        boxShadow: hovered ? `0 4px 16px ${color}30` : 'none',
      }}>
        <Icon size={22} color={color} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

export default function Landing() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflowX: 'hidden' }}>
      {/* Ambient background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '70vw', height: '70vw', maxWidth: 900,
          background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 65%)',
          animation: 'float 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: '50vw', height: '50vw', maxWidth: 700,
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)',
          animation: 'float 15s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '40%',
          width: '30vw', height: '30vw', maxWidth: 400,
          background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)',
        }} />
      </div>

      {/* Sticky nav */}
      <nav className="landing-navbar" style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navScrolled ? 'rgba(8, 9, 15, 0.88)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: navScrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.35s var(--ease)',
        maxWidth: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.5)',
          }}>
            <Sparkles size={17} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem',
            letterSpacing: '-0.02em',
          }}>PrepDeck</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-icon" 
            style={{ color: 'var(--text-muted)', marginRight: 4, width: 34, height: 34 }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="/login" className="hide-sm" style={{
            color: 'var(--text-secondary)', textDecoration: 'none',
            fontWeight: 500, fontSize: '0.88rem',
            padding: '8px 14px', borderRadius: 8,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >Sign In</Link>
          <Link to="/login" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 8vw, 100px)',
        textAlign: 'center',
        maxWidth: 880,
        margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 'var(--radius-full)',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          marginBottom: 32, fontSize: '0.78rem', color: 'var(--accent-bright)', fontWeight: 600,
          animation: 'fadeInUp 0.6s var(--ease-out)',
        }}>
          <Sparkles size={13} fill="currentColor" />
          Powered by advanced AI • Used by 10k+ engineers
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
          fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
          marginBottom: 24,
          color: 'var(--text-primary)',
          animation: 'fadeInUp 0.6s var(--ease-out) 0.1s both',
          fontFamily: 'var(--font-display)',
        }}>
          Ace your next{' '}
          <TypingText words={['interview', 'tech role', 'system design', 'FAANG round']} />
          <br />
          <span style={{ opacity: 0.85 }}>with AI practice</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 44px',
          lineHeight: 1.7, animation: 'fadeInUp 0.6s var(--ease-out) 0.2s both',
        }}>
          Real interview questions, instant AI feedback, and live mock sessions — all
          personalized to your target role and experience level.
        </p>

        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeInUp 0.6s var(--ease-out) 0.3s both',
        }}>
          <Link to="/login" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
            Start Practicing Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Try Mock Interview
          </Link>
        </div>

        {/* Social proof */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 20, marginTop: 48,
          animation: 'fadeInUp 0.6s var(--ease-out) 0.4s both',
        }}>
          <div style={{ display: 'flex' }}>
            {['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'].map((c, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: '50%', background: c,
                border: '2px solid var(--bg-base)', marginLeft: i === 0 ? 0 : -8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: 'white',
              }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Trusted by <strong style={{ color: 'var(--text-secondary)' }}>10,000+</strong> engineers
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '0 24px 100px', maxWidth: 900, margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 24,
          padding: '40px',
          borderRadius: 20, background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.08)',
        }}>
          <StatCounter value={10000} suffix="+" label="Active users" icon={Users} color="var(--accent-mid)" />
          <StatCounter value={500} suffix="k+" label="Questions practiced" icon={Target} color="var(--emerald)" />
          <StatCounter value={94} suffix="%" label="Interview success rate" icon={TrendingUp} color="var(--amber)" />
          <StatCounter value={24} suffix="/7" label="AI availability" icon={Clock} color="var(--cyan)" />
        </div>
      </section>

      {/* Features grid */}
      <section style={{
        padding: '0 24px 100px',
        maxWidth: 1100, margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--accent-bright)', textTransform: 'uppercase', marginBottom: 14,
          }}>
            <Zap size={14} fill="currentColor" /> Everything you need
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 14, fontFamily: 'var(--font-display)',
          }}>
            The complete interview prep toolkit
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Everything you need to go from uncertain to confident — in one place.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <FeatureCard icon={Brain} title="AI Practice Sessions" desc="Adaptive questions based on your role and experience. Get instant, detailed feedback." color="var(--accent-mid)" delay={0} />
          <FeatureCard icon={MessageSquare} title="Live Mock Interviews" desc="Real-time conversation with an AI interviewer that adapts to your answers." color="var(--emerald)" delay={80} />
          <FeatureCard icon={ClipboardCheck} title="Deep Feedback Engine" desc="Scored on communication, technical depth, and relevance. Know exactly what to fix." color="var(--amber)" delay={160} />
          <FeatureCard icon={Shield} title="Resume Optimizer" desc="ATS-optimized analysis with keyword suggestions and industry-specific improvements." color="var(--rose)" delay={240} />
        </div>
      </section>

      {/* Interactive Demo */}
      <section style={{
        padding: '0 24px 100px',
        maxWidth: 900, margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 12, fontFamily: 'var(--font-display)',
          }}>
            See it in action
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 440, margin: '0 auto' }}>
            Click through the steps below to experience a real practice session.
          </p>
        </div>
        <ProductDemo />
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 120px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 60px)',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(139,92,246,0.06) 50%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 0 80px rgba(79,70,229,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
            width: '80%', height: '100%',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 'var(--radius-full)',
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            fontSize: '0.75rem', color: 'var(--emerald-light)', fontWeight: 600,
            marginBottom: 24,
          }}>
            <CheckCircle2 size={13} /> Free forever • No credit card required
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 14, fontFamily: 'var(--font-display)',
          }}>
            Ready to land your dream job?
          </h2>
          <p style={{
            color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem',
            lineHeight: 1.7, maxWidth: 420, margin: '0 auto 32px',
          }}>
            Join thousands of engineers who used PrepDeck to prepare and land roles at top companies.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>PrepDeck</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          © 2025 PrepDeck. Built to help you succeed.
        </div>
      </footer>
    </div>
  );
}
