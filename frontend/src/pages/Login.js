import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';

export default function Login() {
  const { isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('mode') === 'signup';

  // Redirect to dashboard if already signed in
  if (isSignedIn) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const clerkAppearance = {
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: 'rgba(21, 23, 42, 0.95)',
      colorInputBackground: '#0d0e1a',
      colorText: '#f0f2ff',
      colorTextSecondary: '#94a3b8',
      colorInputText: '#f0f2ff',
      colorBorder: 'rgba(99, 102, 241, 0.2)',
    },
    elements: {
      card: 'border border-[#6366f1]/20 backdrop-blur-md shadow-2xl rounded-2xl',
      headerTitle: 'font-extrabold text-xl tracking-tight text-[#f0f2ff]',
      headerSubtitle: 'text-xs text-[#94a3b8]',
      socialButtonsBlockButton: 'bg-[#0d0e1a] border border-[#6366f1]/10 text-[#f0f2ff] hover:bg-[#15172a] transition-all duration-200',
      socialButtonsBlockButtonText: 'font-semibold',
      formButtonPrimary: 'bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-[#6366f1]/30 transition-all duration-200',
      formFieldInput: 'bg-[#0d0e1a] border border-[#6366f1]/15 text-[#f0f2ff] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] rounded-lg py-2.5',
      footerActionLink: 'text-[#6366f1] hover:text-[#818cf8] font-semibold',
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left decorative panel (hidden on small screens) */}
      <div className="hide-mobile" style={{
        width: '45%', maxWidth: 520,
        background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(139,92,246,0.08) 50%, rgba(16,185,129,0.06) 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 52px', position: 'relative', overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Blobs */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-20%',
          width: '80%', height: '80%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(79,70,229,0.5)',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>PrepDeck</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 18,
          }}>
            Land your<br />
            <span className="gradient-text">dream job.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40, maxWidth: 340 }}>
            Practice with AI-powered mock interviews tailored to your role and experience level. Get honest feedback on every answer.
          </p>

          {/* Testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'Alex M.', role: 'SWE @ Google', text: 'PrepDeck helped me nail my system design round.' },
              { name: 'Sarah K.', role: 'Frontend @ Meta', text: 'The feedback was more detailed than anything I expected.' },
            ].map(({ name, role, text }) => (
              <div key={name} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(13,14,26,0.6)', border: '1px solid var(--border)',
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--violet) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, color: 'white',
                  }}>{name[0]}</div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
      }}>
        {/* Subtle ambient */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
          {isSignUp ? (
            <SignUp
              appearance={clerkAppearance}
              signInUrl="/login?mode=signin"
              forceRedirectUrl="/app/dashboard"
            />
          ) : (
            <SignIn
              appearance={clerkAppearance}
              signUpUrl="/login?mode=signup"
              forceRedirectUrl="/app/dashboard"
            />
          )}
        </div>
      </div>
    </div>
  );
}
