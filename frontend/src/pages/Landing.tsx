import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AppLogo from '../components/UI/AppLogo';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    if (isAuthenticated || hasToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleAction = () => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    if (isAuthenticated || hasToken) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col justify-between relative overflow-hidden transition-colors duration-200"
      style={{ background: 'var(--bg)' }}
    >
      {/* Ambient macOS Mesh Background Glows */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(10,132,255,0.14) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 60%)',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(48,209,88,0.08) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(52,199,89,0.06) 0%, transparent 65%)',
          bottom: '-15%',
          right: '5%',
        }}
      />

      {/* Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <AppLogo size={32} />
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Hirely
          </span>
        </div>

        {/* Right Actions: Light/Dark Theme Switcher + Single Auth Button */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="w-9 h-9 rounded-full cursor-pointer transition-all flex items-center justify-center hover:scale-105 active:scale-95"
            style={{
              background: 'var(--surface-translucent)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </button>

          {/* Strictly 1 Button in Header */}
          <button
            onClick={handleAction}
            className="btn-primary text-xs font-semibold cursor-pointer transition-all"
            style={{ padding: '8px 20px', borderRadius: '980px' }}
          >
            {isAuthenticated ? 'Go to Dashboard →' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Hero Center Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center relative z-10 max-w-3xl mx-auto animate-fade-in">
        {/* Pill Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 transition-all"
          style={{
            background: 'var(--blue-light)',
            color: 'var(--blue)',
            border: '1px solid rgba(0, 113, 227, 0.15)',
            boxShadow: '0 2px 10px rgba(0,113,227,0.08)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI RESUME & ATS OPTIMIZER</span>
        </div>

        {/* Hero Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          style={{ color: 'var(--text)', lineHeight: 1.15 }}
        >
          Land <span style={{ color: 'var(--blue)' }}>3x More</span> <br className="hidden sm:inline" />
          Job Interviews
        </h1>

        {/* Hero Description */}
        <p
          className="text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal"
          style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}
        >
          Upload your resume and let AI score, analyse, and optimise it for enterprise ATS systems. Actionable feedback in under 60 seconds.
        </p>

        {/* Main CTA Button */}
        <button
          onClick={handleAction}
          className="btn-primary text-sm font-semibold cursor-pointer mb-6"
          style={{
            padding: '12px 28px',
            borderRadius: '980px',
            fontSize: '14px',
          }}
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Social Proof Star Rating */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
          <div className="flex items-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span>Trusted by job seekers & hiring managers worldwide</span>
        </div>
      </main>

      {/* Bottom Statistics Cards (4 Columns) */}
      <footer className="w-full max-w-5xl mx-auto px-6 pb-8 pt-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="mac-card p-5 rounded-2xl text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--surface-translucent)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--blue)', letterSpacing: '-0.5px' }}>
              88%
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              ATS Pass Rate
            </div>
          </div>

          <div
            className="mac-card p-5 rounded-2xl text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--surface-translucent)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--blue)', letterSpacing: '-0.5px' }}>
              3.2x
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              More Interviews
            </div>
          </div>

          <div
            className="mac-card p-5 rounded-2xl text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--surface-translucent)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--blue)', letterSpacing: '-0.5px' }}>
              12
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              Resumes Analysed
            </div>
          </div>

          <div
            className="mac-card p-5 rounded-2xl text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--surface-translucent)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--blue)', letterSpacing: '-0.5px' }}>
              4.8/5
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              User Rating
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
