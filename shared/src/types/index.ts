/**
 * Main types export file for the shared library
 * Provides clean imports using path mapping
 */

// Common types
export * from '@/types/common';

// Error types
export * from '@/types/error';

// Event types
export * from '@/types/events';

// Middleware types
export * from '@/types/middleware';

// Config types
export * from '@/types/config';

// Security types
export * from '@/types/security';

// Re-export commonly used types for convenience
export type {
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

export type {
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

export type {
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