import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, FileText, Brain, Menu, X, Sparkles, Zap, Bell, Sun, Moon } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & stats' },
  { to: '/app/practice', icon: Brain, label: 'Practice', desc: 'Targeted sessions' },
  { to: '/app/questions', icon: BookOpen, label: 'Question Bank', desc: 'Browse questions' },
  { to: '/app/mock', icon: MessageSquare, label: 'Mock Interview', desc: 'Live simulation' },
  { to: '/app/resume', icon: FileText, label: 'Resume Optimizer', desc: 'ATS optimization' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
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
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;
    const handler = () => setScrolled(mainEl.scrollTop > 10);
    mainEl.addEventListener('scroll', handler);
    return () => mainEl.removeEventListener('scroll', handler);
  }, []);

  const currentPage = navItems.find(n => location.pathname === n.to);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 40,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: isMobile ? (sidebarOpen ? 0 : -260) : 0,
        height: '100vh',
        flexShrink: 0,
        zIndex: 50,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isMobile && sidebarOpen ? '4px 0 40px rgba(0,0,0,0.5)' : 'none',
      }}>
        {/* Logo area */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.5)',
              flexShrink: 0,
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>PrepDeck</div>
              <div style={{
                fontSize: '0.65rem',
                color: 'var(--accent-bright)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                letterSpacing: '0.05em',
              }}>AI INTERVIEW COACH</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{
            fontSize: '0.63rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            padding: '4px 10px 12px',
            textTransform: 'uppercase',
          }}>
            Main Menu
          </div>
          {navItems.map(({ to, icon: Icon, label, desc }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 12px',
                borderRadius: 10,
                marginBottom: 3,
                textDecoration: 'none',
                transition: 'all 0.2s var(--ease)',
                color: isActive ? 'var(--accent-bright)' : 'var(--text-secondary)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)'
                  : 'transparent',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : 'transparent'}`,
                position: 'relative',
                overflow: 'hidden',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0, top: '20%', bottom: '20%',
                      width: 3,
                      background: 'linear-gradient(180deg, var(--accent) 0%, var(--violet) 100%)',
                      borderRadius: '0 2px 2px 0',
                    }} />
                  )}
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'rgba(99,102,241,0.2)' : 'var(--bg-elevated)',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                    transition: 'all 0.2s var(--ease)',
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.87rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      fontFamily: 'var(--font-body)',
                    }}>{label}</div>
                    <div style={{
                      fontSize: '0.68rem',
                      color: isActive ? 'rgba(129,140,248,0.7)' : 'var(--text-muted)',
                      marginTop: 1,
                    }}>{desc}</div>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom info card */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            padding: '14px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--accent-bright)',
              fontWeight: 700,
              marginBottom: 6,
              display: 'flex', alignItems: 'center', gap: 6,
              letterSpacing: '0.04em',
            }}>
              <Zap size={12} fill="currentColor" /> PRACTICE STREAK
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}>0</div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>days in a row</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Start practicing to build</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top header */}
        <header style={{
          padding: '0 28px',
          height: 64,
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(13, 14, 26, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          transition: 'all 0.3s var(--ease)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className="btn-ghost btn btn-icon"
                style={{ color: 'var(--text-primary)' }}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Breadcrumb */}
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}>
                {currentPage?.label || 'PrepDeck'}
              </div>
              <div className="hide-mobile" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {currentPage?.desc || 'AI-powered interview preparation'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Notification bell */}
            <button className="btn btn-ghost btn-icon" style={{ color: 'var(--text-muted)', position: 'relative' }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--accent-mid)',
                border: '1.5px solid var(--bg-base)',
              }} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="btn btn-ghost btn-icon" 
              style={{ color: 'var(--text-muted)' }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Status pill */}
            <div className="hide-sm" style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.75rem',
              color: 'var(--emerald-light)',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--emerald)',
                boxShadow: '0 0 0 0 var(--emerald)',
                display: 'inline-block',
                animation: 'pulse-ring 2s infinite',
              }} />
              System Online
            </div>

            {/* Clerk User Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
              <UserButton afterSignOutUrl="/login" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          className="layout-main"
          style={{
            flex: 1,
            overflow: 'auto',
            background: `
              radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%),
              var(--bg-base)
            `,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
