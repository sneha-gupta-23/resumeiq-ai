/**
 * validateInputs.js — Input validation utilities
 *
 * Each function throws an error with a `statusCode` property so the
 * global error handler can return the correct HTTP status.
 */

/**
 * Ensures that a resume file was included in the request.
 * @param {object|undefined} file  req.file from multer
 */
export function validateResumeFile(file) {
  if (!file) {
    const err = new Error('Resume PDF file is required.');
    err.statusCode = 400;
    throw err;
  }
}

/**
 * Ensures a non-empty job description string was provided.
 * @param {string|undefined} jobDescription  req.body.jobDescription
 */
export function validateJobDescription(jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    const err = new Error('Job description is required and must be a non-empty string.');
    err.statusCode = 400;
    throw err;
  }

  if (jobDescription.trim().length < 20) {
    const err = new Error('Job description is too short. Please provide a meaningful description (at least 20 characters).');
    err.statusCode = 400;
    throw err;
  }
}
