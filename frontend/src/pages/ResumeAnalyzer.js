import React, { useState } from 'react';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FileText, BarChart3, AlertCircle, CheckCircle, Zap, RefreshCw, ArrowLeft, Copy, Check, Sparkles } from 'lucide-react';

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
          color, padding: '1px 8px', borderRadius: 4,
          background: `${color}15`,
        }}>{score}/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [phase, setPhase] = useState('input');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetLevel, setTargetLevel] = useState('Mid-level');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [tailorResults, setTailorResults] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze');
  const [copied, setCopied] = useState(false);

  const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'ML Engineer'];
  const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff'];

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return toast.error('Please paste your resume');
    setLoading(true);
    try {
      const res = await resumeAPI.analyzeResume({ resumeText, targetRole, targetLevel });
      setAnalysis(res.data.analysis);
      setPhase('results');
      toast.success('Resume analyzed!');
    } catch (e) {
      toast.error(e.message || 'Failed to analyze resume');
    } finally { setLoading(false); }
  };

  const handleTailor = async () => {
    if (!jobDesc.trim()) return toast.error('Please paste the job description');
    if (!resumeText.trim()) return toast.error('Please paste your resume first');
    setLoading(true);
    try {
      const res = await resumeAPI.tailorResume({ resumeText, jobDescription: jobDesc });
      setTailorResults(res.data);
      toast.success('Resume tailored!');
    } catch (e) {
      toast.error(e.message || 'Failed to tailor resume');
    } finally { setLoading(false); }
  };

  // ── INPUT ──
  if (phase === 'input') {
    return (
      <div style={{ maxWidth: 1040, margin: '0 auto' }} className="animate-in">
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Resume Optimizer
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Get instant AI feedback and optimize your resume for ATS and recruiters.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          padding: 4, background: 'var(--bg-secondary)', borderRadius: 12,
          border: '1px solid var(--border)', width: 'fit-content',
        }}>
          {[
            { id: 'analyze', label: '📊 Analyze Resume', icon: BarChart3 },
            { id: 'tailor', label: '⚡ Tailor for Job', icon: Zap },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                padding: '9px 20px', borderRadius: 9,
                background: activeTab === id ? 'var(--bg-card)' : 'transparent',
                color: activeTab === id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                boxShadow: activeTab === id ? 'var(--shadow-sm)' : 'none',
                border: activeTab === id ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >{label}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: tailorResults ? '1fr' : '1fr 1fr', gap: 24 }}>
          {/* Shared: Resume input */}
          <div style={{ padding: 28, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'analyze' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={17} color="var(--accent-bright)" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Analyze Your Resume</h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Get ATS score & detailed feedback</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 7 }}>Target Role</label>
                    <select className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 7 }}>Level</label>
                    <select className="input" value={targetLevel} onChange={e => setTargetLevel(e.target.value)}>
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Paste Your Resume
                </label>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your full resume here. Include all sections: Summary, Experience, Skills, Education, etc."
                  className="input"
                  style={{ flex: 1, minHeight: 280, resize: 'vertical', lineHeight: 1.65 }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !resumeText.trim()}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 16, padding: '12px', justifyContent: 'center' }}
                >
                  {loading ? <><div className="spinner" /> Analyzing…</> : <><BarChart3 size={16} /> Analyze Resume</>}
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={17} color="var(--emerald-light)" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Tailor for Job Description</h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Match keywords, boost ATS score</div>
                  </div>
                </div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Your Resume
                </label>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume here…"
                  className="input"
                  style={{ flex: 1, minHeight: 200, resize: 'vertical', lineHeight: 1.65, marginBottom: 14 }}
                />
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Job Description
                </label>
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here. The AI will find matching keywords and tailor your resume."
                  className="input"
                  style={{ flex: 1, minHeight: 200, resize: 'vertical', lineHeight: 1.65 }}
                />
                <button
                  onClick={handleTailor}
                  disabled={loading || !resumeText.trim() || !jobDesc.trim()}
                  className="btn btn-success"
                  style={{ width: '100%', marginTop: 16, padding: '12px', justifyContent: 'center', fontWeight: 700 }}
                >
                  {loading ? <><div className="spinner" /> Tailoring…</> : <><Sparkles size={16} /> Tailor Resume</>}
                </button>
              </>
            )}
          </div>

          {/* Right column: tips & tailor results */}
          {!tailorResults ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tips card */}
              <div style={{ padding: 24, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  📌 Resume Tips
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { tip: 'Include all sections', detail: 'Summary, Experience, Skills, Education' },
                    { tip: 'Quantify achievements', detail: 'Use numbers and percentages where possible' },
                    { tip: 'Match the job description', detail: 'Mirror keywords for better ATS scores' },
                    { tip: 'Keep it to 1–2 pages', detail: 'Most recruiters spend < 10 seconds per resume' },
                  ].map(({ tip, detail }, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, padding: '10px 12px', borderRadius: 8,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-bright)',
                        fontFamily: 'var(--font-mono)',
                      }}>{i + 1}</div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 2 }}>{tip}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats card */}
              <div style={{ padding: 20, borderRadius: 14, background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-bright)', marginBottom: 12 }}>✨ What we analyze</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['ATS compatibility score', 'Skills & keyword gaps', 'Section completeness', 'Language & formatting', 'Role-specific optimization'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={13} color="var(--emerald)" fill="var(--emerald)" style={{ flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Tailor Results */
            <div style={{ padding: 28, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>Tailored Result</h3>
                <div style={{
                  fontWeight: 800, fontSize: '1rem', color: 'var(--emerald-light)',
                  background: 'var(--emerald-dim)', padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--emerald-border)',
                }}>
                  {tailorResults.matchScore}% Match
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-light)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Keyword Matches</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(tailorResults.keywordMatches || []).map(k => (
                      <span key={k} style={{ padding: '3px 9px', borderRadius: 'var(--radius-full)', background: 'var(--emerald-dim)', border: '1px solid var(--emerald-border)', color: 'var(--emerald-light)', fontSize: '0.72rem', fontWeight: 500 }}>{k}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-bright)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Added Keywords</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(tailorResults.addedKeywords || []).map(k => (
                      <span key={k} style={{ padding: '3px 9px', borderRadius: 'var(--radius-full)', background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--accent-bright)', fontSize: '0.72rem', fontWeight: 500 }}>+{k}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{
                padding: '14px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.65,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 240, overflow: 'auto',
                color: 'var(--text-secondary)', marginBottom: 14,
              }}>
                {tailorResults.tailoredResume}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { navigator.clipboard.writeText(tailorResults.tailoredResume); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Resume</>}
                </button>
                <button onClick={() => setTailorResults(null)} className="btn btn-ghost">Reset</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === 'results' && analysis) {
    const a = analysis;
    const overallColor = a.overallScore >= 75 ? 'var(--emerald)' : a.overallScore >= 50 ? 'var(--amber)' : 'var(--rose)';

    return (
      <div style={{ maxWidth: 980, margin: '0 auto' }} className="animate-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <button onClick={() => setPhase('input')} className="btn btn-secondary btn-sm" style={{ gap: 7 }}>
            <ArrowLeft size={14} /> Back to Analyzer
          </button>
          <button onClick={handleAnalyze} className="btn btn-ghost btn-sm" disabled={loading}>
            <RefreshCw size={13} /> Re-analyze
          </button>
        </div>

        {/* Overall Score hero */}
        <div style={{
          padding: '28px 32px', borderRadius: 16,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap',
        }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 900,
              color: overallColor, lineHeight: 1,
              textShadow: `0 0 40px ${overallColor}50`,
            }}>
              {a.overallScore}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>Overall Score</div>
            <div style={{
              marginTop: 8, padding: '4px 12px', borderRadius: 'var(--radius-full)',
              background: `${overallColor}15`, border: `1px solid ${overallColor}35`,
              fontSize: '0.72rem', fontWeight: 700, color: overallColor,
            }}>
              {a.overallScore >= 75 ? '🟢 Strong' : a.overallScore >= 50 ? '🟡 Fair' : '🔴 Needs Work'}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Resume Quality Breakdown
            </div>
            <ScoreBar label="ATS Score" score={a.atsScore} color="var(--accent-bright)" />
            {Object.entries(a.sections || {}).map(([key, val]) => (
              <ScoreBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} score={val.score} color="var(--text-muted)" />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Strengths */}
          <div style={{ padding: 24, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--emerald-light)', fontSize: '0.8rem', fontWeight: 700 }}>
              <CheckCircle size={15} fill="currentColor" /> STRENGTHS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(a.strengths || []).map((s, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--emerald-dim)', border: '1px solid var(--emerald-border)',
                  fontSize: '0.83rem', color: 'var(--emerald-light)', fontWeight: 500,
                  display: 'flex', gap: 8,
                }}>
                  <span style={{ flexShrink: 0 }}>✓</span> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div style={{ padding: 24, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--rose-light)', fontSize: '0.8rem', fontWeight: 700 }}>
              <AlertCircle size={15} fill="currentColor" /> AREAS TO IMPROVE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(a.weaknesses || []).map((s, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--rose-dim)', border: '1px solid var(--rose-border)',
                  fontSize: '0.83rem', color: 'var(--rose-light)', fontWeight: 500,
                  display: 'flex', gap: 8,
                }}>
                  <span style={{ flexShrink: 0 }}>→</span> {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div style={{ padding: 24, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18, fontSize: '1rem' }}>Keywords Analysis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rose-light)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Missing Keywords</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(a.missingKeywords || []).map(k => (
                  <span key={k} style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--rose-dim)', border: '1px solid var(--rose-border)', fontSize: '0.73rem', color: 'var(--rose-light)', fontWeight: 500 }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-light)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recommended to Add</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(a.suggestedKeywords || []).map(k => (
                  <span key={k} style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--emerald-dim)', border: '1px solid var(--emerald-border)', fontSize: '0.73rem', color: 'var(--emerald-light)', fontWeight: 500 }}>
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div style={{ padding: 24, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Action Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(a.actionItems || []).map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '12px 14px',
                borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-bright)',
                  fontFamily: 'var(--font-mono)',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, paddingTop: 1 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setPhase('input')} className="btn btn-primary" style={{ padding: '12px 28px' }}>
          <RefreshCw size={15} /> Analyze Another Resume
        </button>
      </div>
    );
  }

  return <div />;
}
