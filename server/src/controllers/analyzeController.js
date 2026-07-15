/**
 * analyzeController.js — Request handler for POST /api/analyze
 *
 * Orchestrates the full analysis pipeline:
 *  1. Validate inputs (resume file + job description)
 *  2. Extract text from the uploaded PDF
 *  3. Send to Gemini for analysis
 *  4. Return the structured JSON result
 *
 * Every code path returns an HTTP response — never leaves the request pending.
 */

import { validateResumeFile, validateJobDescription } from '../utils/validateInputs.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeWithGemini } from '../services/geminiService.js';

/**
 * POST /api/analyze
 * Accepts multipart form data with:
 *  - resume: PDF file
 *  - jobDescription: string
 */
export async function analyzeResume(req, res, next) {
  try {
    console.log('── POST /api/analyze received ──');

    // 1. Validate inputs
    validateResumeFile(req.file);
    validateJobDescription(req.body.jobDescription);
    console.log('Inputs validated');

    // 2. Extract text from the PDF
    console.log('Extracting PDF text...');
    const resumeText = await extractTextFromPDF(req.file.buffer);
    console.log(`PDF extracted (${resumeText.length} chars)`);

    // 3. Analyze with Gemini AI
    console.log('Calling Gemini service...');
    const analysis = await analyzeWithGemini(resumeText, req.body.jobDescription);
    console.log('Gemini service returned');

    // 4. Return the result
    console.log('Sending response to client');
    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Controller error:', error.message);

    // Timeout → 504
    if (error.name === 'TimeoutError' || error.message === 'Gemini API timeout') {
      return res.status(504).json({
        success: false,
        error: 'Analysis timed out. Please try again.',
      });
    }

    // Let the global error handler deal with everything else
    next(error);
  }
}
