/**
 * api.js — HTTP client for communicating with the backend
 *
 * Uses native fetch with AbortController for timeout control.
 * Every promise is awaited. Every rejection is caught.
 */

// In development, Vite proxies /api to the backend.
// In production, set VITE_API_URL to the deployed backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Send a resume PDF and job description to the backend for AI analysis.
 *
 * @param {File}   resumeFile       The PDF file object from the file input
 * @param {string} jobDescription   The job description text
 * @returns {Promise<object>}       The structured analysis result
 */
export async function analyzeResume(resumeFile, jobDescription) {
  console.log('Uploading resume');
  console.log('Sending request');

  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  // 65s timeout — slightly longer than the backend's 60s Gemini timeout
  // so the backend has a chance to respond with its own error first.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 65_000);

  try {
    console.log('Waiting Gemini');
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`Response received: ${response.status}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `Server error (${response.status})` };
      }
      throw new Error(errorData.error || `Server error (${response.status})`);
    }

    const data = await response.json();
    console.log('Gemini finished');
    console.log('JSON parsed');
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Analysis timed out. Please try again.');
    }
    throw error;
  }
}
