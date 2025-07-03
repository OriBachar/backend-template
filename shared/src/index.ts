/**
 * Main export file for the shared library
 * Provides clean imports using path mapping for all microservices
 */

// Types exports
export * from '@/types';

// Utils exports
export * from '@/utils';

// Middleware exports
export * from '@/middleware';

// Config exports
export * from '@/config';

// Re-export commonly used items for convenience
export {
  // Common types
  BaseEntity,
  UserRole,
  JWTPayload,
  ApiResponse,
  PaginationParams,
  QueryOptions,
  HealthCheckResponse,
  RequestContext,
  ValidationError,
  FileUpload,
  EnvironmentConfig
} from '@/types/common';

export {
  // Error types
  AppError,
  ValidationError as ValidationErrorClass,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  ErrorCode,
  ErrorResponse
} from '@/types/error';

export {
  // Event types
  BaseEvent,
  UserRegisteredEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  UserLoggedInEvent,
  ProfileCreatedEvent,
  ProfileUpdatedEvent,
  FileUploadedEvent,
  FileDeletedEvent,
  EC2InstanceLaunchedEvent,
  EC2InstanceStoppedEvent,
  NotificationSentEvent,
  NotificationFailedEvent,
  ServiceHealthEvent,
  MicroserviceEvent,
  EventHandler,
  EventSubscription,
  EventPublishOptions
} from '@/types/events';

export {
  // Utility functions
  asyncHandler,
  createAsyncHandler,
  createServiceHandler,
  createValidatedHandler,
  createLoggedHandler,
  handleValidationError,
  validateData,
  validateDataAsync,
  createValidationMiddleware,
  validatePartialData,
  validateEmail,
  validatePagination,
  createCommonSchemas,
  logger,
  createLogger,
  LogLevel,
  LogContext,
  LogEntry
} from '@/utils'; 