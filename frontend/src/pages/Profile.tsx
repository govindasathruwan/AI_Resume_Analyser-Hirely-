import React, { useState, useEffect } from 'react';
import { User as UserIcon, FileText, Award, Sparkles, Lock, Save, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, analysisAPI, resumeAPI } from '../api/endpoints';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName]               = useState(user?.name || '');
  const [email]                       = useState(user?.email || '');
  const [currentPw, setCurrentPw]     = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw]       = useState(false);
  const [stats, setStats]             = useState({ resumes: 0, analyses: 0, avgAts: 0 });

  useEffect(() => {
    if (user) setName(user.name || '');
    Promise.all([resumeAPI.getAll(), analysisAPI.getAll()])
      .then(([rr, ar]) => {
        const resumes  = rr.data.resumes   || [];
        const analyses = ar.data.analyses  || [];
        const avg = analyses.length > 0
          ? Math.round(analyses.reduce((s: number, a: any) => s + (a.ats_score || a.full_report?.ats_score || 0), 0) / analyses.length)
          : 0;
        setStats({ resumes: resumes.length, analyses: analyses.length, avgAts: avg });
      }).catch(() => {});
  }, [user]);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile({ name });
      const token = localStorage.getItem('token');
      if (token && res.data.user) login(token, res.data.user);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSavingProfile(false); }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 6)    { toast.error('Min. 6 characters'); return; }
    setSavingPw(true);
    try {
      await authAPI.changePassword({ currentPassword: currentPw, newPassword: newPw });
      toast.success('Password updated');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  const statCards = [
    { icon: FileText,  label: 'Uploaded Resumes',   value: stats.resumes   },
    { icon: Sparkles,  label: 'AI Evaluations',     value: stats.analyses  },
    { icon: Award,     label: 'Avg ATS Score',       value: `${stats.avgAts}/100` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.5px' }}>
          <UserIcon className="w-6 h-6" style={{ color: 'var(--blue)' }} />
          Profile
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your personal details, credentials, and account analytics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="mac-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--blue-light)' }}>
              <Icon className="w-5 h-5" style={{ color: 'var(--blue)' }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Personal Info */}
        <form onSubmit={handleProfile} className="mac-card p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2 pb-3"
            style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)', fontSize: 15 }}>
            <UserIcon className="w-4 h-4" style={{ color: 'var(--blue)' }} />
            Personal Information
          </h2>
          <div>
            <label className="form-label">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input type="email" value={email} disabled className="input-field" style={{ opacity: 0.55, cursor: 'not-allowed' }} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Email cannot be changed directly.</p>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            <Save className="w-4 h-4" />
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        {/* Password */}
        <form onSubmit={handlePassword} className="mac-card p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2 pb-3"
            style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)', fontSize: 15 }}>
            <KeyRound className="w-4 h-4" style={{ color: 'var(--blue)' }} />
            Security & Password
          </h2>
          {[
            { label: 'Current Password', val: currentPw, set: setCurrentPw },
            { label: 'New Password',     val: newPw,     set: setNewPw,     placeholder: 'Min. 6 characters' },
            { label: 'Confirm Password', val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label className="form-label">{label}</label>
              <input
                type="password" value={val}
                onChange={e => set(e.target.value)}
                placeholder={placeholder || '••••••••'}
                className="input-field" required
              />
            </div>
          ))}
          <button type="submit" disabled={savingPw} className="btn-secondary">
            <Lock className="w-4 h-4" />
            {savingPw ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
