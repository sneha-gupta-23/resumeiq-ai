/**
 * vite.config.js — Vite configuration for the React frontend
 *
 * Plugins:
 *  - @vitejs/plugin-react  — Fast Refresh, JSX transform
 *  - @tailwindcss/vite     — Tailwind CSS v4 integration
 *
 * Dev server proxy:
 *  - /api/* requests are forwarded to the Express backend (port 5000)
 *    so we can develop without CORS issues.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
