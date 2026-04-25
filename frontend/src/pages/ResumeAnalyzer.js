import React, { useState } from 'react';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FileText, Upload, Loader, BarChart3, AlertCircle, CheckCircle, Zap, RefreshCw } from 'lucide-react';

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [phase, setPhase] = useState('input'); // input | analyzing | results
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetLevel, setTargetLevel] = useState('Mid-level');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [tailorResults, setTailorResults] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDesc.trim()) return toast.error('Please paste the job description');
    setLoading(true);
    try {
      const res = await resumeAPI.tailorResume({ resumeText, jobDescription: jobDesc });
      setTailorResults(res.data);
      toast.success('Resume tailored!');
    } catch (e) {
      toast.error(e.message || 'Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'ML Engineer'];
  const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff'];

  // INPUT PHASE
  if (phase === 'input') {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            Resume AI Analyzer
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Get AI-powered feedback on your resume and optimize for ATS and recruiters.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Paste Resume */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color="var(--accent-bright)" /> Analyze Your Resume
            </h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
                Target Role
              </label>
              <select className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                style={{ background: 'var(--bg-secondary)', marginBottom: 10 }}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
              <select className="input" value={targetLevel} onChange={e => setTargetLevel(e.target.value)}
                style={{ background: 'var(--bg-secondary)' }}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
              Paste Your Resume
            </label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your full resume here. Include all sections: Summary, Experience, Skills, Education, etc."
              style={{
                flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                fontSize: '0.9rem', outline: 'none', minHeight: 300, resize: 'vertical',
              }}
            />
            <button onClick={handleAnalyze} disabled={loading || !resumeText.trim()}
              className="btn btn-primary" style={{ width: '100%', marginTop: 16, padding: '12px', justifyContent: 'center' }}>
              {loading ? <><Loader size={16} />&nbsp;Analyzing…</> : <><BarChart3 size={16} /> Analyze Resume</>}
            </button>
          </div>

          {/* Tailor */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} color="var(--emerald)" /> Tailor for Job
            </h3>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
              Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description here. Our AI will find matching keywords and tailor your resume."
              style={{
                flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                fontSize: '0.9rem', outline: 'none', minHeight: 300, resize: 'vertical',
              }}
            />
            <button onClick={handleTailor} disabled={loading || !resumeText.trim() || !jobDesc.trim()}
              className="btn btn-primary" style={{ width: '100%', marginTop: 16, padding: '12px', justifyContent: 'center' }}>
              {loading ? <><Loader size={16} />&nbsp;Tailoring…</> : <><RefreshCw size={16} /> Tailor Resume</>}
            </button>
          </div>
        </div>

        <div style={{
          marginTop: 24, padding: 20, borderRadius: 12,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>📌 Tips:</div>
          • Include your complete resume with all sections<br/>
          • Copy-paste from your document or PDF<br/>
          • The AI will score your ATS compatibility<br/>
          • Use tailor feature to match job descriptions<br/>
          • Review keywords for your target role
        </div>
      </div>
    );
  }

  // RESULTS PHASE
  if (phase === 'results' && analysis) {
    const a = analysis;
    const overallColor = a.overallScore >= 75 ? 'var(--emerald)' : a.overallScore >= 50 ? 'var(--amber)' : 'var(--rose)';

    return (
      <div style={{ maxWidth: 950, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <button onClick={() => setPhase('input')} className="btn btn-secondary" style={{ marginBottom: 24 }}>
          ← Back to Analyzer
        </button>

        {/* Overall Score */}
        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: overallColor, lineHeight: 1 }}>
                {a.overallScore}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8 }}>Overall Score</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
                Resume Quality Breakdown
              </div>
              <ScoreBar label="ATS Score" score={a.atsScore} color="var(--accent-bright)" />
              {Object.entries(a.sections || {}).map(([key, val]) => (
                <ScoreBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} score={val.score} color="var(--text-secondary)" />
              ))}
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Strengths */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={18} /> Strengths
            </h3>
            {(a.strengths || []).map((s, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8, background: 'var(--emerald-dim)',
                border: '1px solid rgba(16,185,129,0.2)', marginBottom: 8,
                fontSize: '0.84rem', color: 'var(--emerald)', fontWeight: 500
              }}>
                ✓ {s}
              </div>
            ))}
          </div>

          {/* Weaknesses */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} /> Areas to Improve
            </h3>
            {(a.weaknesses || []).map((s, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8, background: 'var(--rose-dim)',
                border: '1px solid rgba(244,63,94,0.2)', marginBottom: 8,
                fontSize: '0.84rem', color: 'var(--rose)', fontWeight: 500
              }}>
                → {s}
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem', color: 'var(--accent-bright)' }}>
            Keywords Analysis
          </h3>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>Missing Keywords</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(a.missingKeywords || []).map(k => (
                <span key={k} style={{
                  padding: '4px 10px', borderRadius: 6, background: 'var(--rose-dim)',
                  border: '1px solid rgba(244,63,94,0.2)', fontSize: '0.75rem',
                  color: 'var(--rose)', fontWeight: 500
                }}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>Recommended Keywords</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(a.suggestedKeywords || []).map(k => (
                <span key={k} style={{
                  padding: '4px 10px', borderRadius: 6, background: 'var(--emerald-dim)',
                  border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.75rem',
                  color: 'var(--emerald)', fontWeight: 500
                }}>
                  + {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>
            Action Items
          </h3>
          <ol style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
            {(a.actionItems || []).map((item, i) => (
              <li key={i} style={{ marginBottom: 10 }}>{item}</li>
            ))}
          </ol>
        </div>

        <button onClick={() => setPhase('input')} className="btn btn-primary" style={{ marginTop: 24, padding: '12px 32px' }}>
          Analyze Another Resume
        </button>
      </div>
    );
  }

  // Tailor Results
  if (tailorResults) {
    return (
      <div style={{ maxWidth: 950, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <button onClick={() => setTailorResults(null)} className="btn btn-secondary" style={{ marginBottom: 24 }}>
          ← Back
        </button>

        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
              Tailored Resume
            </h2>
            <div style={{
              fontSize: '1.2rem', fontWeight: 700, color: 'var(--emerald)',
              background: 'var(--emerald-dim)', padding: '8px 16px', borderRadius: 20,
              border: '1px solid rgba(16,185,129,0.25)'
            }}>
              {tailorResults.matchScore}% Match
            </div>
          </div>

          <div style={{
            padding: 16, borderRadius: 10, background: 'var(--bg-secondary)',
            border: '1px solid var(--border)', marginBottom: 16,
            fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 400, overflow: 'auto',
            color: 'var(--text-secondary)'
          }}>
            {tailorResults.tailoredResume}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--emerald)' }}>Keyword Matches</h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(tailorResults.keywordMatches || []).map(k => (
                  <span key={k} className="tag tag-technical" style={{ fontSize: '0.7rem' }}>{k}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--accent-bright)' }}>Added Keywords</h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(tailorResults.addedKeywords || []).map(k => (
                  <span key={k} className="tag" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--accent-bright)', fontSize: '0.7rem' }}>+{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {tailorResults.recommendations && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Recommendations</h3>
            <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20 }}>
              {tailorResults.recommendations.map((r, i) => (
                <li key={i} style={{ marginBottom: 8 }}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return <div />;
}
