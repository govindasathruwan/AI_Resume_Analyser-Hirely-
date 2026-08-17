import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../components/UI/AppLogo';
import toast from 'react-hot-toast';

const Login = () => {
  const savedEmail    = localStorage.getItem('saved_email') || '';
  const savedPassword = localStorage.getItem('saved_password') || '';
  const savedName     = localStorage.getItem('saved_name') || '';

  const [email, setEmail]       = useState(savedEmail);
  const [password, setPassword] = useState(savedPassword);
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }               = useAuth();
  const navigate                = useNavigate();
  const passwordRef             = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (savedEmail && !email) setEmail(savedEmail);
    if (savedPassword && !password) setPassword(savedPassword);
  }, [savedEmail, savedPassword]);

  const handleUseSavedAccount = async () => {
    const targetEmail = savedEmail || email;
    const targetPassword = savedPassword || password;
    setEmail(targetEmail);
    setPassword(targetPassword);

    if (targetEmail && targetPassword) {
      setError('');
      setLoading(true);
      try {
        await login(targetEmail, targetPassword);
        toast.success(`Welcome back, ${savedName || targetEmail}`);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    } else if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to Hirely');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center px-4 py-4 relative overflow-y-auto transition-colors duration-200"
      style={{ background: 'var(--bg)' }}
    >
      {/* Mesh Background Ambient Orbs */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 650, height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 60%)',
          top: '-20%', left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div className="w-full max-w-sm sm:max-w-md relative z-10 animate-slide-up my-auto">
        {/* Back Link */}
        <div className="mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Liquid Glass Card Container */}
        <div
          className="mac-card p-6 rounded-2xl relative"
          style={{
            background: 'var(--surface-translucent)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header Branding */}
          <div className="text-center mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{
                background: 'var(--blue-light)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 14px rgba(0,113,227,0.2)',
              }}
            >
              <AppLogo size={26} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
              Sign in to Hirely
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Enter your credentials to access your AI resume workspace
            </p>
          </div>

          {/* Saved Account Quick 1-Click Login Card */}
          {savedEmail && (
            <div
              onClick={handleUseSavedAccount}
              className="flex items-center gap-3 p-3 rounded-xl mb-4 text-xs cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group"
              style={{
                background: 'var(--blue-light)',
                border: '1px solid rgba(0, 113, 227, 0.25)',
                boxShadow: '0 2px 10px rgba(0, 113, 227, 0.08)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                style={{ background: 'var(--blue)' }}
              >
                {savedName?.charAt(0)?.toUpperCase() || savedEmail?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[var(--blue)]" />
                  <p className="font-bold text-[var(--text)] truncate">{savedName || 'Saved Account'}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[11px] truncate opacity-80" style={{ color: 'var(--text-muted)' }}>{savedEmail}</p>
                  {savedPassword && (
                    <span title="Password Saved" className="inline-flex">
                      <KeyRound className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--blue)] text-white shadow-xs group-hover:bg-[var(--blue-hover)] transition-all cursor-pointer border-none"
              >
                {savedPassword ? '1-Click Login' : 'Log In As'}
              </button>
            </div>
          )}

          {error && (
            <div
              className="flex items-center gap-2 p-2.5 rounded-xl mb-3 text-xs font-medium"
              style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(255,59,48,0.25)' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-subtle)' }}
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  style={{
                    paddingLeft: '36px',
                    height: '38px',
                    borderRadius: '9px',
                    fontSize: '13px',
                    border: '1px solid var(--border-strong)',
                  }}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-subtle)' }}
                />
                <input
                  id="login-password"
                  ref={passwordRef}
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  style={{
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    height: '38px',
                    borderRadius: '9px',
                    fontSize: '13px',
                    border: '1px solid var(--border-strong)',
                  }}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-xs font-semibold"
              style={{ padding: '9px 18px', borderRadius: '9px', marginTop: '6px' }}
            >
              {loading ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </form>

          {/* Security badge */}
          <div
            className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[11px]"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-subtle)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
            <span>End-to-end local data encryption & JWT security</span>
          </div>
        </div>

        <p className="text-center text-xs mt-3.5" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600 }}>
            Create free account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
