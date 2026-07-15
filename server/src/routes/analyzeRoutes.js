/**
 * analyzeRoutes.js — Route definitions for the analysis API
 *
 * POST /api/analyze
 *  - Multer middleware handles the "resume" file field
 *  - Controller validates, processes, and returns the analysis
 */

import { Router } from 'express';
import upload from '../middleware/upload.js';
import { analyzeResume } from '../controllers/analyzeController.js';

const router = Router();

// POST /api/analyze — Upload resume + job description → get AI analysis
router.post('/analyze', upload.single('resume'), analyzeResume);

export default router;
