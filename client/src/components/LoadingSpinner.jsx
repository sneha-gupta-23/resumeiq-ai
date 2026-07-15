/**
 * LoadingSpinner.jsx — Full-page loading overlay
 * Matches the dark theme design system.
 */

import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const STEPS = [
  'Extracting text from your resume...',
  'Analyzing skills and experience...',
  'Comparing with job requirements...',
  'Generating interview questions...',
  'Preparing your personalized report...',
];

export default function LoadingSpinner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setInterval(() => setStepIndex((p) => (p + 1) % STEPS.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 90 ? p + 0.1 : p >= 70 ? p + 0.5 : p + 1.5));
    }, 100);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: isDark ? 'rgba(11,17,33,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)' }}
    >
      <div className="w-full max-w-md mx-auto px-8 animate-fade-in">
        <div className="flex flex-col items-center gap-8">
          {/* Spinner */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full" style={{ border: `4px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }} />
            <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ border: '4px solid transparent', borderTopColor: '#10b981' }} />
            <div className="absolute inset-2 rounded-full animate-spin-slow" style={{ border: '4px solid transparent', borderTopColor: '#3b82f6', animationDirection: 'reverse', animationDuration: '0.9s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold animate-pulse-soft" style={{ color: isDark ? '#e2e8f0' : '#1e293b', minHeight: '28px' }}>
              {STEPS[stepIndex]}
            </p>
            <p className="text-muted text-sm" style={{ marginTop: '8px' }}>This usually takes 30–60 seconds</p>
          </div>

          <div className="w-full">
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: isDark ? '#1e293b' : '#e2e8f0' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 95)}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}
              />
            </div>
            <p className="text-muted text-xs text-center" style={{ marginTop: '8px' }}>
              {Math.min(Math.round(progress), 95)}% complete
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="w-full space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card" style={{ padding: '20px', borderRadius: '16px' }}>
                <div className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
                  <div className="skeleton h-4 rounded-lg" style={{ width: '120px' }} />
                </div>
                <div className="space-y-2" style={{ marginTop: '12px' }}>
                  <div className="skeleton h-3 w-full rounded-lg" />
                  <div className="skeleton h-3 rounded-lg" style={{ width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
