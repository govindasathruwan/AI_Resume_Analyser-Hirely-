import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BarChart3, CheckCircle, XCircle, AlertTriangle, Lightbulb,
  Cpu, Users, ShieldAlert
} from 'lucide-react';
import { analysisAPI } from '../api/endpoints';
import { Analysis } from '../types';
import ProgressBar from '../components/UI/ProgressBar';
import toast from 'react-hot-toast';

const SkillGap = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analysisAPI.getAll().then(res => {
      const list: Analysis[] = res.data.analyses || [];
      setAnalyses(list);
      if (analysisId) {
        const found = list.find((a: Analysis) => a.id === parseInt(analysisId));
        if (found) setSelectedAnalysis(found);
        else if (list.length > 0) setSelectedAnalysis(list[0]);
      } else if (list.length > 0) {
        setSelectedAnalysis(list[0]);
      }
    }).catch(() => {
      toast.error('Failed to load analysis history');
    }).finally(() => setLoading(false));
  }, [analysisId]);

  const report = selectedAnalysis?.full_report;
  const missingTech = report?.missing_technical_skills || [];
  const missingSoft = report?.missing_soft_skills || [];
  const presentKeywords = report?.keyword_analysis?.present_keywords || [];

  const totalSkillsIdentified = presentKeywords.length + missingTech.length + missingSoft.length;
  const skillCoverageScore = totalSkillsIdentified > 0
    ? Math.round((presentKeywords.length / (presentKeywords.length + missingTech.length + missingSoft.length)) * 100)
    : 70;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
            <BarChart3 className="w-6 h-6" style={{ color: 'var(--blue)' }} />
            Skill Gap Analysis
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Identify technical and soft skill gaps required to maximize interview callback rates.
          </p>
        </div>

        {/* Analysis Selector */}
        {analyses.length > 0 && (
          <div className="w-full sm:w-64">
            <select
              value={selectedAnalysis?.id || ''}
              onChange={e => {
                const found = analyses.find(a => a.id === parseInt(e.target.value));
                if (found) setSelectedAnalysis(found);
              }}
              className="input-field text-sm cursor-pointer"
            >
              {analyses.map(a => (
                <option key={a.id} value={a.id}>
                  {a.resume?.original_name || `Analysis #${a.id}`} ({new Date(a.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-28 shimmer rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 shimmer rounded-2xl" />
            <div className="h-64 shimmer rounded-2xl" />
          </div>
        </div>
      ) : !selectedAnalysis || !report ? (
        <div className="mac-card p-12 text-center space-y-4">
          <ShieldAlert className="w-14 h-14 mx-auto" style={{ color: 'var(--text-subtle)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>No Analysis Selected</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload and analyze your resume first to view skill gap breakdowns.</p>
          <Link to="/upload" className="btn-primary inline-flex">Upload Resume</Link>
        </div>
      ) : (
        <>
          {/* Summary Banner */}
          <div className="mac-card p-6 grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Skill Alignment</span>
              <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{skillCoverageScore}%</p>
              <ProgressBar value={skillCoverageScore} color="blue" size="sm" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Missing Technical Skills</span>
              <p className="text-3xl font-bold" style={{ color: 'var(--red)' }}>{missingTech.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Critical technical keywords to acquire or add</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Missing Soft Skills</span>
              <p className="text-3xl font-bold" style={{ color: 'var(--orange)' }}>{missingSoft.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Interpersonal & leadership competencies</p>
            </div>
          </div>

          {/* Detailed Skill Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Technical Skills Gap */}
            <div className="mac-card p-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Cpu className="w-5 h-5" style={{ color: 'var(--blue)' }} />
                  Technical Skill Gaps
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
                  {missingTech.length} Items
                </span>
              </div>

              {missingTech.length === 0 ? (
                <div className="p-6 text-center rounded-xl" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold text-sm">No critical technical skill gaps detected!</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {missingTech.map(skill => (
                    <div key={skill} className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2.5">
                        <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--red)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{skill}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>Recommended</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Soft Skills Gap */}
            <div className="mac-card p-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Users className="w-5 h-5" style={{ color: 'var(--orange)' }} />
                  Soft Skill Gaps
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: 'var(--orange-bg)', color: 'var(--orange)' }}>
                  {missingSoft.length} Items
                </span>
              </div>

              {missingSoft.length === 0 ? (
                <div className="p-6 text-center rounded-xl" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold text-sm">Excellent soft skills coverage identified!</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {missingSoft.map(skill => (
                    <div key={skill} className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--orange)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{skill}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: 'var(--orange-bg)', color: 'var(--orange)' }}>Add to bullets</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="mac-card p-6 space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Lightbulb className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              Action Plan to Close Skill Gaps
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--blue)' }}>Step 1</span>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Highlight Unused Projects</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  If you already possess missing skills, add them to project descriptions or work experience bullets.
                </p>
              </div>

              <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--blue)' }}>Step 2</span>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Targeted Micro-Certifications</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Complete short courses or certifications for missing tools to list on your resume.
                </p>
              </div>

              <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green)' }}>Step 3</span>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Action Verb Quantification</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Pair soft skills with quantifiable outcomes like "Led team of 4 to deliver 15% efficiency".
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGap;
