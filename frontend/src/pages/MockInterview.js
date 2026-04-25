import React, { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MessageSquare, Send, Phone, PhoneOff, Settings, RotateCcw, Loader, Copy, Check } from 'lucide-react';

const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'System Design', 'Leadership'];
const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'];

export default function MockInterview() {
  const [phase, setPhase] = useState('setup'); // setup | interviewing | complete
  const [config, setConfig] = useState({ role: 'Software Engineer', level: 'Mid-level', type: 'Technical' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const messagesEndRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (phase !== 'interviewing') return;
    const iv = setInterval(() => setDuration(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const startInterview = async () => {
    setLoading(true);
    setStartTime(Date.now());
    try {
      const res = await interviewAPI.startMockInterview({
        role: config.role,
        level: config.level,
        interviewType: config.type,
        previousMessages: []
      });
      setMessages([{ role: 'assistant', content: res.data.response }]);
      setPhase('interviewing');
      setDuration(0);
      toast.success('Interview started!');
    } catch (e) {
      toast.error(e.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await interviewAPI.startMockInterview({
        role: config.role,
        level: config.level,
        interviewType: config.type,
        previousMessages: [...messages, { role: 'user', content: userMsg }]
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (res.data.response.toLowerCase().includes('thank you') || res.data.response.toLowerCase().includes('good luck')) {
        setTimeout(() => setPhase('complete'), 2000);
      }
    } catch (e) {
      toast.error('Failed to get response');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const restart = () => {
    setPhase('setup');
    setMessages([]);
    setInput('');
    setDuration(0);
    setStartTime(null);
  };

  // SETUP
  if (phase === 'setup') {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            Live Mock Interview
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Practice real-time with an AI interviewer who adapts to your responses.
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
              Target Role *
            </label>
            <select className="input" value={config.role} onChange={e => setConfig(c => ({ ...c, role: e.target.value }))}
              style={{ background: 'var(--bg-secondary)' }}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
              Experience Level
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Junior', 'Mid-level', 'Senior', 'Staff'].map(l => (
                <button key={l} onClick={() => setConfig(c => ({ ...c, level: l }))}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid',
                    borderColor: config.level === l ? 'var(--accent)' : 'var(--border)',
                    background: config.level === l ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                    color: config.level === l ? 'var(--accent-bright)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s ease', fontWeight: 500,
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
              Interview Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {INTERVIEW_TYPES.map(t => (
                <button key={t} onClick={() => setConfig(c => ({ ...c, type: t }))}
                  style={{
                    padding: '10px 14px', borderRadius: 10, border: '1px solid',
                    borderColor: config.type === t ? 'var(--accent)' : 'var(--border)',
                    background: config.type === t ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                    color: config.type === t ? 'var(--accent-bright)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s ease', fontWeight: 500,
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startInterview} disabled={loading} className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}>
            {loading ? <><Loader size={16} />&nbsp;Starting…</> : <><Phone size={16} /> Start Interview</>}
          </button>

          <div style={{
            marginTop: 24, padding: 16, borderRadius: 12,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>💡 Tips:</strong><br/>
            • Think out loud - interviewers want to see your thought process<br/>
            • Ask clarifying questions when needed<br/>
            • Use specific examples from your experience<br/>
            • Stay calm and professional throughout
          </div>
        </div>
      </div>
    );
  }

  // INTERVIEWING
  if (phase === 'interviewing') {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: -1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', background: 'var(--rose)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Live Interview Session</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{config.role} • {config.type}</div>
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            {formatTime(duration)}
          </div>
        </div>

        {/* Messages */}
        <div className="card" style={{
          flex: 1, padding: '20px', marginBottom: 0, borderRadius: '0',
          overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12,
          borderTop: 'none'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Loading...</div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'var(--bg-secondary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-muted)' }}>
              <div className="spinner" />
              <span style={{ fontSize: '0.85rem' }}>Interviewer is thinking…</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: '0 0 12px 12px',
          border: '1px solid var(--border)', borderTop: 'none',
          display: 'flex', gap: 12, alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your response... (Shift+Enter for new line)"
            style={{
              flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 12px', color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              outline: 'none', resize: 'none', maxHeight: 100,
              lineHeight: 1.5
            }}
            rows={1}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn btn-primary"
            style={{ padding: '10px 16px', marginBottom: 0 }}>
            <Send size={16} />
          </button>
          <button onClick={restart} className="btn btn-secondary" style={{ padding: '10px 12px' }}>
            <PhoneOff size={16} />
          </button>
        </div>
      </div>
    );
  }

  // COMPLETE
  if (phase === 'complete') {
    const transcript = messages.map(m => `${m.role === 'user' ? 'You' : 'Interviewer'}: ${m.content}`).join('\n\n');

    return (
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
          Interview Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          Great job! You completed a {formatTime(duration)} mock interview session.
        </p>

        <div className="card" style={{ padding: 32, marginBottom: 24, textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Session Summary</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ padding: '12px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Duration</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>{formatTime(duration)}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Exchanges</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>{Math.floor(messages.length / 2)}</div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--accent-bright)' }}>Key Feedback</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>✓</span>
                <span>Good communication and clear explanation of your thought process</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>✓</span>
                <span>Professional tone maintained throughout the session</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--amber)', fontWeight: 600 }}>→</span>
                <span>Try to ask more clarifying questions at the start of problems</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: 12, borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--border)',
            fontSize: '0.78rem', fontFamily: 'var(--font-mono)', lineHeight: 1.6,
            maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            marginBottom: 16
          }}>
            {transcript.substring(0, 500)}...
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(transcript);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}>
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Transcript</>}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={restart} className="btn btn-primary" style={{ padding: '12px 32px' }}>
            <RotateCcw size={16} /> Try Another
          </button>
        </div>
      </div>
    );
  }

  return <div />;
}
