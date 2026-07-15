/**
 * ResultCard.jsx — Reusable card for results sections
 *
 * Specs: 32px padding, 24px border radius.
 * Renders list items or text block.
 * Colored icon circle + title, Copy All button.
 */

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ResultCard({ title, icon, iconColor = '#3b82f6', items, text, copyable = false, className = '' }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { isDark } = useTheme();

  const handleCopy = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = content;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!items) return;
    handleCopy(items.map((item, i) => `${i + 1}. ${item}`).join('\n'), 'all');
  };

  return (
    <div className={`card opacity-0 animate-fade-in-up ${className}`} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '28px' }}>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <div
            className="rounded-xl flex items-center justify-center shrink-0"
            style={{ width: '44px', height: '44px', background: `${iconColor}20`, color: iconColor }}
          >
            {icon}
          </div>
          <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '22px', lineHeight: '1.3' }}>
            {title}
          </h3>
        </div>

        {copyable && items && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 shrink-0 font-bold transition-colors"
            style={{
              fontSize: '13px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              color: copiedIndex === 'all' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
            }}
          >
            {copiedIndex === 'all' ? '✓ Copied!' : 'Copy All'}
          </button>
        )}
      </div>

      {/* List */}
      {items && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start group"
              style={{ gap: '16px', padding: '12px 0', borderTop: i > 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}` : 'none' }}
            >
              <span
                className="shrink-0 flex items-center justify-center font-bold"
                style={{
                  width: '28px', height: '28px', borderRadius: '8px', fontSize: '13px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                  color: isDark ? '#94a3b8' : '#64748b',
                  marginTop: '2px',
                }}
              >
                {i + 1}
              </span>
              <p className="flex-1" style={{ fontSize: '16px', lineHeight: '1.7', color: isDark ? '#cbd5e1' : '#334155' }}>
                {item}
              </p>
              {copyable && (
                <button
                  onClick={() => handleCopy(item, i)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ padding: '4px', color: copiedIndex === i ? '#10b981' : '#64748b' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {copiedIndex === i ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    )}
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Text block */}
      {text && (
        <div className="flex-1">
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: isDark ? '#cbd5e1' : '#334155', whiteSpace: 'pre-wrap' }}>
            {text}
          </p>
          {copyable && (
            <button
              onClick={() => handleCopy(text, 'text')}
              className="flex items-center gap-2 font-bold transition-colors"
              style={{
                marginTop: '20px', fontSize: '13px', padding: '8px 14px', borderRadius: '10px',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: copiedIndex === 'text' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
              }}
            >
              {copiedIndex === 'text' ? '✓ Copied!' : 'Copy Intro'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
