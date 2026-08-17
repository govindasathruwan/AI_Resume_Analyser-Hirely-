import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, AlertCircle, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../components/UI/AppLogo';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', job_title: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { register }        = useAuth();
  const navigate            = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, job_title: formData.job_title || undefined });
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (id: string, name: string, type: string, label: string, placeholder: string, Icon: React.ElementType, extra?: React.ReactNode) => (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
        <input
          id={id} type={type} name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className="input-field"
          style={{
            paddingLeft: '36px',
            paddingRight: extra ? '36px' : undefined,
            height: '38px',
            borderRadius: '9px',
            fontSize: '13px',
            border: '1px solid var(--border-strong)',
          }}
          placeholder={placeholder}
          required={name !== 'job_title'}
          autoComplete={type === 'password' ? 'new-password' : undefined}
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center px-4 py-4 relative overflow-y-auto transition-colors duration-200" style={{ background: 'var(--bg)' }}>
      {/* Mesh Ambient Glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 650, height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 60%)',
          top: '-20%', left: '50%', transform: 'translateX(-50%)',
        }}
      />

      <div className="w-full max-w-sm sm:max-w-md relative z-10 animate-slide-up my-auto">
        {/* Back Link */}
        <div className="mb-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
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
          {/* Header */}
          <div className="text-center mb-5">
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
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>Create Account</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Start evaluating your resume for ATS systems</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl mb-3 text-xs font-medium"
              style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(255,59,48,0.25)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {field('register-name',     'name',            'text',     'Full Name',            'John Doe',                 User)}
            {field('register-email',    'email',           'email',    'Email Address',        'you@example.com',          Mail)}
            {field('register-jobtitle', 'job_title',       'text',     'Target Job Title',     'e.g. Software Engineer',    Briefcase)}
            {field('register-password', 'password',        showPw ? 'text' : 'password', 'Password', 'Min. 6 characters', Lock,
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}
            {field('register-confirm',  'confirmPassword', showPw ? 'text' : 'password', 'Confirm Password', 'Repeat password', Lock)}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-xs font-semibold"
              style={{ padding: '9px 18px', borderRadius: '9px', marginTop: '6px' }}
            >
              {loading
                ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-1.5" />Creating Account...</>
                : <><div className="flex items-center gap-2"><span>Create Free Account</span><ArrowRight className="w-3.5 h-3.5" /></div></>}
            </button>
          </form>

          {/* Security footer */}
          <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[11px]" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-subtle)' }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
            <span>End-to-end local data encryption & privacy</span>
          </div>
        </div>

        <p className="text-center text-xs mt-3.5" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
