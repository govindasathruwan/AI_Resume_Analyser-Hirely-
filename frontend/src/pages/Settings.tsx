import React, { useState } from 'react';
import {
  Settings as SettingsIcon, Sliders, Sparkles, ShieldAlert, Check, Trash2, Sun, Moon, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    style={{
      width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: checked ? 'var(--blue)' : 'var(--border-strong)',
      position: 'relative', transition: 'background 0.2s',
      display: 'flex', alignItems: 'center', padding: '0 3px', flexShrink: 0,
    }}
  >
    <div style={{
      width: 20, height: 20, borderRadius: '50%', background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      transform: checked ? 'translateX(18px)' : 'translateX(0)',
      transition: 'transform 0.2s',
    }} />
  </button>
);

const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="mac-card p-6">
    <h2 className="font-semibold flex items-center gap-2 pb-3 mb-5 text-base"
      style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)', letterSpacing: '-0.2px' }}>
      <Icon className="w-4.5 h-4.5" style={{ color: 'var(--blue)' }} />
      {title}
    </h2>
    {children}
  </div>
);

const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-6 py-3.5"
    style={{ borderBottom: '1px solid var(--border)' }}>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { theme, setTheme } = useTheme();

  // Initialize state directly from localStorage
  const [aiStrictness, setAiStrictnessState] = useState<string>(() => {
    const saved = localStorage.getItem('hirely_ai_strictness');
    return (saved === 'lenient' || saved === 'detailed' || saved === 'aggressive') ? saved : 'detailed';
  });

  const [emailAlerts, setEmailAlertsState] = useState<boolean>(() => {
    const saved = localStorage.getItem('hirely_email_alerts');
    return saved !== null ? saved === 'true' : true;
  });

  const [saveLocalHistory, setSaveHistoryState] = useState<boolean>(() => {
    const saved = localStorage.getItem('hirely_cache_history');
    return saved !== null ? saved === 'true' : true;
  });

  // Handler for precision selection that immediately saves to localStorage
  const handleStrictnessSelect = (id: string) => {
    setAiStrictnessState(id);
    localStorage.setItem('hirely_ai_strictness', id);
  };

  const handleToggleHistory = (val: boolean) => {
    setSaveHistoryState(val);
    localStorage.setItem('hirely_cache_history', String(val));
    if (!val) {
      localStorage.removeItem('hirely_cached_analyses');
    }
  };

  const handleToggleAlerts = (val: boolean) => {
    setEmailAlertsState(val);
    localStorage.setItem('hirely_email_alerts', String(val));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hirely_ai_strictness', aiStrictness);
    localStorage.setItem('hirely_email_alerts', String(emailAlerts));
    localStorage.setItem('hirely_cache_history', String(saveLocalHistory));
    toast.success('Preferences saved successfully');
  };

  const handleClearCache = () => {
    if (window.confirm('Clear cached evaluations and reset stored application settings?')) {
      localStorage.removeItem('hirely_cached_analyses');
      localStorage.removeItem('hirely_last_analysis_id');
      localStorage.removeItem('hirely_ai_strictness');
      localStorage.removeItem('hirely_email_alerts');
      localStorage.removeItem('hirely_cache_history');
      
      // Reset state to defaults
      setAiStrictnessState('detailed');
      setEmailAlertsState(true);
      setSaveHistoryState(true);

      toast.success('Application cache & preferences reset successfully');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
          <SettingsIcon className="w-6 h-6" style={{ color: 'var(--blue)' }} />
          Settings & Preferences
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Customise AI evaluation precision, appearance theme, notification alerts, and local data storage
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance & Theme */}
        <SectionCard title="Appearance & Theme" icon={Sliders}>
          <div className="pb-4 space-y-3">
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Theme Mode</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className="p-4 rounded-xl flex items-center justify-center gap-2.5 font-medium text-sm transition-all cursor-pointer"
                style={{
                  border: `2px solid ${theme === 'light' ? 'var(--blue)' : 'var(--border)'}`,
                  background: theme === 'light' ? 'var(--blue-light)' : 'var(--surface)',
                  color: 'var(--text)',
                }}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className="p-4 rounded-xl flex items-center justify-center gap-2.5 font-medium text-sm transition-all cursor-pointer"
                style={{
                  border: `2px solid ${theme === 'dark' ? 'var(--blue)' : 'var(--border)'}`,
                  background: theme === 'dark' ? 'var(--blue-light)' : 'var(--surface)',
                  color: 'var(--text)',
                }}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          <Row label="Cache History Locally" sub="Keep recent evaluations in browser storage for instant offline viewing">
            <Toggle checked={saveLocalHistory} onChange={handleToggleHistory} />
          </Row>
          <div style={{ borderBottom: 'none' }}>
            <Row label="Email Digest & Alerts" sub="Receive notification summaries when resume evaluations complete">
              <Toggle checked={emailAlerts} onChange={handleToggleAlerts} />
            </Row>
          </div>
        </SectionCard>

        {/* AI Evaluation Precision */}
        <SectionCard title="AI Evaluation Preferences" icon={Sparkles}>
          <p className="text-sm font-medium mb-3.5" style={{ color: 'var(--text)' }}>ATS Scoring Precision Mode</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'lenient',    label: 'Balanced',             desc: 'Constructive soft scoring with +8% rating boost' },
              { id: 'detailed',   label: 'Strict (Recommended)', desc: 'Standard Fortune 500 enterprise ATS precision'  },
              { id: 'aggressive', label: 'Aggressive',           desc: 'Harsh keyword filtering & strict format penalty' },
            ].map(opt => {
              const isSelected = aiStrictness === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleStrictnessSelect(opt.id)}
                  className="p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                  style={{
                    border: `2px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--blue-light)' : 'var(--surface)',
                    boxShadow: isSelected ? '0 2px 8px rgba(0, 113, 227, 0.15)' : 'none',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{opt.label}</p>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Data Maintenance */}
        <SectionCard title="Data Maintenance" icon={ShieldAlert}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Clear Application Cache</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Reset stored evaluation cache and restore default UI preferences</p>
            </div>
            <button type="button" onClick={handleClearCache} className="btn-danger text-sm">
              <Trash2 className="w-4 h-4" /> Clear Cache
            </button>
          </div>
        </SectionCard>

        {/* Action Bar */}
        <div className="flex items-center justify-end pt-2">
          <button type="submit" className="btn-primary" style={{ padding: '10px 28px', fontSize: '14px' }}>
            <Check className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
