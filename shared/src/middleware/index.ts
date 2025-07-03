/**
 * Main middleware export file for the shared library
 * Provides clean imports using path mapping
 */

// Common middleware exports
export * from '@/middleware/middleware';

// Error handling middleware exports
export * from '@/middleware/errorHandler';

// Authentication middleware exports
export * from '@/middleware/authMiddleware';

// Re-export commonly used middleware for convenience
export {
  configureMiddleware,
  createApp,
  createRateLimiter,
  createCorsMiddleware,
  createHelmetConfig
} from '@/middleware/middleware';

export {
  createErrorHandler,
  createNotFoundHandler,
  asyncErrorHandler,
  handleUnhandledRejection,
  handleUncaughtException
} from '@/middleware/errorHandler';

export {
  verifyJWT,
  optionalJWT,
  requireRole,
  requireAdmin,
  verifyRefreshToken
} from '@/middleware/authMiddleware'; 