/**
 * ResultsPage.jsx — Display AI analysis results
 *
 * Layout matches reference:
 *  - Header with title + action buttons
 *  - Score card (full width)
 *  - 2-column grid: Strengths + Missing Skills
 *  - Full width: Resume Improvements
 *  - 2-column grid: Technical + HR Questions
 *  - Full width: Self Introduction
 *  - Full width: Learning Resources
 *  - 32px gap between all cards
 */

import { useLocation, useNavigate, Link } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import ResultCard from '../components/ResultCard';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isDark } = useTheme();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div className="section-spacing">
        <div className="container-app">
          <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
            <div className="card text-center animate-fade-in" style={{ maxWidth: '480px', padding: '48px 40px' }}>
              <div
                className="rounded-2xl flex items-center justify-center mx-auto"
                style={{ width: '80px', height: '80px', background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', marginBottom: '24px' }}
              >
                <svg className="w-10 h-10" style={{ color: '#64748b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '12px' }}>No Analysis Found</h3>
              <p className="text-muted" style={{ marginBottom: '32px', fontSize: '16px' }}>
                Upload your resume and run an analysis first.
              </p>
              <Link to="/analyze" className="btn btn-primary">
                Go to Analyze
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    addToast('Preparing PDF — your browser print dialog will open.', 'info');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="section-spacing">
      <div className="container-app">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between animate-fade-in" style={{ gap: '24px', marginBottom: '48px' }}>
          <div>
            <h1 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '8px' }}>
              Your Analysis <span className="gradient-text">Results</span>
            </h1>
            <p className="text-muted text-lg">
              Here's how your resume stacks up against the job description.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 no-print w-full md:w-auto">
            <button onClick={handleDownloadPDF} className="btn btn-outline flex-1 md:flex-none" style={{ height: '46px', padding: '0 24px', fontSize: '14px' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </button>
            <button onClick={() => navigate('/analyze')} className="btn btn-primary flex-1 md:flex-none" style={{ height: '46px', padding: '0 24px', fontSize: '14px' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Analyze Again
            </button>
          </div>
        </div>

        {/* Results cards — 32px gap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <ScoreCard score={analysis.resumeScore} />

          {/* 2-col: Strengths + Missing Skills */}
          <div className="grid lg:grid-cols-2" style={{ gap: '32px' }}>
            <ResultCard
              title="Strengths"
              iconColor="#10b981"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
              items={analysis.strengths}
              className="stagger-1"
            />
            <ResultCard
              title="Missing Skills"
              iconColor="#f59e0b"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
              items={analysis.missingSkills}
              className="stagger-2"
            />
          </div>

          {/* Full width: Resume Improvements */}
          <ResultCard
            title="Resume Improvements"
            iconColor="#8b5cf6"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>}
            items={analysis.resumeImprovements}
            className="stagger-3"
          />

          {/* 2-col: Technical + HR Questions */}
          <div className="grid lg:grid-cols-2" style={{ gap: '32px' }}>
            <ResultCard
              title="Technical Questions"
              iconColor="#3b82f6"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>}
              items={analysis.technicalQuestions}
              copyable
              className="stagger-4"
            />
            <ResultCard
              title="HR Questions"
              iconColor="#f59e0b"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}
              items={analysis.hrQuestions}
              copyable
              className="stagger-5"
            />
          </div>

          {/* Full width: Self Introduction */}
          <ResultCard
            title="30-Second Self Introduction"
            iconColor="#06b6d4"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>}
            text={analysis.selfIntroduction}
            copyable
            className="stagger-6"
          />

          {/* Full width: Learning Resources */}
          <ResultCard
            title="Learning Roadmap & Resources"
            iconColor="#ef4444"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>}
            items={analysis.learningResources}
            className="stagger-7"
          />
        </div>
      </div>
    </div>
  );
}
