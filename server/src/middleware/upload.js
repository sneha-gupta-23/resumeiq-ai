/**
 * upload.js — Multer middleware for handling PDF file uploads
 *
 * Configuration:
 *  - memoryStorage: keeps the file in RAM as a Buffer (no disk writes)
 *  - 10 MB file-size limit
 *  - Only allows application/pdf MIME type
 */

import multer from 'multer';

// Keep files in memory so we can pass the buffer directly to pdf-parse
const storage = multer.memoryStorage();

/**
 * File filter — reject anything that isn't a PDF.
 */
function fileFilter(_req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export default upload;
