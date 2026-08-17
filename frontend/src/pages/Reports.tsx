import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download, FileText, Printer, CheckCircle, Star, Sparkles,
  RefreshCw, ShieldCheck, AlertCircle
} from 'lucide-react';
import { analysisAPI, reportAPI } from '../api/endpoints';
import { Analysis } from '../types';
import toast from 'react-hot-toast';

const Reports = () => {
  const [searchParams] = useSearchParams();
  const initialId      = searchParams.get('id');
  const [analyses, setAnalyses]     = useState<Analysis[]>([]);
  const [selectedId, setSelectedId] = useState<string>(initialId || '');
  const [loading, setLoading]       = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    analysisAPI.getAll()
      .then(res => {
        const list = res.data.analyses || [];
        setAnalyses(list);
        if (!selectedId && list.length > 0) setSelectedId(list[0].id.toString());
      })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const active = analyses.find(a => a.id === parseInt(selectedId));
  const report = active?.full_report;

  const handleDownload = async () => {
    if (!selectedId) return;
    setDownloading(true);
    try {
      const res  = await reportAPI.downloadPdf(parseInt(selectedId));
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_ATS_Report_${selectedId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF report downloaded successfully');
    } catch {
      toast.error('Failed to generate PDF.');
    } finally { setDownloading(false); }
  };

  const scoreBoxes = report ? [
    { label: 'ATS Score',      value: `${Math.round(report.ats_score        || 0)}/100` },
    { label: 'Resume Quality', value: `${Math.round(report.resume_score     || 0)}/100` },
    { label: 'Readability',    value: `${Math.round(report.readability_score || 0)}/100` },
    { label: 'Experience',     value: `${report.estimated_experience_years  || 0} yrs`  },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>
            <Download className="w-6 h-6" style={{ color: 'var(--blue)' }} />
            Export Evaluation Report
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Export comprehensive ATS reports as PDF for archiving, sharing, or offline review.
          </p>
        </div>
        {analyses.length > 0 && (
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="input-field text-sm cursor-pointer w-full sm:w-64"
          >
            {analyses.map(a => (
              <option key={a.id} value={a.id}>
                Report #{a.id} - {a.resume?.original_name || 'Resume'}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="h-56 shimmer rounded-2xl" />
      ) : !active || !report ? (
        <div className="mac-card p-12 text-center space-y-4">
          <FileText className="w-12 h-12 mx-auto" style={{ color: 'var(--text-subtle)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>No Reports Available</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Upload and evaluate your resume to unlock export options.
          </p>
        </div>
      ) : (
        <>
          {/* Action Bar */}
          <div className="mac-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--green-bg)' }}>
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--green)' }} />
              </div>
              <div>
                <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{active.resume?.original_name}</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Generated on {new Date(active.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button onClick={() => window.print()} className="btn-secondary flex-1 sm:flex-initial justify-center">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary flex-1 sm:flex-initial justify-center"
              >
                {downloading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating PDF...</>
                  : <><Download className="w-4 h-4" />Download PDF</>}
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="mac-card p-7 space-y-7 print:bg-white print:text-black">
            {/* Header */}
            <div className="flex items-start justify-between pb-5"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--blue)' }}>
                    ATS Diagnostic Report
                  </span>
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.3px' }}>
                  AI Resume Compatibility Audit
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Candidate: {active.resume?.original_name}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Overall Rating</span>
                <p className="text-lg font-bold" style={{ color: 'var(--green)' }}>{report.overall_rating}</p>
              </div>
            </div>

            {/* Score grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {scoreBoxes.map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl text-center"
                  style={{ background: 'var(--blue-light)', border: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--blue)', letterSpacing: '-0.5px' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Executive Summary
              </h3>
              <p className="text-sm leading-relaxed p-4 rounded-xl"
                style={{ color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {report.summary}
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--green)' }}>
                  <CheckCircle className="w-4 h-4" /> Core Strengths
                </h3>
                <ul className="space-y-2">
                  {(report.strengths || []).map((s: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                      <CheckCircle className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: 'var(--green)' }} />
                      <span style={{ color: 'var(--text)' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--red)' }}>
                  <AlertCircle className="w-4 h-4" /> Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {(report.weaknesses || []).map((w: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                      <AlertCircle className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: 'var(--red)' }} />
                      <span style={{ color: 'var(--text)' }}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
