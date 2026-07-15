/**
 * Toast.jsx — Toast notification system
 * Updated for dark-first design system.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const ToastContext = createContext();

let toastId = 0;

function ToastContainer({ toasts, removeToast }) {
  const { isDark } = useTheme();

  const getStyle = (type) => {
    const base = {
      borderRadius: '14px',
      padding: '14px 18px',
      border: '1px solid',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      pointerEvents: 'auto',
      backdropFilter: 'blur(12px)',
    };
    if (type === 'success') return { ...base, background: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5', borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0' };
    if (type === 'error') return { ...base, background: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2', borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#fecaca' };
    return { ...base, background: isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff', borderColor: isDark ? 'rgba(59,130,246,0.3)' : '#bfdbfe' };
  };

  const getTextColor = (type) => {
    if (type === 'success') return isDark ? '#6ee7b7' : '#065f46';
    if (type === 'error') return isDark ? '#fca5a5' : '#991b1b';
    return isDark ? '#93c5fd' : '#1e40af';
  };

  const getIconColor = (type) => {
    if (type === 'success') return '#10b981';
    if (type === 'error') return '#ef4444';
    return '#3b82f6';
  };

  return (
    <div style={{ position: 'fixed', top: '96px', right: '16px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', width: '100%', pointerEvents: 'none' }}>
      {toasts.map((toast) => (
        <div key={toast.id} className="animate-slide-in-right" style={getStyle(toast.type)}>
          <span style={{ color: getIconColor(toast.type), marginTop: '2px', flexShrink: 0 }}>
            {toast.type === 'success' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {toast.type === 'error' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>}
            {toast.type === 'info' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>}
          </span>
          <p style={{ fontSize: '14px', fontWeight: 600, flex: 1, color: getTextColor(toast.type) }}>{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} style={{ color: '#64748b', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
