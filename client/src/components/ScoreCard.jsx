/**
 * ScoreCard.jsx — Resume score with animated circular progress
 * 32px padding, 24px border radius. Matches reference design.
 */

import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ScoreCard({ score }) {
  const [displayScore, setDisplayScore] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    let current = 0;
    const inc = Math.max(1, Math.ceil(score / 80));
    const timer = setInterval(() => {
      current += inc;
      if (current >= score) { current = score; clearInterval(timer); }
      setDisplayScore(current);
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const getColors = () => {
    if (score >= 71) return { ring: '#10b981', label: 'Excellent Match', bg: 'rgba(16,185,129,0.1)', gradient: 'linear-gradient(90deg, #10b981, #34d399)' };
    if (score >= 41) return { ring: '#f59e0b', label: 'Good Potential', bg: 'rgba(245,158,11,0.1)', gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)' };
    return { ring: '#ef4444', label: 'Needs Improvement', bg: 'rgba(239,68,68,0.1)', gradient: 'linear-gradient(90deg, #ef4444, #f87171)' };
  };

  const c = getColors();
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="card animate-bounce-in" style={{ padding: '40px 32px' }}>
      <div className="flex flex-col sm:flex-row items-center" style={{ gap: '48px' }}>
        {/* Circle */}
        <div className="relative shrink-0" style={{ width: '160px', height: '160px' }}>
          <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round" stroke={c.ring}
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - displayScore / 100)}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontSize: '48px', fontWeight: 900, color: c.ring, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {displayScore}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginTop: '4px' }}>/ 100</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 text-center sm:text-left" style={{ minWidth: 0 }}>
          <h2 style={{ color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '16px', fontSize: '32px' }}>
            Resume Score
          </h2>
          <div
            className="inline-flex items-center gap-2 rounded-full font-bold"
            style={{ background: c.bg, color: c.ring, fontSize: '14px', padding: '8px 16px', marginBottom: '24px' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.ring, display: 'inline-block' }} />
            {c.label}
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: '12px', background: isDark ? '#1e293b' : '#e2e8f0', marginBottom: '20px' }}>
            <div className="h-full rounded-full animate-progress-fill" style={{ width: `${score}%`, background: c.gradient }} />
          </div>
          <p className="text-muted" style={{ fontSize: '16px', lineHeight: '1.7' }}>
            Your resume matches <strong style={{ color: c.ring, fontWeight: 700 }}>{score}%</strong> of the job requirements.
            Review the insights below to improve your chances.
          </p>
        </div>
      </div>
    </div>
  );
}
