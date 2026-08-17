import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase, Target, CheckCircle, XCircle,
  Sparkles, RefreshCw, ArrowRight, Zap, Award
} from 'lucide-react';
import { resumeAPI, analysisAPI } from '../api/endpoints';
import { Resume, Analysis } from '../types';
import ScoreGauge from '../components/UI/ScoreGauge';
import toast from 'react-hot-toast';

const JobMatch = () => {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId');

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(initialResumeId || '');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    resumeAPI.getAll().then(res => {
      setResumes(res.data.resumes || []);
      if (!selectedResumeId && res.data.resumes?.length > 0) {
        setSelectedResumeId(res.data.resumes[0].id.toString());
      }
    }).catch(() => {
      toast.error('Failed to load resumes');
    }).finally(() => setLoadingResumes(false));
  }, []);

  useEffect(() => {
    if (selectedResumeId) {
      analysisAPI.getAll().then(res => {
        const matching = res.data.analyses?.find((a: Analysis) => a.resume_id === parseInt(selectedResumeId));
        if (matching) {
          setActiveAnalysis(matching);
          if (matching.job_title) setJobTitle(matching.job_title);
          if (matching.job_description) setJobDescription(matching.job_description);
        } else {
          setActiveAnalysis(null);
        }
      }).catch(() => {});
    }
  }, [selectedResumeId]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await analysisAPI.analyze({
        resumeId: parseInt(selectedResumeId),
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim(),
      });
      setActiveAnalysis(res.data.analysis);
      toast.success('Job Match analysis complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Match analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const report = activeAnalysis?.full_report;
  const matchScore = activeAnalysis?.match_score ?? report?.match_score ?? null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
          <Briefcase className="w-6 h-6" style={{ color: 'var(--blue)' }} />
          Job Description Match
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Compare your resume against a target job posting to get a fit score & missing keyword analysis.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleMatch} className="mac-card p-6 space-y-5">
            <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--blue)' }} />
              Target Match Setup
            </h2>

            {/* Select Resume */}
            <div>
              <label className="form-label">Select Resume</label>
              {loadingResumes ? (
                <div className="h-10 shimmer rounded-xl" />
              ) : resumes.length === 0 ? (
                <div className="p-3.5 rounded-xl text-xs" style={{ background: 'var(--orange-bg)', color: 'var(--orange)', border: '1px solid var(--border)' }}>
                  No resumes uploaded yet. Please upload a resume first.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={e => setSelectedResumeId(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.original_name} ({r.parsed_data?.skills?.length || 0} skills identified)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Target Job Title */}
            <div>
              <label className="form-label">Target Job Title (Optional)</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Developer"
                className="input-field"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="form-label">Job Description *</label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={7}
                placeholder="Paste the full job requirements, responsibilities, and qualifications here..."
                className="input-field resize-none text-xs leading-relaxed"
                required
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {jobDescription.length} characters - Provide detailed responsibilities for optimal accuracy
              </p>
            </div>

            <button
              type="submit"
              disabled={analyzing || resumes.length === 0}
              className="btn-primary w-full py-2.5 text-sm justify-center"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Calculate Match Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          {analyzing ? (
            <div className="mac-card p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-96">
              <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'var(--blue-light)' }}>
                <Sparkles className="w-7 h-7 animate-spin" style={{ color: 'var(--blue)' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>AI Job Matching in Progress</h3>
              <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
                Comparing skills, qualifications, and keyword density against the job description...
              </p>
            </div>
          ) : !activeAnalysis || matchScore == null ? (
            <div className="mac-card p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-96">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--blue-light)' }}>
                <Target className="w-7 h-7" style={{ color: 'var(--blue)' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>No Match Result Yet</h3>
              <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
                Select your resume, paste the target job description on the left, and click "Calculate Match Score" to see your tailored analysis.
              </p>
            </div>
          ) : (
            <>
              {/* Score Header Card */}
              <div className="mac-card p-6 flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge score={Math.round(matchScore)} label="Job Match Score" size="md" />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Award className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                    <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--blue)' }}>Match Assessment</span>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                    {matchScore >= 80 ? 'Exceptional Fit' : matchScore >= 65 ? 'Good Alignment' : matchScore >= 50 ? 'Moderate Fit' : 'Low Alignment'}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {matchScore >= 80
                      ? 'Your resume strongly aligns with the target job posting. High chance of passing ATS screening.'
                      : matchScore >= 65
                      ? 'Good baseline match. Add missing keywords below to significantly boost your score.'
                      : 'Noticeable gap between job requirements and your resume. Tailor your skills and experience section.'}
                  </p>
                </div>
              </div>

              {/* Matched & Missing Keywords */}
              {report?.keyword_analysis && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Matched */}
                  <div className="mac-card p-5">
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: 'var(--green)' }}>
                      <CheckCircle className="w-4 h-4" />
                      Matched Keywords ({report.keyword_analysis.present_keywords?.length || 0})
                    </h3>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                      {(report.keyword_analysis.present_keywords || []).map(kw => (
                        <span key={kw} className="keyword-pill keyword-present text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="mac-card p-5">
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: 'var(--red)' }}>
                      <XCircle className="w-4 h-4" />
                      Missing Keywords ({report.keyword_analysis.missing_keywords?.length || 0})
                    </h3>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                      {(report.keyword_analysis.missing_keywords || []).map(kw => (
                        <span key={kw} className="keyword-pill keyword-missing text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tailored Suggestions */}
              {report?.ai_suggestions && report.ai_suggestions.length > 0 && (
                <div className="mac-card p-6 space-y-4">
                  <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Zap className="w-4 h-4" style={{ color: 'var(--orange)' }} />
                    How to Improve Job Match
                  </h3>
                  <div className="space-y-2.5">
                    {report.ai_suggestions.map((s, i) => (
                      <div key={i} className="p-3.5 rounded-xl flex items-start gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--blue)' }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--blue)' }}>{s.category}</p>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--text)' }}>{s.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatch;
