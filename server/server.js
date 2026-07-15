/**
 * server.js — Entry point for the AI Interview Prep Assistant API
 *
 * Responsibilities:
 *  1. Load environment variables from .env
 *  2. Configure Express with CORS and JSON body parsing
 *  3. Mount the /api/analyze route
 *  4. Attach the global error-handling middleware
 *  5. Start the HTTP server
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analyzeRoutes from './src/routes/analyzeRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------

app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.originalUrl}`);
  next();
});

// Allow requests from the Vite dev server (port 5173) and any deployed frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  })
);

// Parse JSON request bodies (for non-multipart routes if needed later)
app.use(express.json());

// --------------- Routes ---------------

// Health-check endpoint (useful for Render deploy monitoring)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume analysis routes
app.use('/api', analyzeRoutes);

// --------------- Error Handling ---------------

// Catch-all 404 for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — must be the last middleware
app.use(errorHandler);

// --------------- Start Server ---------------

app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
