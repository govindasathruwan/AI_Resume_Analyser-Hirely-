import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Trash2, CheckCircle, Clock,
  Brain, AlertCircle, Sparkles, X, CloudUpload, ArrowRight
} from 'lucide-react';
import { resumeAPI, analysisAPI } from '../api/endpoints';
import { Resume } from '../types';
import toast from 'react-hot-toast';
import { safeFormatDate } from '../utils/date';

const UploadResume = () => {
  const navigate = useNavigate();
  const [resumes, setResumes]               = useState<Resume[]>([]);
  const [uploadedFile, setUploadedFile]     = useState<File | null>(null);
  const [uploading, setUploading]           = useState(false);
  const [analyzing, setAnalyzing]           = useState(false);
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [includeJD, setIncludeJD]           = useState(false);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    resumeAPI.getAll()
      .then(res => setResumes(res.data.resumes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setUploadedResume(null);
    } else {
      toast.error('Please upload a PDF file only.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const uploadSelectedFile = async (): Promise<Resume | null> => {
    if (!uploadedFile) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', uploadedFile);
      const res    = await resumeAPI.upload(formData);
      const resume = res.data.resume;
      setUploadedResume(resume);
      setResumes(prev => [resume, ...prev]);
      toast.success('Resume uploaded!');
      return resume;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    let target = uploadedResume;
    if (!target && uploadedFile) target = await uploadSelectedFile();
    if (!target && resumes.length > 0) target = resumes[0];
    if (!target) {
      toast.error('Please select or upload a PDF resume first.');
      setAnalyzing(false);
      return;
    }
    try {
      const res = await analysisAPI.create({
        resume_id: target.id,
        job_description: includeJD && jobDescription ? jobDescription : undefined,
      });
      toast.success('Analysis complete');
      navigate(`/analysis?id=${res.data.analysis.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await resumeAPI.delete(id);
      setResumes(prev => prev.filter(r => r.id !== id));
      toast.success('Resume deleted.');
    } catch {
      toast.error('Failed to delete resume.');
    }
  };

  const analyzeExisting = async (resume: Resume) => {
    setAnalyzing(true);
    try {
      const strictness = localStorage.getItem('hirely_ai_strictness') || 'detailed';
      const res = await analysisAPI.create({
        resume_id: resume.id,
        job_description: includeJD && jobDescription ? jobDescription : undefined,
        strictness,
      });
      toast.success('Analysis complete');
      navigate(`/analysis?id=${res.data.analysis.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const canAnalyze = Boolean(uploadedFile || uploadedResume || resumes.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>Upload Resume</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Upload your PDF and get an AI-powered ATS analysis in seconds
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left - upload + options */}
        <div className="lg:col-span-2 space-y-5">
          {/* Drop zone */}
          <div className="mac-card p-5">
            <h3 className="section-header">
              <CloudUpload className="w-4 h-4" style={{ color: 'var(--blue)' }} />
              Upload PDF Resume
            </h3>

            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
                style={{
                  borderColor: isDragActive ? 'var(--blue)' : 'var(--border-strong)',
                  background: isDragActive ? 'var(--blue-light)' : 'var(--surface)',
                  transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                <input {...getInputProps()} id="resume-file-input" />
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                    style={{ background: 'var(--blue-light)' }}
                  >
                    <Upload className="w-7 h-7" style={{ color: 'var(--blue)' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text)' }}>
                      {isDragActive ? 'Drop your PDF here!' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      or click to browse - PDF only - Max 10 MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="p-4 rounded-xl flex items-center gap-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--red-bg)' }}>
                  <FileText className="w-5 h-5" style={{ color: 'var(--red)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--text)' }}>{uploadedFile.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  onClick={() => { setUploadedFile(null); setUploadedResume(null); }}
                  className="btn-ghost p-1.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {uploadedFile && !uploadedResume && (
              <button
                id="upload-resume-btn"
                onClick={() => uploadSelectedFile()}
                disabled={uploading}
                className="btn-secondary w-full justify-center mt-3 text-sm"
              >
                {uploading
                  ? <><div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />Uploading...</>
                  : <><Upload className="w-4 h-4" />Save to Account</>}
              </button>
            )}

            {uploadedResume && (
              <div
                className="flex items-center gap-2.5 mt-3 p-3 rounded-xl"
                style={{ background: 'var(--green-bg)', border: '1px solid rgba(52,199,89,0.3)' }}
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--green)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--green)' }}>
                  Saved! Click "Analyse with AI" below.
                </span>
              </div>
            )}
          </div>

          {/* Job Description toggle */}
          <div className="mac-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-header mb-0">
                <Brain className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                Job Description
                <span className="text-xs font-normal ml-1.5" style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </h3>
              {/* Toggle */}
              <button
                onClick={() => setIncludeJD(!includeJD)}
                style={{
                  width: 44, height: 26, borderRadius: 999,
                  background: includeJD ? 'var(--blue)' : 'var(--border-strong)',
                  border: 'none', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', padding: '0 3px',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transform: includeJD ? 'translateX(18px)' : 'translateX(0)',
                  transition: 'transform 0.2s',
                }} />
              </button>
            </div>
            {includeJD ? (
              <textarea
                id="job-description-input"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get a detailed match analysis and missing keywords..."
                rows={5}
                className="input-field"
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Toggle on to compare your resume against a specific job description and get match %, missing keywords, and targeted recommendations.
              </p>
            )}
          </div>

          {/* Analyse button */}
          <button
            id="analyze-btn"
            onClick={handleAnalyze}
            disabled={analyzing || uploading || !canAnalyze}
            className="btn-primary w-full justify-center"
            style={{ padding: '12px 20px', fontSize: '15px' }}
          >
            {analyzing || uploading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {uploading ? 'Uploading PDF...' : 'AI is analysing...'}</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analyse with AI</>
            )}
          </button>
        </div>

        {/* Right - history */}
        <div className="mac-card p-5 h-fit">
          <h3 className="section-header">
            <Clock className="w-4 h-4" style={{ color: 'var(--blue)' }} />
            Version History
          </h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-14 shimmer rounded-xl" />)}
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-9 h-9 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No resumes yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {resumes.map(resume => (
                <div
                  key={resume.id}
                  className="p-3 rounded-xl group"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--red-bg)' }}>
                      <FileText className="w-4 h-4" style={{ color: 'var(--red)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {resume.original_name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        v{resume.version} - {safeFormatDate(resume.created_at || (resume as any).createdAt, 'MMM dd')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: 'var(--red)', background: 'var(--red-bg)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => analyzeExisting(resume)}
                    disabled={analyzing}
                    className="mt-2 w-full text-xs py-1.5 px-3 rounded-lg font-medium transition-all"
                    style={{
                      background: 'var(--blue-light)', color: 'var(--blue)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    Re-analyse <ArrowRight className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mac-card p-5" style={{ background: 'var(--blue-light)' }}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <AlertCircle className="w-4 h-4" style={{ color: 'var(--blue)' }} />
          Tips for Best Results
        </h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          {[
            'Use a text-based PDF (not a scanned image) for best text extraction',
            'Include a job description for targeted keyword analysis and match score',
            'Upload multiple versions to track your improvement over time',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
