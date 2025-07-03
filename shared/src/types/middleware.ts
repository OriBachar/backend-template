/**
 * Middleware-specific types and interfaces
 */

// Error handler configuration interface
export interface ErrorHandlerConfig {
  includeStack: boolean;
  logErrors: boolean;
  formatErrors: boolean;
} 