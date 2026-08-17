import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Target, FileText, CheckCircle, XCircle, AlertTriangle,
  Lightbulb, TrendingUp, ArrowLeft, Download,
  Star, Zap, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Sparkles, ArrowRight
} from 'lucide-react';
import { analysisAPI } from '../api/endpoints';
import { Analysis, AiSuggestion, AtsRisk, BulletRewrite } from '../types';
import ScoreGauge from '../components/UI/ScoreGauge';
import ProgressBar from '../components/UI/ProgressBar';
import { safeFormatDate } from '../utils/date';

const priorityColor = (p: string) => {
  if (p === 'High') return 'var(--red-bg) text-red-500 border-red-500/30';
  if (p === 'Medium') return 'var(--orange-bg) text-orange-500 border-orange-500/30';
  return 'var(--green-bg) text-emerald-500 border-emerald-500/30';
};

const AnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const analysisId = searchParams.get('id');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    strengths: true, weaknesses: true, suggestions: true, keywords: false, grammar: false, risks: true, rewrites: true
  });

  useEffect(() => {
    if (!analysisId) {
      analysisAPI.getAll().then(res => {
        const analyses = res.data?.analyses || [];
        if (analyses.length > 0) {
          navigate(`/analysis?id=${analyses[0].id}`, { replace: true });
        } else {
          setError('No analyses found. Please upload and analyze a resume first.');
          setLoading(false);
        }
      }).catch(() => {
        setError('Failed to load analyses.');
        setLoading(false);
      });
      return;
    }

    analysisAPI.getById(parseInt(analysisId)).then(res => {
      setAnalysis(res.data?.analysis || null);
    }).catch(() => {
      setError('Analysis not found.');
    }).finally(() => setLoading(false));
  }, [analysisId, navigate]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer w-64 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 shimmer rounded-2xl" />)}</div>
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <XCircle className="w-16 h-16" style={{ color: 'var(--text-subtle)' }} />
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{error || 'Analysis not found.'}</p>
        <Link to="/upload" className="btn-primary">Upload Resume to Analyze</Link>
      </div>
    );
  }

  let report = analysis.full_report;
  if (typeof report === 'string') {
    try {
      report = JSON.parse(report);
    } catch (e) {
      console.error('Failed to parse full_report JSON:', e);
    }
  }

  if (!report || typeof report !== 'object') {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <AlertTriangle className="w-16 h-16" style={{ color: 'var(--orange)' }} />
        <p style={{ color: 'var(--text-muted)' }}>Analysis report is incomplete. Please try re-analyzing.</p>
        <Link to="/upload" className="btn-primary">Re-analyze</Link>
      </div>
    );
  }

  const sectionScores = report.section_scores || {
    contact_info: { score: report.contact_info_complete ? 90 : 40, status: report.contact_info_complete ? 'Good' : 'Incomplete', feedback: 'Contact details audit' },
    work_experience: { score: report.has_experience ? 80 : 30, status: report.has_experience ? 'Good' : 'Needs Work', feedback: 'Work experience section audit' },
    skills_keywords: { score: (report.keyword_analysis?.present_keywords?.length || 0) * 10, status: 'Audited', feedback: 'Technical keywords density audit' },
    formatting_readability: { score: report.readability_score || 80, status: 'Audited', feedback: 'Formatting scannability audit' },
    education_credentials: { score: report.has_education ? 85 : 40, status: report.has_education ? 'Verified' : 'Unclear', feedback: 'Education section audit' }
  };

  const grade = report.grade || (report.ats_score >= 90 ? 'A+' : report.ats_score >= 80 ? 'A' : report.ats_score >= 70 ? 'B' : report.ats_score >= 60 ? 'C' : 'D');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
              Resume Analysis
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {analysis.resume?.original_name || 'Resume'} - {safeFormatDate(analysis.created_at || (analysis as any).createdAt, 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl text-sm font-bold border" style={{ background: 'var(--blue-light)', color: 'var(--blue)', borderColor: 'var(--border)' }}>
            Grade {grade}
          </span>
          <span className="score-badge score-excellent text-sm">
            <Star className="w-4 h-4 mr-1" />
            {report.overall_rating || 'Good'}
          </span>
          <Link to="/reports" className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Download Report
          </Link>
        </div>
      </div>

      {/* Main Score Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="mac-card p-5 flex flex-col items-center gap-2">
          <ScoreGauge score={Math.round(report.ats_score || analysis.ats_score || 0)} label="ATS Score" size="sm" />
        </div>
        <div className="mac-card p-5 flex flex-col items-center gap-2">
          <ScoreGauge score={Math.round(report.resume_score || analysis.resume_score || 0)} label="Resume Score" size="sm" />
        </div>
        <div className="mac-card p-5 flex flex-col items-center gap-2">
          <ScoreGauge score={Math.round(report.readability_score || analysis.readability_score || 0)} label="Readability" size="sm" />
        </div>
        {report.match_score != null || analysis.match_score != null ? (
          <div className="mac-card p-5 flex flex-col items-center gap-2">
            <ScoreGauge score={Math.round(report.match_score ?? analysis.match_score ?? 0)} label="Job Match" size="sm" />
          </div>
        ) : (
          <div className="mac-card p-5 flex flex-col items-center justify-center gap-2 text-center">
            <Target className="w-8 h-8" style={{ color: 'var(--text-subtle)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add job description for match score</p>
            <Link to="/job-match" className="text-xs font-semibold flex items-center justify-center gap-1" style={{ color: 'var(--blue)' }}>
              Go to Job Match <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Section-by-Section Scoring Breakdown */}
      <div className="mac-card p-6">
        <h2 className="section-header">
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--blue)' }} />
          Section-by-Section Score Breakdown
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[
            { label: 'Contact Info & Socials', data: sectionScores.contact_info },
            { label: 'Work Experience & Impact', data: sectionScores.work_experience },
            { label: 'Skills & Keyword Density', data: sectionScores.skills_keywords },
            { label: 'Formatting & Readability', data: sectionScores.formatting_readability },
            { label: 'Education & Credentials', data: sectionScores.education_credentials },
          ].map(({ label, data }) => {
            const sc = Math.min(Math.max(data?.score || 60, 0), 100);
            return (
              <div key={label} className="p-4 rounded-xl space-y-2" style={{ background: 'var(--blue-light)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>{label}</span>
                  <span className="font-bold" style={{ color: sc >= 80 ? 'var(--green)' : sc >= 60 ? 'var(--orange)' : 'var(--red)' }}>
                    {sc}/100
                  </span>
                </div>
                <ProgressBar value={sc} showValue={false} size="sm" color={sc >= 80 ? 'emerald' : sc >= 60 ? 'yellow' : 'red'} />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{data?.feedback}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ATS Risks */}
      {report.ats_risks && report.ats_risks.length > 0 && (
        <div className="mac-card p-6">
          <button onClick={() => toggleSection('risks')} className="w-full flex items-center justify-between section-header mb-0">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5" style={{ color: 'var(--red)' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>ATS Filter Risks & Impact</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                {report.ats_risks.length}
              </span>
            </div>
            {expandedSections.risks ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />}
          </button>
          {expandedSections.risks && (
            <div className="mt-4 space-y-4">
              {report.ats_risks.map((risk: AtsRisk, idx: number) => (
                <div key={idx} className="p-4 rounded-xl space-y-2" style={{ background: 'var(--red-bg)', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--red)' }}>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {risk.risk}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${priorityColor(risk.severity)}`}>{risk.severity} Risk</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text)' }}>
                    <strong>Why it matters:</strong> {risk.why_it_matters}
                  </p>
                  <p className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--green)' }}>
                    <Zap className="w-3.5 h-3.5 inline-block" /> <strong>Fix action:</strong> {risk.fix_action}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bullet Point Rewrites */}
      {report.bullet_rewrites && report.bullet_rewrites.length > 0 && (
        <div className="mac-card p-6">
          <button onClick={() => toggleSection('rewrites')} className="w-full flex items-center justify-between section-header mb-0">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--blue)' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>Recommended Bullet Point Rewrites</span>
            </div>
            {expandedSections.rewrites ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />}
          </button>
          {expandedSections.rewrites && (
            <div className="mt-4 space-y-4">
              {report.bullet_rewrites.map((rewrite: BulletRewrite, idx: number) => (
                <div key={idx} className="p-4 rounded-xl space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--red-bg)', border: '1px solid rgba(255, 59, 48, 0.2)', color: 'var(--text)' }}>
                    <span className="font-bold flex items-center gap-1 mb-1" style={{ color: 'var(--red)' }}>
                      <XCircle className="w-3.5 h-3.5 inline" /> Before:
                    </span>
                    "{rewrite.before}"
                  </div>
                  <div className="p-3 rounded-lg text-xs font-medium" style={{ background: 'var(--green-bg)', border: '1px solid rgba(52, 199, 89, 0.2)', color: 'var(--text)' }}>
                    <span className="font-bold flex items-center gap-1 mb-1" style={{ color: 'var(--green)' }}>
                      <CheckCircle className="w-3.5 h-3.5 inline" /> ATS Optimized:
                    </span>
                    "{rewrite.after}"
                  </div>
                  <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>Reason: {rewrite.improvement_reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="mac-card p-6">
        <h2 className="section-header">
          <FileText className="w-5 h-5" style={{ color: 'var(--blue)' }} />
          Resume Audit Summary
        </h2>
        <p className="leading-relaxed text-sm" style={{ color: 'var(--text)' }}>{report.summary || 'Summary unavailable.'}</p>

        {/* Quick checks */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          {[
            { key: 'contact_info_complete', label: 'Contact Info', value: report.contact_info_complete },
            { key: 'has_summary', label: 'Summary Section', value: report.has_summary },
            { key: 'has_experience', label: 'Experience Section', value: report.has_experience },
            { key: 'has_education', label: 'Education Section', value: report.has_education },
            { key: 'has_skills_section', label: 'Skills Section', value: report.has_skills_section },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium" style={{ background: value ? 'var(--green-bg)' : 'var(--red-bg)', color: value ? 'var(--green)' : 'var(--red)' }}>
              {value ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="mac-card p-6">
          <button onClick={() => toggleSection('strengths')} className="w-full flex items-center justify-between section-header mb-0">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>Strengths</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
                {report.strengths?.length || 0}
              </span>
            </div>
            {expandedSections.strengths ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />}
          </button>
          {expandedSections.strengths && (
            <ul className="mt-4 space-y-2">
              {(report.strengths || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text)' }}>
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weaknesses */}
        <div className="mac-card p-6">
          <button onClick={() => toggleSection('weaknesses')} className="w-full flex items-center justify-between section-header mb-0">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5" style={{ color: 'var(--red)' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>Weaknesses</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                {report.weaknesses?.length || 0}
              </span>
            </div>
            {expandedSections.weaknesses ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />}
          </button>
          {expandedSections.weaknesses && (
            <ul className="mt-4 space-y-2">
              {(report.weaknesses || []).map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text)' }}>
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--red)' }} />
                  {w}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="mac-card p-6">
        <button onClick={() => toggleSection('suggestions')} className="w-full flex items-center justify-between section-header mb-0">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5" style={{ color: 'var(--orange)' }} />
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>AI Suggestions</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--orange-bg)', color: 'var(--orange)' }}>
              {report.ai_suggestions?.length || 0}
            </span>
          </div>
          {expandedSections.suggestions ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />}
        </button>
        {expandedSections.suggestions && (
          <div className="mt-4 space-y-3">
            {(report.ai_suggestions || []).map((s: AiSuggestion, i: number) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--orange)' }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{s.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${priorityColor(s.priority)}`}>{s.priority}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text)' }}>{s.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keywords */}
      <div className="mac-card p-6">
        <button onClick={() => toggleSection('keywords')} className="w-full flex items-center justify-between section-header mb-0">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--blue)' }} />
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>Keyword Analysis</span>
          </div>
          {expandedSections.keywords ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />}
        </button>
        {expandedSections.keywords && report.keyword_analysis && (
          <div className="mt-4 space-y-5">
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--green)' }}>
                <CheckCircle className="w-4 h-4" /> Present Keywords ({report.keyword_analysis.present_keywords?.length || 0})
              </p>
              <div className="flex flex-wrap gap-2">
                {(report.keyword_analysis.present_keywords || []).slice(0, 25).map((kw: string) => (
                  <span key={kw} className="keyword-pill keyword-present">{kw}</span>
                ))}
              </div>
            </div>
            {(report.keyword_analysis.missing_keywords?.length > 0) && (
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--red)' }}>
                  <XCircle className="w-4 h-4" /> Missing Keywords ({report.keyword_analysis.missing_keywords.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.keyword_analysis.missing_keywords.slice(0, 20).map((kw: string) => (
                    <span key={kw} className="keyword-pill keyword-missing">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Action Verbs Used</p>
              <div className="flex flex-wrap gap-2">
                {(report.keyword_analysis.action_verbs || []).map((kw: string) => (
                  <span key={kw} className="keyword-pill keyword-neutral">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation to other sections */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/job-match" className="mac-card-hover p-5 text-center">
          <Target className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--blue)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Job Description Match</p>
        </Link>
        <Link to="/skill-gap" className="mac-card-hover p-5 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--blue)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Skill Gap Analysis</p>
        </Link>
        <Link to="/reports" className="mac-card-hover p-5 text-center">
          <Download className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--green)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Download Report</p>
        </Link>
      </div>
    </div>
  );
};

export default AnalysisPage;
