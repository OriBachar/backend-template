/**
 * Error types shared across all microservices
 */

// Base error class for application errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;
  public readonly code?: string;

  constructor(
    message: string, 
    statusCode: number = 500, 
    isOperational: boolean = true, 
    details?: unknown,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.code = code;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Set prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, true, details, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: unknown) {
    super(message, 401, true, details, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', details?: unknown) {
    super(message, 403, true, details, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, true, details, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: unknown) {
    super(message, 409, true, details, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: unknown) {
    super(message, 429, true, details, 'RATE_LIMIT_ERROR');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: unknown) {
    super(message, 500, true, details, 'DATABASE_ERROR');
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service error', details?: unknown) {
    super(message, 502, true, details, 'EXTERNAL_SERVICE_ERROR');
  }
}

// Error codes enum
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

// Error response interface
export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: unknown;
  stack?: string;
  timestamp: Date;
  path: string;
  method: string;
} 