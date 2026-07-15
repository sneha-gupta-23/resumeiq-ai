/**
 * Footer.jsx — 4-column footer matching reference design
 *
 * Columns: Brand | Product | Resources | Legal
 * Copyright bar at bottom.
 */

import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  const linkStyle = {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: '15px',
    lineHeight: '2.2',
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const headingStyle = {
    color: isDark ? '#e2e8f0' : '#1e293b',
    fontSize: '15px',
    fontWeight: 700,
    marginBottom: '16px',
  };

  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: isDark ? '#0a0f1e' : '#f1f5f9',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
        padding: '64px 0 32px',
      }}
    >
      <div className="container-app">
        {/* Footer grid */}
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
        >
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4" style={{ textDecoration: 'none' }}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5" />
                </svg>
              </div>
              <span className="font-bold text-[15px]" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                InterviewPrep AI
              </span>
            </Link>
            <p style={{ ...linkStyle, lineHeight: '1.7' }}>
              AI-Powered Interview Preparation
            </p>
          </div>

          {/* Product */}
          <div>
            <p style={headingStyle}>Product</p>
            <div className="flex flex-col">
              <Link to="/" style={linkStyle}>Home</Link>
              <Link to="/analyze" style={linkStyle}>Analyze</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <p style={headingStyle}>Resources</p>
            <div className="flex flex-col">
              <Link to="/analyze" style={linkStyle}>Sample Report</Link>
              <a href="#features" style={linkStyle}>Tips &amp; Guides</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={headingStyle}>Legal</p>
            <div className="flex flex-col">
              <a href="#" style={linkStyle}>Privacy Policy</a>
              <a href="#" style={linkStyle}>Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="border-t mt-12 pt-8 text-center"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
            color: isDark ? '#64748b' : '#94a3b8',
            fontSize: '14px',
          }}
        >
          © {new Date().getFullYear()} InterviewPrep AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
