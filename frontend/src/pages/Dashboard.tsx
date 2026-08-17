import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, FileText, TrendingUp, Target, ArrowRight,
  Clock, BarChart3, CheckCircle, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analysisAPI, resumeAPI } from '../api/endpoints';
import { Analysis, Resume, Stats } from '../types';
import ScoreGauge from '../components/UI/ScoreGauge';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { safeFormatDate } from '../utils/date';

const Dashboard = () => {
  const { user }                            = useAuth();
  const navigate                            = useNavigate();
  const [stats, setStats]                   = useState<Stats | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [resumes, setResumes]               = useState<Resume[]>([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analysesRes, resumesRes] = await Promise.all([
          analysisAPI.getStats(),
          analysisAPI.getAll(),
          resumeAPI.getAll(),
        ]);
        setStats(statsRes.data?.stats || null);
        setRecentAnalyses((analysesRes.data?.analyses || []).slice(0, 5));
        setResumes(resumesRes.data?.resumes || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scoreCards = stats ? [
    { label: 'ATS Score',      value: stats.latestAtsScore    || 0, icon: Target,    raw: false },
    { label: 'Resume Score',   value: stats.latestResumeScore || 0, icon: FileText,  raw: false },
    { label: 'Analyses',       value: stats.totalAnalyses     || 0, icon: BarChart3, raw: true  },
    { label: 'Avg ATS Score',  value: stats.avgAtsScore       || 0, icon: TrendingUp,raw: false },
  ] : [];

  const trendData = stats?.trend?.map(t => ({
    date: safeFormatDate(t.date, 'MM/dd'),
    'ATS Score':    Math.round(t.ats_score    || 0),
    'Resume Score': Math.round(t.resume_score || 0),
  })) || [];

  const scoreColor = (v: number) =>
    v >= 70 ? 'var(--green)' : v >= 50 ? 'var(--orange)' : 'var(--red)';

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-6 rounded-lg w-48 shimmer" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
        </div>
        <div className="h-56 rounded-2xl shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ letterSpacing: '-0.5px', color: 'var(--text)' }}>
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Here is your resume performance overview
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Plus className="w-4 h-4" />
          Analyse Resume
        </Link>
      </div>

      {/* Score Cards */}
      {stats && stats.totalAnalyses > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreCards.map(({ label, value, icon: Icon, raw }) => (
            <div key={label} className="mac-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--blue-light)' }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: 'var(--blue)', width: 18, height: 18 }} />
                </div>
                {!raw && (
                  <span className={`score-badge ${value >= 70 ? 'score-excellent' : value >= 50 ? 'score-average' : 'score-poor'}`}>
                    {value >= 70 ? 'Good' : value >= 50 ? 'Fair' : 'Low'}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold mb-0.5" style={{ color: 'var(--text)', letterSpacing: '-1px' }}>
                {value}{!raw && '%'}
              </div>
              <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{label}</div>
              {!raw && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${value}%`, background: scoreColor(value) }} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="mac-card p-12 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--blue-light)' }}
          >
            <Upload className="w-8 h-8" style={{ color: 'var(--blue)' }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Upload your first resume</h2>
          <p className="text-sm max-w-xs mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
            Get your ATS score, skill gap analysis, and actionable improvements in under 60 seconds.
          </p>
          <Link to="/upload" className="btn-primary">
            <Upload className="w-4 h-4" />
            Upload Resume
          </Link>
        </div>
      )}

      {/* Trend Chart + Gauges */}
      {trendData.length > 1 && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="mac-card p-5 lg:col-span-2">
            <h3 className="section-header">
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--blue)' }} />
              Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="atsGrad"    x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--blue)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="resumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--green)" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-subtle)" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="var(--text-subtle)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: 12, color: 'var(--text)' }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                />
                <Area type="monotone" dataKey="ATS Score"    stroke="var(--blue)" strokeWidth={2} fill="url(#atsGrad)"    />
                <Area type="monotone" dataKey="Resume Score" stroke="var(--green)" strokeWidth={2} fill="url(#resumeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {stats && (
            <div className="mac-card p-5">
              <h3 className="section-header">
                <Target className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                Latest Scores
              </h3>
              <div className="flex flex-col items-center gap-5">
                <ScoreGauge score={stats.latestAtsScore    || 0} label="ATS Score"    size="md" />
                <ScoreGauge score={stats.latestResumeScore || 0} label="Resume Score" size="sm" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Analyses + My Resumes */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="mac-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-header mb-0">
              <Clock className="w-4 h-4" style={{ color: 'var(--blue)' }} />
              Recent Analyses
            </h3>
            <Link to="/history" className="text-xs font-medium" style={{ color: 'var(--blue)' }}>
              View all
            </Link>
          </div>
          {recentAnalyses.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
              No analyses yet. Upload your resume to get started.
            </p>
          ) : (
            <div className="space-y-1">
              {recentAnalyses.map(a => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/analysis?id=${a.id}`)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-light)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: a.ats_score >= 70 ? 'var(--green-bg)' : a.ats_score >= 50 ? 'var(--orange-bg)' : 'var(--red-bg)',
                      color:      a.ats_score >= 70 ? 'var(--green)'    : a.ats_score >= 50 ? 'var(--orange)'    : 'var(--red)',
                    }}
                  >
                    {Math.round(a.ats_score || 0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                      {a.resume?.original_name || 'Resume'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {safeFormatDate(a.created_at || (a as any).createdAt, 'MMM dd, yyyy')}
                      {a.match_score != null && ` - ${Math.round(a.match_score)}% match`}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-subtle)' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mac-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-header mb-0">
              <FileText className="w-4 h-4" style={{ color: 'var(--blue)' }} />
              My Resumes
            </h3>
            <Link to="/upload" className="text-xs font-medium" style={{ color: 'var(--blue)' }}>
              + Upload new
            </Link>
          </div>
          {resumes.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
              No resumes uploaded yet.
            </p>
          ) : (
            <div className="space-y-1">
              {resumes.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: 'transparent' }}>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--blue-light)' }}
                  >
                    <FileText className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{r.original_name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      v{r.version} - {safeFormatDate(r.created_at || (r as any).createdAt, 'MMM dd, yyyy')}
                      {r.file_size && ` - ${(r.file_size / 1024).toFixed(0)} KB`}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--green)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/upload',    icon: Upload,    label: 'Upload Resume'    },
          { to: '/job-match', icon: Target,    label: 'Match Job'        },
          { to: '/skill-gap', icon: BarChart3, label: 'Skill Gap'        },
          { to: '/reports',   icon: FileText,  label: 'Download Report'  },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="mac-card-hover p-5 flex flex-col items-center gap-3 text-center transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--blue-light)' }}
            >
              <Icon className="w-5 h-5" style={{ color: 'var(--blue)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
