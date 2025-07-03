/**
 * Main utils export file for the shared library
 * Provides clean imports using path mapping
 */

// Async handler utilities
export * from '@/utils/asyncHandler';

// Validation utilities
export * from '@/utils/validationUtils';

// Logger utilities
export * from '@/utils/logger';

// Re-export commonly used utilities for convenience
export {
  asyncHandler,
  createAsyncHandler,
  createServiceHandler,
  createValidatedHandler,
  createLoggedHandler,
  AsyncRequestHandler
} from '@/utils/asyncHandler';

export {
  handleValidationError,
  validateData,
  validateDataAsync,
  createValidationMiddleware,
  validatePartialData,
  validateEmail,
  validatePagination,
  createCommonSchemas
} from '@/utils/validationUtils';

export {
  logger,
  createLogger,
  LogLevel,
  LogContext,
  LogEntry
} from '@/utils/logger'; 