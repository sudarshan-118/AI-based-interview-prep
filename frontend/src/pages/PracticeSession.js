import React, { useState } from 'react';
import { interviewAPI, dashboardAPI } from '../utils/api';
import toast from 'react-hot-toast';
import {
  ChevronRight, Lightbulb, CheckCircle,
  Clock, RotateCcw, Send, AlertCircle, Star, Sliders
} from 'lucide-react';

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'ML Engineer',
  'Product Manager', 'DevOps Engineer', 'System Design', 'UX Designer'
];
const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff', 'Principal'];
const TYPES = ['Technical', 'Behavioral', 'Situational', 'Mixed'];

function ScoreCircle({ score }) {
  const color = score >= 75 ? 'var(--emerald)' : score >= 50 ? 'var(--amber)' : 'var(--rose)';
  const r = 42, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return (
    <div style={{ position: 'relative', width: 104, height: 104, flexShrink: 0 }}>
      <svg width="104" height="104" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="52" cy="52" r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="9" />
        <circle cx="52" cy="52" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function RoleButton({ value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 14px', borderRadius: 10, border: '1px solid',
        borderColor: active ? 'var(--accent-mid)' : 'var(--border)',
        background: active
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)'
          : 'var(--bg-elevated)',
        color: active ? 'var(--accent-bright)' : 'var(--text-secondary)',
        cursor: 'pointer', fontSize: '0.82rem', fontWeight: active ? 600 : 500,
        fontFamily: 'var(--font-body)', transition: 'all 0.2s var(--ease)',
        textAlign: 'left', boxShadow: active ? 'var(--shadow-glow)' : 'none',
      }}
    >
      {value}
    </button>
  );
}

