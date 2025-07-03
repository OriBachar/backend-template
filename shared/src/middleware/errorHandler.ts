/**
 * Global error handling middleware for Express applications
 * Provides centralized error handling across all microservices
 */

import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  ErrorResponse 
} from '@/types/error';
import { EnvironmentConfig } from '@/types/common';
import { ErrorHandlerConfig } from '@/types/middleware';
import { logger } from '@/utils/logger';

/**
 * Creates a standardized error response
 */
const createErrorResponse = (
  error: AppError | Error,
  req: Request,
  config: EnvironmentConfig
): ErrorResponse => {
  const baseResponse: ErrorResponse = {
    status: 'error',
    message: error.message || 'Internal server error',
    timestamp: new Date(),
    path: req.path,
    method: req.method,
  };

  // Add error code if available
  if (error instanceof AppError && error.code) {
    baseResponse.code = error.code;
  }

  // Add details if available
  if (error instanceof AppError && error.details) {
    baseResponse.details = error.details;
  }

  // Add stack trace in development
  if (config.NODE_ENV === 'development') {
    baseResponse.stack = error.stack;
  }

  return baseResponse;
};

/**
 * Logs error information
 */
const logError = (error: Error, req: Request, config: EnvironmentConfig): void => {
  const errorContext = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.headers['x-request-id'] as string,
    userId: (req as any).user?.id,
  };

  if (error instanceof AppError) {
    logger.error(`[${error.code || 'UNKNOWN'}] ${error.message}`, errorContext, error);
  } else {
    logger.error('Unhandled error occurred', errorContext, error);
  }
};

/**
 * Determines HTTP status code based on error type
 */
const getStatusCode = (error: Error): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  // Handle specific error types
  if (error.name === 'ValidationError') return 400;
  if (error.name === 'CastError') return 400;
  if (error.name === 'JsonWebTokenError') return 401;
  if (error.name === 'TokenExpiredError') return 401;
  if (error.name === 'MongoError' && (error as any).code === 11000) return 409;

  return 500;
};

/**
 * Creates global error handling middleware
 * @param config Environment configuration
 * @returns Express error handling middleware
 */
export const createErrorHandler = (config: EnvironmentConfig): ErrorRequestHandler => {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    // Log error if enabled
    if (config.NODE_ENV !== 'test') {
      logError(error, req, config);
    }

    // Get status code
    const statusCode = getStatusCode(error);

    // Create error response
    const errorResponse = createErrorResponse(error, req, config);

    // Send response
    res.status(statusCode).json(errorResponse);
  };
};

/**
 * Creates a 404 handler for unmatched routes
 */
export const createNotFoundHandler = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
    next(error);
  };
};

/**
 * Creates async error wrapper for route handlers
 */
export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handles unhandled promise rejections
 */
export const handleUnhandledRejection = (config: EnvironmentConfig) => {
  process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason.message,
      stack: reason.stack,
      promise: promise.toString(),
    });

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
};

/**
 * Handles uncaught exceptions
 */
export const handleUncaughtException = (config: EnvironmentConfig) => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack,
    });

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
};

// Export default error handler for convenience
export default createErrorHandler; 