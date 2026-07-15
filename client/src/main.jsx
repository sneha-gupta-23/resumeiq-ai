/**
 * main.jsx — Application entry point
 *
 * Renders the App component into the root DOM node.
 * Imports the global CSS with Tailwind and design tokens.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
