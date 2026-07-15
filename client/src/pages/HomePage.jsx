/**
 * HomePage.jsx — Landing page rebuilt from scratch
 *
 * Matches the reference design exactly:
 *  - Hero: ~70vh, radial gradient, badge, large heading, two CTA buttons
 *  - Features: 4 cards in CSS grid with colored icon squares
 *  - How It Works: 3 steps with numbered circles, icons, descriptions
 *  - 96px spacing between every section
 */

import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Resume Scoring',
    desc: 'Get an instant AI-powered score showing how well your resume matches the job requirements.',
  },
  {
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Smart Analysis',
    desc: 'Identify your strengths, skill gaps, and get personalized improvement suggestions.',
  },
  {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Interview Questions',
    desc: 'Get tailored technical and HR questions to help you prepare for your specific role.',
  },
  {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Learning Roadmap',
    desc: 'Discover exactly what topics and technologies you should study to fill the gaps.',
  },
];

const steps = [
  {
    num: '01',
    color: '#10b981',
    title: 'Upload Resume',
    desc: 'Upload your resume as a PDF file. Our system will extract and analyze the content.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: '02',
    color: '#3b82f6',
    title: 'Paste Job Description',
    desc: "Copy the job posting you're targeting and paste it in. The more details, the better.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
    ),
  },
  {
    num: '03',
    color: '#f59e0b',
    title: 'Get AI Analysis',
    desc: 'Receive a comprehensive breakdown including score, questions, and roadmap.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero-gradient relative overflow-hidden" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        {/* Floating blur effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full animate-float" style={{ background: 'rgba(59,130,246,0.08)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full animate-float" style={{ background: 'rgba(16,185,129,0.06)', filter: 'blur(80px)', animationDelay: '2s' }} />
        </div>

        <div className="container-app relative z-10 w-full py-20 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-10 animate-fade-in"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: isDark ? '#94a3b8' : 'rgba(255,255,255,0.9)',
              }}
            >
              <span className="text-lg">✦</span>
              Powered by Google Gemini AI
            </div>

            {/* Heading */}
            <h1 className="animate-fade-in-up" style={{ color: isDark ? '#ffffff' : '#ffffff', marginBottom: '32px' }}>
              Ace Your Next{' '}
              <span className="gradient-text">Interview</span>
            </h1>

            {/* Subtext */}
            <p
              className="text-lg sm:text-xl leading-relaxed mb-12 animate-fade-in-up stagger-2 font-medium max-w-2xl mx-auto"
              style={{ color: isDark ? '#94a3b8' : 'rgba(255,255,255,0.8)' }}
            >
              Upload your resume, paste a job description, and let AI analyze your fit.
              Get personalized feedback, interview questions, and a roadmap to success.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <Link to="/analyze" className="btn btn-primary w-full sm:w-auto">
                Analyze Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link to="/analyze" className="btn btn-outline w-full sm:w-auto">
                View Sample Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section style={{ marginTop: '100px', marginBottom: '100px' }}>
        <div className="container-app">
        <div className="text-center" style={{ marginBottom: '64px' }}>
          <h2 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '16px' }}>
            Everything You Need to <span className="gradient-text">Prepare</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Comprehensive AI-powered insights to boost your interview performance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column' }}
            >
              {/* Icon */}
              <div
                className="rounded-2xl flex items-center justify-center shrink-0"
                style={{ width: '56px', height: '56px', background: f.bg, color: f.color, marginBottom: '24px' }}
              >
                {f.icon}
              </div>
              <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '12px', fontSize: '22px' }}>
                {f.title}
              </h3>
              <p className="text-muted flex-1" style={{ fontSize: '16px', lineHeight: '1.7' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* 100px gap before How It Works */}

      {/* ============ HOW IT WORKS ============ */}
      <section style={{ marginTop: '100px', marginBottom: '100px' }}>
        <div className="container-app">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '16px' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted text-lg">Three simple steps to interview readiness</p>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: '48px', maxWidth: '960px', margin: '0 auto' }}>
            {steps.map((s, i) => (
              <div key={i} className="text-center flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                {/* Number circle */}
                <div
                  className="rounded-full flex items-center justify-center font-black text-white text-lg"
                  style={{ width: '52px', height: '52px', background: s.color, marginBottom: '24px', boxShadow: `0 0 20px ${s.color}40` }}
                >
                  {s.num}
                </div>

                {/* Icon */}
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{ width: '72px', height: '72px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '24px' }}
                >
                  {s.icon}
                </div>

                <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '12px', fontSize: '22px' }}>{s.title}</h3>
                <p className="text-muted" style={{ fontSize: '16px', lineHeight: '1.7', maxWidth: '280px' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
