import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon, FileText, Search, Filter, Trash2,
  Eye, RefreshCw, Calendar, Sparkles
} from 'lucide-react';
import { analysisAPI } from '../api/endpoints';
import { Analysis } from '../types';
import toast from 'react-hot-toast';
import { safeFormatDate } from '../utils/date';

const scoreStyle = (score: number) => {
  if (score >= 80) return { bg: 'rgba(52,199,89,0.10)',  color: '#1a9c3c', border: 'rgba(52,199,89,0.22)'  };
  if (score >= 60) return { bg: 'rgba(0,113,227,0.09)',  color: '#0071e3', border: 'rgba(0,113,227,0.20)'  };
  if (score >= 40) return { bg: 'rgba(255,149,0,0.10)',  color: '#b36a00', border: 'rgba(255,149,0,0.22)'  };
  return              { bg: 'rgba(255,59,48,0.09)',   color: '#cc2e25', border: 'rgba(255,59,48,0.20)'  };
};

const History = () => {
  const [analyses, setAnalyses]     = useState<Analysis[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    analysisAPI.getAll()
      .then(res => setAnalyses(res.data?.analyses || []))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await analysisAPI.delete(id);
      toast.success('Deleted');
      setAnalyses(prev => prev.filter(a => a.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = analyses.filter(item => {
    const fname = item.resume?.original_name?.toLowerCase() || '';
    const jtitle = item.job_title?.toLowerCase() || '';
    const matchSearch = fname.includes(searchQuery.toLowerCase()) || jtitle.includes(searchQuery.toLowerCase());
    const matchRating = ratingFilter === 'all' || item.full_report?.overall_rating?.toLowerCase() === ratingFilter.toLowerCase();
    return matchSearch && matchRating;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.5px' }}>
            <HistoryIcon className="w-6 h-6" style={{ color: 'var(--blue)' }} />
            Analysis History
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Review past evaluations and track score improvements
          </p>
        </div>
        <Link to="/upload" className="btn-primary self-start sm:self-auto">
          <Sparkles className="w-4 h-4" /> New Analysis
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="mac-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
          <input
            type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by filename or job title…"
            className="input-field text-sm"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-subtle)' }} />
          <select
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
            className="input-field text-sm cursor-pointer w-full sm:w-44"
          >
            <option value="all">All Ratings</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Below Average">Below Average</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 shimmer rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mac-card p-12 text-center space-y-4">
          <FileText className="w-12 h-12 mx-auto" style={{ color: 'var(--text-subtle)' }} />
          <h2 className="text-xl font-semibold">No Analyses Found</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {searchQuery || ratingFilter !== 'all'
              ? 'No results match your filters.'
              : 'You haven\'t analysed any resumes yet.'}
          </p>
          <Link to="/upload" className="btn-primary inline-flex">Upload First Resume</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const score = Math.round(item.full_report?.ats_score || item.ats_score || 0);
            const ss    = scoreStyle(score);
            return (
              <div
                key={item.id}
                className="mac-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-mac-lg"
              >
                {/* Left */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--blue-light)' }}>
                    <FileText className="w-5 h-5" style={{ color: 'var(--blue)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)', fontSize: 14 }}>
                      {item.resume?.original_name || 'Resume'}
                      {item.job_title && (
                        <span className="text-xs font-normal px-2 py-0.5 rounded"
                          style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
                          {item.job_title}
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {safeFormatDate(item.created_at || (item as any).createdAt, 'MMM dd, yyyy')}
                      <span>·</span>
                      <span>{item.full_report?.overall_rating || 'Evaluated'}</span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0"
                  style={{ borderTop: '1px solid transparent' }}>
                  <div className="px-3 py-1.5 rounded-xl border text-sm font-semibold"
                    style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}>
                    ATS {score}/100
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link to={`/analysis?id=${item.id}`} className="btn-secondary p-2" title="View Report">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link to={`/job-match?resumeId=${item.resume_id}`} className="btn-secondary p-2" title="Job Match">
                      <RefreshCw className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger p-2" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
