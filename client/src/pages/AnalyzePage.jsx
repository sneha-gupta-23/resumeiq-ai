/**
 * AnalyzePage.jsx — Resume upload + Job description input
 *
 * Desktop: 2-column grid (Upload left, JD right) with 40px gap
 * Below: Large centered Analyze button
 * Everything inside max-width container.
 *
 * Flow:
 *  1. User uploads PDF + enters JD
 *  2. Click Analyze → setIsLoading(true) → show LoadingSpinner
 *  3. await analyzeResume() → fetch to backend → Gemini AI
 *  4. On success → navigate('/results', { state: { analysis } })
 *  5. On error → toast error message
 *  6. finally → setIsLoading(false) — ALWAYS runs
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') { addToast('Please upload a PDF file', 'error'); return; }
    if (selectedFile.size > 10 * 1024 * 1024) { addToast('File size must be under 10 MB', 'error'); return; }
    setFile(selectedFile);
    addToast(`"${selectedFile.name}" uploaded successfully`, 'success');
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const removeFile = () => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { addToast('Please upload your resume PDF', 'error'); return; }
    if (!jobDescription.trim() || jobDescription.trim().length < 20) { addToast('Please provide a meaningful job description (at least 20 characters)', 'error'); return; }

    console.log('Loading started');
    setIsLoading(true);

    try {
      const result = await analyzeResume(file, jobDescription);

      // Backend returns { success: true, data: { resumeScore, strengths, ... } }
      const analysisData = result?.data || result;

      console.log('Navigating to Results');
      navigate('/results', { state: { analysis: analysisData } });
      addToast('Analysis complete!', 'success');
    } catch (error) {
      console.error('Analysis failed:', error.message);
      addToast(error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      console.log('Loading finished');
      setIsLoading(false);
    }
  };

  const isReady = file && jobDescription.trim().length >= 20;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="section-spacing">
      <div className="container-app">
        {/* Header */}
        <div className="text-center animate-fade-in" style={{ marginBottom: '64px' }}>
          <h1 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '16px' }}>
            Analyze Your <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Upload your resume and paste the job description to get AI-powered insights,
            interview questions, and personalized improvement tips.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 2-column grid, gap 40px */}
          <div className="grid lg:grid-cols-2" style={{ gap: '40px', marginBottom: '48px' }}>

            {/* Upload Card */}
            <div className="card animate-fade-in-up stagger-1" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <span className="text-xl font-bold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                  Upload Resume (PDF)
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                {!file ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
                    style={{
                      border: `2px dashed ${isDragging ? '#3b82f6' : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1')}`,
                      borderRadius: '20px',
                      padding: '48px 32px',
                      minHeight: '280px',
                      background: isDragging ? 'rgba(59,130,246,0.05)' : 'transparent',
                    }}
                  >
                    <div
                      className="rounded-2xl flex items-center justify-center"
                      style={{ width: '72px', height: '72px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', marginBottom: '24px' }}
                    >
                      <svg className="w-9 h-9" style={{ color: isDark ? '#64748b' : '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-lg" style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: '8px' }}>
                      {isDragging ? 'Drop your PDF here' : 'Drag & drop your resume PDF'}
                    </p>
                    <p className="text-muted">or click to browse · PDF only · Max 10 MB</p>
                    <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
                  </div>
                ) : (
                  <div
                    className="flex-1 flex flex-col items-center justify-center text-center"
                    style={{
                      border: `2px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0'}`,
                      borderRadius: '20px',
                      padding: '48px 32px',
                      minHeight: '280px',
                      background: isDark ? 'rgba(16,185,129,0.05)' : '#ecfdf5',
                    }}
                  >
                    <div className="rounded-2xl flex items-center justify-center" style={{ width: '72px', height: '72px', background: 'rgba(16,185,129,0.15)', color: '#10b981', marginBottom: '24px' }}>
                      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-bold text-lg" style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '4px' }}>{file.name}</p>
                    <p className="text-muted" style={{ marginBottom: '24px' }}>{(file.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                    <button type="button" onClick={removeFile} className="btn-outline" style={{ height: '40px', padding: '0 20px', fontSize: '14px', borderRadius: '12px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                      Remove File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description Card */}
            <div className="card animate-fade-in-up stagger-2" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <span className="text-xl font-bold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                  Job Description
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here. Include responsibilities, requirements, qualifications, and any other details from the posting..."
                  className="flex-1 w-full resize-none transition-all duration-200"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    borderRadius: '20px',
                    padding: '24px',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    minHeight: '280px',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <div className="flex items-center justify-between" style={{ marginTop: '12px', padding: '0 4px' }}>
                  <span className="text-muted" style={{ fontSize: '14px' }}>Minimum 20 characters</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: jobDescription.length < 20 ? '#64748b' : '#10b981' }}>
                    {jobDescription.length} chars
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center animate-fade-in-up stagger-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <button type="submit" disabled={!isReady} className="btn btn-primary w-full" style={{ height: '60px', fontSize: '20px', borderRadius: '20px', fontWeight: 800 }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Analyze with AI
            </button>
            <div className="flex items-center justify-center gap-8" style={{ marginTop: '20px' }}>
              <span className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, color: file ? '#10b981' : '#64748b' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: file ? '#10b981' : '#334155', display: 'inline-block' }} />
                Resume ready
              </span>
              <span className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, color: jobDescription.trim().length >= 20 ? '#10b981' : '#64748b' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: jobDescription.trim().length >= 20 ? '#10b981' : '#334155', display: 'inline-block' }} />
                JD ready
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
