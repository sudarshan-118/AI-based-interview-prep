import React, { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Send, PhoneOff, RotateCcw, Copy, Check, Phone, Clock } from 'lucide-react';

const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'System Design', 'Leadership'];
const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'];

const TYPE_ICONS = { Technical: '⚙️', Behavioral: '💬', 'System Design': '🏗️', Leadership: '🌟' };

function OptionButton({ value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px', borderRadius: 10, border: '1px solid',
        borderColor: active ? 'var(--accent-mid)' : 'var(--border)',
        background: active
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)'
          : 'var(--bg-elevated)',
        color: active ? 'var(--accent-bright)' : 'var(--text-secondary)',
        cursor: 'pointer', fontSize: '0.84rem', fontFamily: 'var(--font-body)',
        transition: 'all 0.2s var(--ease)', fontWeight: 500,
        textAlign: 'center',
        boxShadow: active ? 'var(--shadow-glow)' : 'none',
      }}
    >
      {value}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '14px 18px' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7rem', fontWeight: 800, color: 'white',
      }}>AI</div>
      <div style={{
        padding: '10px 16px', borderRadius: '0 14px 14px 14px',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        display: 'flex', gap: 5, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-bright)',
            display: 'inline-block',
            animation: `typing 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function MockInterview() {
  const [phase, setPhase] = useState('setup');
  const [config, setConfig] = useState({ role: 'Software Engineer', level: 'Mid-level', type: 'Technical' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (phase !== 'interviewing') return;
    const iv = setInterval(() => setDuration(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.startMockInterview({
        role: config.role, level: config.level,
        interviewType: config.type, previousMessages: []
      });
      setMessages([{ role: 'assistant', content: res.data.response }]);
      setPhase('interviewing');
      setDuration(0);
      toast.success('Interview started!');
    } catch (e) {
      toast.error(e.message || 'Failed to start interview');
    } finally { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    try {
      const res = await interviewAPI.startMockInterview({
        role: config.role, level: config.level,
        interviewType: config.type,
        previousMessages: [...messages, { role: 'user', content: userMsg }]
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (res.data.response.toLowerCase().includes('thank you') || res.data.response.toLowerCase().includes('good luck')) {
        setTimeout(() => setPhase('complete'), 2000);
      }
    } catch {
      toast.error('Failed to get response');
      setMessages(prev => prev.slice(0, -1));
    } finally { setLoading(false); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const restart = () => { setPhase('setup'); setMessages([]); setInput(''); setDuration(0); };

  // ── SETUP ──
  if (phase === 'setup') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-in">
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Live Mock Interview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Practice real-time with an AI interviewer that adapts to your responses.
          </p>
        </div>

        <div style={{
          padding: 32, borderRadius: 16,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          {/* Role */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, color: 'var(--text-muted)' }}>Target Role</label>
            <select className="input" value={config.role} onChange={e => setConfig(c => ({ ...c, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, color: 'var(--text-muted)' }}>Experience Level</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Junior', 'Mid-level', 'Senior', 'Staff'].map(l => (
                <OptionButton key={l} value={l} active={config.level === l} onClick={() => setConfig(c => ({ ...c, level: l }))} />
              ))}
            </div>
          </div>

          {/* Type */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, color: 'var(--text-muted)' }}>Interview Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {INTERVIEW_TYPES.map(t => (
                <OptionButton key={t} value={`${TYPE_ICONS[t]} ${t}`} active={config.type === t} onClick={() => setConfig(c => ({ ...c, type: t }))} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={startInterview} disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><div className="spinner" /> Starting…</> : <><Phone size={18} /> Start Interview Session</>}
          </button>

          {/* Tips */}
          <div style={{
            marginTop: 20, padding: '16px 18px', borderRadius: 10,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>💡 Quick Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                'Think out loud — show your reasoning process',
                'Ask clarifying questions when needed',
                'Use concrete examples from your experience',
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 7 }}>
                  <span style={{ color: 'var(--accent-bright)', fontWeight: 700 }}>→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── INTERVIEWING ──
  if (phase === 'interviewing') {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }} className="animate-in">
        {/* Chat header */}
        <div style={{
          padding: '14px 20px',
          borderRadius: '14px 14px 0 0',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-mid)',
          borderBottom: 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, color: 'white',
              }}>AI</div>
              <div className="glow-dot" style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 10, height: 10, border: '2px solid var(--bg-card)',
              }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Interviewer</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{config.role} · {config.type}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)',
              padding: '5px 12px', borderRadius: 8,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            }}>
              <Clock size={13} />
              {formatTime(duration)}
            </div>
            <button onClick={restart} className="btn btn-danger btn-sm" style={{ gap: 6 }}>
              <PhoneOff size={13} /> End
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1, overflow: 'auto', padding: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-mid)',
          borderTop: 'none', borderBottom: 'none',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 8, gap: 10,
              animation: 'fadeInUp 0.3s ease',
            }}>
              {msg.role !== 'user' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0, alignSelf: 'flex-end',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, color: 'white',
                }}>AI</div>
              )}
              <div style={{
                maxWidth: '72%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)'
                  : 'var(--bg-elevated)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                wordBreak: 'break-word',
                boxShadow: msg.role === 'user' ? '0 4px 14px rgba(79,70,229,0.35)' : 'none',
              }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0, alignSelf: 'flex-end',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)',
                }}>YOU</div>
              )}
            </div>
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '0 0 14px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-mid)',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 10, alignItems: 'flex-end',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your response… (Shift+Enter for new line)"
            style={{
              flex: 1,
              background: 'var(--bg-input)', border: '1px solid var(--border-mid)',
              borderRadius: 10, padding: '11px 14px', color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              outline: 'none', resize: 'none', lineHeight: 1.55,
              transition: 'border-color 0.2s',
              minHeight: 44, maxHeight: 120, overflowY: 'auto',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-mid)'}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn btn-primary btn-icon"
            style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──
  if (phase === 'complete') {
    const transcript = messages.map(m => `${m.role === 'user' ? 'You' : 'Interviewer'}: ${m.content}`).join('\n\n');
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }} className="animate-in">
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
          background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(16,185,129,0.15) 100%)',
          border: '2px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.4rem',
        }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Interview Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '0.92rem' }}>
          Great work! You completed a <strong style={{ color: 'var(--text-primary)' }}>{formatTime(duration)}</strong> mock interview session.
        </p>

        <div style={{ padding: 28, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 24, textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Session Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Duration', value: formatTime(duration), color: 'var(--accent-bright)' },
              { label: 'Exchanges', value: Math.floor(messages.length / 2), color: 'var(--emerald)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                padding: '16px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Key Feedback</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '✓', text: 'Good communication and clear explanation of your thought process', color: 'var(--emerald-light)' },
                { icon: '✓', text: 'Professional tone maintained throughout the session', color: 'var(--emerald-light)' },
                { icon: '→', text: 'Try to ask more clarifying questions at the start of problems', color: 'var(--amber-light)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <span style={{ color: item.color, fontWeight: 700, flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Transcript preview */}
          <div style={{
            padding: '12px 14px', borderRadius: 8, background: 'var(--bg-primary)',
            border: '1px solid var(--border)', fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)', lineHeight: 1.65,
            maxHeight: 160, overflow: 'auto', whiteSpace: 'pre-wrap',
            color: 'var(--text-muted)', marginBottom: 14,
          }}>
            {transcript.substring(0, 600)}…
          </div>

          <button
            onClick={() => { navigator.clipboard.writeText(transcript); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {copied ? <><Check size={15} /> Copied to clipboard!</> : <><Copy size={15} /> Copy Full Transcript</>}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={restart} className="btn btn-primary btn-lg">
            <RotateCcw size={16} /> Try Another Interview
          </button>
        </div>
      </div>
    );
  }

  return <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }} /></div>;
}
