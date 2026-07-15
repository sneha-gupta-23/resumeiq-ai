/**
 * pdfService.js — Extract text content from a PDF buffer
 *
 * Uses the `pdf-parse` library to read the binary buffer that multer
 * keeps in memory and returns the raw text string.
 */

import pdf from 'pdf-parse';

/**
 * Extracts plain text from a PDF file buffer.
 * @param {Buffer} buffer  The PDF file buffer (from multer memoryStorage)
 * @returns {Promise<string>}  The extracted text
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);

    if (!data.text || data.text.trim().length === 0) {
      const err = new Error(
        'Could not extract text from the PDF. The file may be image-based or empty.'
      );
      err.statusCode = 422;
      throw err;
    }

    return data.text;
  } catch (error) {
    // Re-throw if it's our custom error
    if (error.statusCode) throw error;

    const err = new Error('Failed to parse the PDF file. Please ensure it is a valid PDF.');
    err.statusCode = 400;
    throw err;
  }
}
