import React, { useState } from 'react';
import { interviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { BookOpen, Search, Filter, RefreshCw, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'ML Engineer'];
const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff'];
const TYPES = ['technical', 'behavioral', 'situational', 'system-design'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

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
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = questions.filter(q => {
    const matchSearch = !searchTerm || q.question.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !filters.type || q.type === filters.type;
    const matchDiff = !filters.difficulty || q.difficulty === filters.difficulty;
    return matchSearch && matchType && matchDiff;
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Question Bank</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Browse and study AI-curated interview questions for your target role.</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Role</label>
            <select className="input" style={{ background: 'var(--bg-secondary)' }} value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Level</label>
            <select className="input" style={{ background: 'var(--bg-secondary)' }} value={filters.level} onChange={e => setFilters(f => ({ ...f, level: e.target.value }))}>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Type</label>
            <select className="input" style={{ background: 'var(--bg-secondary)' }} value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Difficulty</label>
            <select className="input" style={{ background: 'var(--bg-secondary)' }} value={filters.difficulty} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}>
              <option value="">All Levels</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search questions..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 38, background: 'var(--bg-secondary)' }} />
          </div>
          <button onClick={fetchQuestions} disabled={loading} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            {loading ? <><div className="spinner" />&nbsp;Loading…</> : <><RefreshCw size={15} /> Generate Questions</>}
          </button>
        </div>
      </div>

      {/* Results count */}
      {questions.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {questions.length} questions
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {TYPES.map(t => {
              const count = questions.filter(q => q.type === t).length;
              if (!count) return null;
              return (
                <span key={t} className={`tag tag-${t}`} style={{ cursor: 'pointer' }} onClick={() => setFilters(f => ({ ...f, type: f.type === t ? '' : t }))}>
                  {count} {t}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Questions list */}
      {filtered.length === 0 && questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, color: 'var(--text-secondary)' }}>No Questions Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Select filters and click "Generate Questions" to load questions.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((q, i) => (
          <div key={q.id || i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => toggle(q.id || i)}
              style={{
                width: '100%', padding: '18px 22px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left'
              }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)',
                minWidth: 24, marginTop: 2
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className={`tag tag-${q.type}`}>{q.type}</span>
                  <span className={`tag tag-${q.difficulty}`}>{q.difficulty}</span>
                  {q.topic && <span className="tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{q.topic}</span>}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                  {q.question}
                </p>
              </div>
              {expanded[q.id || i] ? <ChevronUp size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} /> : <ChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />}
            </button>

            {expanded[q.id || i] && q.hints && q.hints.length > 0 && (
              <div style={{
                padding: '16px 22px 18px',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: 'var(--amber)', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Lightbulb size={14} /> Key Points to Cover
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {q.hints.map((h, hi) => (
                    <div key={hi} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 16, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 4, color: 'var(--amber)' }}>•</span>
                      {h}
                    </div>
                  ))}
                </div>
                {q.expectedDuration && (
                  <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Expected answer time: ~{Math.floor(q.expectedDuration / 60)} min
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
