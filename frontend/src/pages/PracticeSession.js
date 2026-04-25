import React, { useState, useCallback } from 'react';
import { interviewAPI, dashboardAPI } from '../utils/api';
import toast from 'react-hot-toast';
import {
  Brain, ChevronRight, ChevronLeft, Lightbulb, CheckCircle,
  Clock, RotateCcw, Send, AlertCircle, Star, Loader, Settings
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
  const r = 40, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ 100</span>
      </div>
    </div>
  );
}

export default function PracticeSession() {
  const [phase, setPhase] = useState('setup'); // setup | practicing | reviewing | complete
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

  const stopTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };

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
      toast.success('Questions generated!');
    } catch (e) {
      toast.error(e.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please write an answer');
    setLoading(true);
    stopTimer();
    try {
      const res = await interviewAPI.evaluateAnswer({
        question: questions[currentIdx].question,
        answer,
        role: config.role,
        level: config.level,
      });
      setEvaluation(res.data.evaluation);
      setPhase('reviewing');
      toast.success('Answer evaluated!');
    } catch (e) {
      toast.error(e.message || 'Failed to evaluate');
    } finally {
      setLoading(false);
    }
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
        role: config.role, level: config.level,
        score: avgScore, type: config.type,
        questionsAnswered: evals.map((e, i) => ({
          question: questions[i]?.question,
          score: e.score,
          type: questions[i]?.type
        })),
        duration: timer
      });
    } catch (e) { /* silent */ }
  };

  const restart = () => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIdx(0);
    setAnswer('');
    setEvaluation(null);
    setAllEvals([]);
    setTimer(0);
    stopTimer();
  };

  const q = questions[currentIdx];

  // SETUP PHASE
  if (phase === 'setup') {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            Configure Practice Session
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Customize your practice to match your target role and interview type.</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Role */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
              Target Role *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {ROLES.map(r => (
                <button key={r} onClick={() => setConfig(c => ({ ...c, role: r }))}
                  style={{
                    padding: '10px 14px', borderRadius: 10, border: '1px solid',
                    borderColor: config.role === r ? 'var(--accent)' : 'var(--border)',
                    background: config.role === r ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                    color: config.role === r ? 'var(--accent-bright)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                    fontFamily: 'var(--font-body)', transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
              Experience Level
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setConfig(c => ({ ...c, level: l }))}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: '1px solid',
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

          {/* Type & Count */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
                Interview Type
              </label>
              <select className="input" value={config.type} onChange={e => setConfig(c => ({ ...c, type: e.target.value }))}
                style={{ background: 'var(--bg-secondary)' }}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
                Number of Questions
              </label>
              <select className="input" value={config.count} onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}
                style={{ background: 'var(--bg-secondary)' }}>
                {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
              </select>
            </div>
          </div>

          <button onClick={generateQuestions} disabled={loading || !config.role}
            className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}>
            {loading ? <><div className="spinner" />&nbsp; Generating Questions…</> : <><Brain size={18} /> Generate Questions</>}
          </button>
        </div>
      </div>
    );
  }

  // PRACTICING PHASE
  if (phase === 'practicing' && q) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={14} color="var(--text-muted)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {formatTime(timer)}
              </span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <span className={`tag tag-${q.type}`}>{q.type}</span>
          <span className={`tag tag-${q.difficulty}`}>{q.difficulty}</span>
          {q.topic && <span className="tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{q.topic}</span>}
        </div>

        {/* Question */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.5, marginBottom: 16 }}>
            {q.question}
          </h3>

          {/* Hints toggle */}
          {q.hints && q.hints.length > 0 && (
            <div>
              <button onClick={() => setShowHints(h => !h)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--amber)', fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 500, padding: 0
                }}>
                <Lightbulb size={14} /> {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              {showHints && (
                <div style={{
                  marginTop: 12, padding: 14, borderRadius: 10,
                  background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.2)'
                }}>
                  {q.hints.map((h, i) => (
                    <div key={i} style={{ fontSize: '0.83rem', color: 'var(--amber)', marginBottom: i < q.hints.length - 1 ? 6 : 0 }}>
                      • {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be specific and use examples where relevant."
            className="input"
            style={{ minHeight: 180, resize: 'vertical', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{answer.length} characters</span>
            <button onClick={submitAnswer} disabled={loading || !answer.trim()}
              className="btn btn-primary" style={{ padding: '10px 24px' }}>
              {loading ? <><div className="spinner" />&nbsp;Evaluating…</> : <><Send size={16} /> Submit Answer</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REVIEWING PHASE
  if (phase === 'reviewing' && evaluation) {
    const e = evaluation;
    const scoreColor = e.score >= 75 ? 'var(--emerald)' : e.score >= 50 ? 'var(--amber)' : 'var(--rose)';
    const gradeColors = { A: 'var(--emerald)', B: '#22d3ee', C: 'var(--amber)', D: '#f97316', F: 'var(--rose)' };

    return (
      <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Answer Evaluation</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {questions.length}</span>
        </div>

        {/* Score */}
        <div className="card" style={{ padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 32 }}>
          <ScoreCircle score={e.score} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800,
                color: gradeColors[e.grade] || scoreColor
              }}>{e.grade}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                  {e.score >= 80 ? 'Excellent!' : e.score >= 60 ? 'Good Answer' : e.score >= 40 ? 'Needs Work' : 'Keep Practicing'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall performance</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Communication', val: e.communicationScore },
                { label: 'Technical', val: e.technicalScore },
                { label: 'Relevance', val: e.relevanceScore },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${val}%`,
                      background: val >= 75 ? 'var(--emerald)' : val >= 50 ? 'var(--amber)' : 'var(--rose)'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{val}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {e.feedback && (
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Overall Feedback
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>{e.feedback}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Strengths */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 14, fontSize: '0.9rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={15} /> Strengths
            </h4>
            {(e.strengths || []).map((s, i) => (
              <div key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid var(--emerald)' }}>{s}</div>
            ))}
          </div>

          {/* Improvements */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 14, fontSize: '0.9rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={15} /> To Improve
            </h4>
            {(e.improvements || []).map((s, i) => (
              <div key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid var(--rose)' }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Sample answer */}
        {e.sampleAnswer && (
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', color: 'var(--accent-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={15} /> Sample Strong Answer
            </h4>
            <p style={{ fontSize: '0.87rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{e.sampleAnswer}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={restart} className="btn btn-secondary" style={{ gap: 8 }}>
            <RotateCcw size={16} /> Start Over
          </button>
          <button onClick={nextQuestion} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {currentIdx + 1 >= questions.length ? <><CheckCircle size={16} /> Finish Session</> : <><ChevronRight size={16} /> Next Question</>}
          </button>
        </div>
      </div>
    );
  }

  // COMPLETE PHASE
  if (phase === 'complete') {
    const avgScore = allEvals.length > 0
      ? Math.round(allEvals.reduce((sum, e) => sum + e.score, 0) / allEvals.length)
      : 0;
    const scoreColor = avgScore >= 75 ? 'var(--emerald)' : avgScore >= 50 ? 'var(--amber)' : 'var(--rose)';

    return (
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>
          {avgScore >= 80 ? '🏆' : avgScore >= 60 ? '🎯' : '💪'}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
          Session Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>
          You answered {allEvals.length} questions in {formatTime(timer)}
        </p>

        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: scoreColor, marginBottom: 8 }}>
            {avgScore}%
          </div>
          <div style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Average Score</div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${allEvals.length}, 1fr)`, gap: 8 }}>
            {allEvals.map((e, i) => (
              <div key={i} style={{
                padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Q{i + 1}</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
                  color: e.score >= 75 ? 'var(--emerald)' : e.score >= 50 ? 'var(--amber)' : 'var(--rose)'
                }}>
                  {e.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={restart} className="btn btn-primary" style={{ padding: '12px 32px' }}>
            <RotateCcw size={16} /> Practice Again
          </button>
        </div>
      </div>
    );
  }

  return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}><Loader size={32} /></div>;
}
