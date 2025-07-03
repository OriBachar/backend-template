/**
 * Common types shared across all microservices
 */

// Base entity interface for all database models
export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User roles enum
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator"
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

// API response wrapper
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Database query options
export interface QueryOptions {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: string;
  populate?: string | string[];
}

// Service health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  version: string;
  services: {
    database: boolean;
    redis?: boolean;
    rabbitmq?: boolean;
  };
}

// Request context interface
export interface RequestContext {
  requestId: string;
  userId?: string;
  userRole?: UserRole;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// File upload interface
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

// Environment configuration interface
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL?: string;
  RABBITMQ_URL?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string[];
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
} 