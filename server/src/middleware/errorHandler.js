/**
 * errorHandler.js — Global error-handling middleware
 *
 * Catches all errors thrown or passed via next(err) and returns
 * a consistent JSON error response with the appropriate HTTP status code.
 */

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Multer-specific errors (file too large, wrong type, etc.)
  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'File is too large. Maximum size is 10 MB.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field.',
    };
    return res.status(400).json({
      success: false,
      error: messages[err.code] || err.message,
    });
  }

  // Multer file-filter rejection (thrown as a plain Error)
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error("========== BACKEND ERROR ==========");
    console.error(err);
    console.error(err.stack);
    console.error("===================================");

    return res.status(err.statusCode || err.status || 500).json({
      success: false,
      error: err.message,
      status: err.statusCode || err.status || 500,
      stack: err.stack
    });
  } else {
    return res.status(err.statusCode || err.status || 500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
}