export default function PracticeSession() {
  const [phase, setPhase] = useState('setup');
  const [config, setConfig] = useState({ role: '', level: 'Mid-level', type: 'Mixed', count: 5 });
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [allEvals, setAllEvals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const startTimer = () => {
    const start = Date.now();
    const iv = setInterval(() => setTimer(Math.floor((Date.now() - start) / 1000)), 1000);
    setTimerInterval(iv);
  };
  const stopTimer = () => { clearInterval(timerInterval); setTimerInterval(null); };
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const generateQuestions = async () => {
    if (!config.role) return toast.error('Please select a role');
    setLoading(true);
    try {
      const res = await interviewAPI.generateQuestions({
        role: config.role, level: config.level,
        type: config.type.toLowerCase(), count: config.count
      });
      setQuestions(res.data.questions);
      setPhase('practicing');
      setCurrentIdx(0);
      setAllEvals([]);
      startTimer();
      toast.success('Session started!');
    } catch (e) {
      toast.error(e.message || 'Failed to generate questions');
    } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please write an answer');
    setLoading(true);
    stopTimer();
    try {
      const res = await interviewAPI.evaluateAnswer({
        question: questions[currentIdx].question,
        answer, role: config.role, level: config.level,
      });
      setEvaluation(res.data.evaluation);
      setPhase('reviewing');
      toast.success('Feedback ready!');
    } catch (e) {
      toast.error(e.message || 'Failed to get feedback');
    } finally { setLoading(false); }
  };

  const nextQuestion = () => {
    setAllEvals(prev => [...prev, { ...evaluation, questionIdx: currentIdx }]);
    if (currentIdx + 1 >= questions.length) {
      finishSession([...allEvals, { ...evaluation, questionIdx: currentIdx }]);
    } else {
      setCurrentIdx(i => i + 1);
      setAnswer('');
      setEvaluation(null);
      setShowHints(false);
      setPhase('practicing');
      setTimer(0);
      startTimer();
    }
  };

  const finishSession = async (evals) => {
    const avgScore = Math.round(evals.reduce((sum, e) => sum + e.score, 0) / evals.length);
    setPhase('complete');
    try {
      await dashboardAPI.saveSession({
        role: config.role, level: config.level, score: avgScore,
        type: config.type, questionsAnswered: evals.map((e, i) => ({
          question: questions[i]?.question, score: e.score, type: questions[i]?.type
        })), duration: timer
      });
    } catch { /* silent */ }
  };

  const restart = () => {
    setPhase('setup'); setQuestions([]); setCurrentIdx(0);
    setAnswer(''); setEvaluation(null); setAllEvals([]);
    setTimer(0); stopTimer();
  };

  const q = questions[currentIdx];

  // ── SETUP ──
  if (phase === 'setup') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-in">
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Configure Practice Session
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Customize your practice to match your target role and interview type.
          </p>
        </div>

        <div style={{ padding: 32, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {/* Role */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Target Role <span style={{ color: 'var(--rose-light)' }}>*</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 8 }}>
              {ROLES.map(r => (
                <RoleButton key={r} value={r} active={config.role === r} onClick={() => setConfig(c => ({ ...c, role: r }))} />
              ))}
            </div>
            {!config.role && (
              <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--rose-light)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertCircle size={12} /> Please select a role to continue
              </div>
            )}
          </div>

          {/* Level */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Experience Level</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setConfig(c => ({ ...c, level: l }))} style={{
                  padding: '7px 18px', borderRadius: 'var(--radius-full)', border: '1px solid',
                  borderColor: config.level === l ? 'var(--accent-mid)' : 'var(--border)',
                  background: config.level === l ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                  color: config.level === l ? 'var(--accent-bright)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.83rem', fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s var(--ease)', fontWeight: 500,
                }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Type & Count */}
          <div className="responsive-grid-2" style={{ gap: 20, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>Interview Type</div>
              <select className="input" value={config.type} onChange={e => setConfig(c => ({ ...c, type: e.target.value }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>Number of Questions</div>
              <select className="input" value={config.count} onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}>
                {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading || !config.role}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><div className="spinner" /> Assembling Session…</> : <><Sliders size={18} /> Start Practice Session</>}
          </button>
        </div>
      </div>
    );
  }

  // ── PRACTICING ──
  if (phase === 'practicing' && q) {
    const progress = (currentIdx / questions.length) * 100;
    return (
      <div style={{ maxWidth: 820, margin: '0 auto' }} className="animate-in">
        {/* Progress header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.2)',
                fontSize: '0.75rem', color: 'var(--accent-bright)', fontWeight: 700,
              }}>
                Q {currentIdx + 1} / {questions.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{config.role}</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', borderRadius: 8,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-secondary)',
            }}>
              <Clock size={13} />
              {formatTime(timer)}
            </div>
          </div>
          <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-bright) 100%)',
              width: `${progress}%`, transition: 'width 0.6s var(--ease-out)',
            }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{
          padding: '28px', borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          marginBottom: 16,
        }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className={`tag tag-${q.type}`}>{q.type}</span>
            <span className={`tag tag-${q.difficulty}`}>{q.difficulty}</span>
            {q.topic && <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>{q.topic}</span>}
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.55, marginBottom: 20 }}>
            {q.question}
          </h3>

          {/* Hints */}
          {q.hints && q.hints.length > 0 && (
            <div>
              <button
                onClick={() => setShowHints(h => !h)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: showHints ? 'var(--amber-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${showHints ? 'var(--amber-border)' : 'var(--border)'}`,
                  borderRadius: 8, cursor: 'pointer',
                  color: showHints ? 'var(--amber-light)' : 'var(--text-muted)',
                  fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 600,
                  padding: '7px 14px', transition: 'all 0.2s',
                }}
              >
                <Lightbulb size={14} fill={showHints ? 'currentColor' : 'none'} />
                {showHints ? 'Hide hints' : 'Show hints'}
              </button>
              {showHints && (
                <div style={{
                  marginTop: 12, padding: 16, borderRadius: 10,
                  background: 'var(--amber-dim)', border: '1px solid var(--amber-border)',
                  animation: 'fadeInUp 0.25s ease',
                }}>
                  {q.hints.map((h, i) => (
                    <div key={i} style={{
                      fontSize: '0.83rem', color: 'var(--amber-light)',
                      display: 'flex', gap: 8, marginBottom: i < q.hints.length - 1 ? 7 : 0,
                    }}>
                      <span style={{ fontWeight: 700, flexShrink: 0 }}>→</span> {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer card */}
        <div style={{
          padding: '24px', borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          marginBottom: 16,
        }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, color: 'var(--text-muted)' }}>
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here. Be specific and use concrete examples where relevant."
            className="input"
            style={{ minHeight: 180, resize: 'vertical', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {answer.length} characters
              {answer.length < 100 && answer.length > 0 && (
                <span style={{ color: 'var(--amber)', marginLeft: 8 }}>· aim for at least 100 chars</span>
              )}
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={restart} className="btn btn-ghost btn-sm">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={submitAnswer} disabled={loading || !answer.trim()} className="btn btn-primary" style={{ padding: '9px 20px' }}>
                {loading ? <><div className="spinner" /> Analyzing…</> : <><Send size={15} /> Submit Answer</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEWING ──
  if (phase === 'reviewing' && evaluation) {
    const e = evaluation;
    const scoreColor = e.score >= 75 ? 'var(--emerald)' : e.score >= 50 ? 'var(--amber)' : 'var(--rose)';
    const gradeColors = { A: 'var(--emerald)', B: '#22d3ee', C: 'var(--amber)', D: '#f97316', F: 'var(--rose)' };
    const performanceLabel = e.score >= 80 ? 'Excellent!' : e.score >= 60 ? 'Good Answer' : e.score >= 40 ? 'Needs Work' : 'Keep Practicing';

    return (
      <div style={{ maxWidth: 820, margin: '0 auto' }} className="animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Feedback Report
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Q{currentIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Score card */}
        <div style={{ padding: '28px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <ScoreCircle score={e.score} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, lineHeight: 1,
                color: gradeColors[e.grade] || scoreColor,
                textShadow: `0 0 30px ${(gradeColors[e.grade] || scoreColor)}60`,
              }}>{e.grade}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{performanceLabel}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Overall performance</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Communication', val: e.communicationScore },
                { label: 'Technical', val: e.technicalScore },
                { label: 'Relevance', val: e.relevanceScore },
              ].map(({ label, val }) => {
                const c = val >= 75 ? 'var(--emerald)' : val >= 50 ? 'var(--amber)' : 'var(--rose)';
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: '0.72rem', color: c, fontWeight: 700 }}>{val}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 5 }}>
                      <div className="progress-fill" style={{ width: `${val}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {e.feedback && (
          <div style={{ padding: 22, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 14 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>Overall Feedback</div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-primary)' }}>{e.feedback}</p>
          </div>
        )}

        <div className="responsive-grid-2" style={{ gap: 14, marginBottom: 14 }}>
          {/* Strengths */}
          <div style={{ padding: 20, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, color: 'var(--emerald-light)', fontSize: '0.78rem', fontWeight: 700 }}>
              <CheckCircle size={14} fill="currentColor" /> STRENGTHS
            </div>
            {(e.strengths || []).map((s, i) => (
              <div key={i} style={{
                fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 8,
                paddingLeft: 12, borderLeft: '2px solid var(--emerald)', lineHeight: 1.5,
              }}>{s}</div>
            ))}
          </div>
          {/* Improvements */}
          <div style={{ padding: 20, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, color: 'var(--rose-light)', fontSize: '0.78rem', fontWeight: 700 }}>
              <AlertCircle size={14} fill="currentColor" /> TO IMPROVE
            </div>
            {(e.improvements || []).map((s, i) => (
              <div key={i} style={{
                fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 8,
                paddingLeft: 12, borderLeft: '2px solid var(--rose)', lineHeight: 1.5,
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Sample answer */}
        {e.sampleAnswer && (
          <div style={{ padding: 20, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-mid)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, color: 'var(--accent-bright)', fontSize: '0.78rem', fontWeight: 700 }}>
              <Star size={14} fill="currentColor" /> SAMPLE STRONG ANSWER
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{e.sampleAnswer}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={restart} className="btn btn-secondary">
            <RotateCcw size={15} /> Start Over
          </button>
          <button onClick={nextQuestion} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {currentIdx + 1 >= questions.length
              ? <><CheckCircle size={16} /> Finish Session</>
              : <><ChevronRight size={16} /> Next Question</>
            }
          </button>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──
  if (phase === 'complete') {
    const avgScore = allEvals.length > 0
      ? Math.round(allEvals.reduce((sum, e) => sum + e.score, 0) / allEvals.length)
      : 0;
    const scoreColor = avgScore >= 75 ? 'var(--emerald)' : avgScore >= 50 ? 'var(--amber)' : 'var(--rose)';
    const emoji = avgScore >= 80 ? '🏆' : avgScore >= 60 ? '🎯' : '💪';

    return (
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }} className="animate-in">
        <div style={{
          width: 90, height: 90, borderRadius: '50%', margin: '0 auto 24px',
          background: `linear-gradient(135deg, ${scoreColor}20 0%, ${scoreColor}05 100%)`,
          border: `2px solid ${scoreColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.6rem',
        }}>{emoji}</div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Session Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: '0.92rem' }}>
          You answered <strong style={{ color: 'var(--text-primary)' }}>{allEvals.length} questions</strong> in {formatTime(timer)}
        </p>

        <div style={{ padding: '32px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 900, color: scoreColor, lineHeight: 1, marginBottom: 6 }}>
            {avgScore}<span style={{ fontSize: '2rem', opacity: 0.7 }}>%</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 28 }}>Average Score Across All Questions</div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(allEvals.length, 5)}, 1fr)`, gap: 10 }}>
            {allEvals.map((e, i) => {
              const c = e.score >= 75 ? 'var(--emerald)' : e.score >= 50 ? 'var(--amber)' : 'var(--rose)';
              return (
                <div key={i} style={{
                  padding: '14px 8px', borderRadius: 10, textAlign: 'center',
                  background: 'var(--bg-elevated)', border: `1px solid ${c}30`,
                }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Q{i + 1}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: c,
                  }}>{e.score}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={restart} className="btn btn-primary btn-lg">
            <RotateCcw size={16} /> Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );
}
