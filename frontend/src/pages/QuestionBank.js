import React, { useState } from 'react';
import { interviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { BookOpen, Search, RefreshCw, ChevronDown, ChevronUp, Lightbulb, Clock, Layers } from 'lucide-react';

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'ML Engineer'];
const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff'];
const TYPES = ['technical', 'behavioral', 'situational', 'system-design'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const TYPE_COLORS = {
  technical: { bg: 'var(--accent-glow)', color: 'var(--accent-bright)', border: 'rgba(99,102,241,0.2)' },
  behavioral: { bg: 'var(--emerald-dim)', color: 'var(--emerald-light)', border: 'var(--emerald-border)' },
  situational: { bg: 'var(--amber-dim)', color: 'var(--amber-light)', border: 'var(--amber-border)' },
  'system-design': { bg: 'var(--cyan-dim)', color: 'var(--cyan)', border: 'rgba(6,182,212,0.2)' },
};
const DIFF_COLORS = {
  easy: { color: 'var(--emerald-light)', bg: 'var(--emerald-dim)', border: 'var(--emerald-border)' },
  medium: { color: 'var(--amber-light)', bg: 'var(--amber-dim)', border: 'var(--amber-border)' },
  hard: { color: 'var(--rose-light)', bg: 'var(--rose-dim)', border: 'var(--rose-border)' },
};

function FilterPill({ value, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 'var(--radius-full)',
        border: `1px solid ${active ? (color || 'var(--accent-mid)') : 'var(--border)'}`,
        background: active ? (color ? `${color}18` : 'var(--accent-glow)') : 'var(--bg-elevated)',
        color: active ? (color || 'var(--accent-bright)') : 'var(--text-muted)',
        fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
        transition: 'all 0.2s var(--ease)',
        fontFamily: 'var(--font-body)',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </button>
  );
}

export default function QuestionBank() {
  const [filters, setFilters] = useState({ role: 'Software Engineer', level: 'Mid-level', type: '', difficulty: '' });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.generateQuestions({
        role: filters.role, level: filters.level,
        type: filters.type || 'mixed', count: 10
      });
      setQuestions(res.data.questions);
      setExpanded({});
      toast.success(`${res.data.questions.length} questions loaded`);
    } catch (e) {
      toast.error(e.message || 'Failed to load questions');
    } finally { setLoading(false); }
  };

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = questions.filter(q => {
    const matchSearch = !searchTerm || q.question.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !filters.type || q.type === filters.type;
    const matchDiff = !filters.difficulty || q.difficulty === filters.difficulty;
    return matchSearch && matchType && matchDiff;
  });

  const typeCount = (t) => questions.filter(q => q.type === t).length;

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }} className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Question Bank
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Browse and study curated practice questions for your target role.
            </p>
          </div>
          {questions.length > 0 && (
            <div style={{
              padding: '8px 16px', borderRadius: 'var(--radius-full)',
              background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '0.8rem', color: 'var(--accent-bright)', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Layers size={14} /> {questions.length} Questions
            </div>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <div style={{
        padding: '24px', marginBottom: 24,
        borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)',
      }}>
        {/* Role & Level dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Role</label>
            <select className="input" value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Level</label>
            <select className="input" value={filters.level} onChange={e => setFilters(f => ({ ...f, level: e.target.value }))}>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Type pills */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Question Type
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <FilterPill value="All Types" active={!filters.type} onClick={() => setFilters(f => ({ ...f, type: '' }))} />
            {TYPES.map(t => (
              <FilterPill
                key={t} value={t.charAt(0).toUpperCase() + t.slice(1)}
                active={filters.type === t}
                onClick={() => setFilters(f => ({ ...f, type: f.type === t ? '' : t }))}
                color={TYPE_COLORS[t]?.color}
              />
            ))}
          </div>
        </div>

        {/* Difficulty pills */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Difficulty
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <FilterPill value="All Levels" active={!filters.difficulty} onClick={() => setFilters(f => ({ ...f, difficulty: '' }))} />
            {DIFFICULTIES.map(d => (
              <FilterPill
                key={d} value={d.charAt(0).toUpperCase() + d.slice(1)}
                active={filters.difficulty === d}
                onClick={() => setFilters(f => ({ ...f, difficulty: f.difficulty === d ? '' : d }))}
                color={DIFF_COLORS[d]?.color}
              />
            ))}
          </div>
        </div>

        {/* Search + Load */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              className="input"
              placeholder="Search questions or topics..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>
          <button onClick={fetchQuestions} disabled={loading} className="btn btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
            {loading ? <><div className="spinner" /> Loading…</> : <><RefreshCw size={15} /> Load Questions</>}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {questions.length > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16, flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> of {questions.length} questions
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPES.map(t => {
              const count = typeCount(t);
              if (!count) return null;
              const c = TYPE_COLORS[t];
              return (
                <button
                  key={t}
                  onClick={() => setFilters(f => ({ ...f, type: f.type === t ? '' : t }))}
                  style={{
                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                    background: filters.type === t ? c.bg : 'transparent',
                    border: `1px solid ${filters.type === t ? c.border : 'var(--border)'}`,
                    color: filters.type === t ? c.color : 'var(--text-muted)',
                    fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {count} {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {questions.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <BookOpen size={30} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 700 }}>No questions loaded</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
            Select your filters and click "Load Questions" to get started.
          </p>
          <button onClick={fetchQuestions} disabled={loading} className="btn btn-primary">
            <RefreshCw size={15} /> Load Questions
          </button>
        </div>
      )}

      {/* Questions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((q, i) => {
          const isOpen = expanded[q.id || i];
          const tc = TYPE_COLORS[q.type] || TYPE_COLORS.technical;
          const dc = DIFF_COLORS[q.difficulty] || DIFF_COLORS.medium;
          return (
            <div
              key={q.id || i}
              style={{
                borderRadius: 12,
                background: 'var(--bg-card)',
                border: `1px solid ${isOpen ? 'var(--border-mid)' : 'var(--border)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => toggle(q.id || i)}
                style={{
                  width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)',
                  minWidth: 26, marginTop: 3, fontWeight: 600,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 9, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 'var(--radius-full)',
                      background: tc.bg, border: `1px solid ${tc.border}`,
                      color: tc.color, fontSize: '0.7rem', fontWeight: 700,
                    }}>{q.type}</span>
                    <span style={{
                      padding: '2px 10px', borderRadius: 'var(--radius-full)',
                      background: dc.bg, border: `1px solid ${dc.border}`,
                      color: dc.color, fontSize: '0.7rem', fontWeight: 700,
                    }}>{q.difficulty}</span>
                    {q.topic && (
                      <span style={{
                        padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        color: 'var(--text-muted)', fontSize: '0.7rem',
                      }}>{q.topic}</span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    {q.question}
                  </p>
                </div>
                <div style={{
                  flexShrink: 0, marginTop: 3,
                  width: 28, height: 28, borderRadius: 8,
                  background: isOpen ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                  border: `1px solid ${isOpen ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  color: isOpen ? 'var(--accent-bright)' : 'var(--text-muted)',
                }}>
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>

              {isOpen && q.hints && q.hints.length > 0 && (
                <div style={{
                  padding: '16px 20px 20px',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-elevated)',
                  animation: 'fadeIn 0.25s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, color: 'var(--amber-light)', fontSize: '0.78rem', fontWeight: 700 }}>
                    <Lightbulb size={14} fill="currentColor" /> KEY POINTS TO COVER
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.hints.map((h, hi) => (
                      <div key={hi} style={{
                        fontSize: '0.84rem', color: 'var(--text-secondary)',
                        paddingLeft: 16, position: 'relative', lineHeight: 1.55,
                      }}>
                        <span style={{ position: 'absolute', left: 3, color: 'var(--amber-light)', fontWeight: 700 }}>→</span>
                        {h}
                      </div>
                    ))}
                  </div>
                  {q.expectedDuration && (
                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} /> Expected answer time: ~{Math.floor(q.expectedDuration / 60)} min
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
