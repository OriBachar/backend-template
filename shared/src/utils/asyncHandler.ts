/**
 * Async handler utility for Express route handlers
 * Provides automatic error handling and proper typing
 */

import { RequestHandler, Request, Response, NextFunction } from 'express';
import { AppError } from '@/types/error';

// Type for async route handlers
export type AsyncRequestHandler<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

/**
 * Wraps async route handlers to automatically catch errors
 * and pass them to Express error handling middleware
 */
export const asyncHandler = <T = any>(
  fn: AsyncRequestHandler<T>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Creates a typed async handler with proper error handling
 * @param handler The async route handler function
 * @returns Express middleware function
 */
export const createAsyncHandler = <T = any>(
  handler: AsyncRequestHandler<T>
): RequestHandler => {
  return asyncHandler(handler);
};

/**
 * Higher-order function that creates async handlers with error context
 * @param serviceName The name of the service for error context
 * @param handler The async route handler function
 * @returns Express middleware function
 */
export const createServiceHandler = <T = any>(
  serviceName: string,
  handler: AsyncRequestHandler<T>
): RequestHandler => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await handler(req, res, next);
    } catch (error) {
      // Add service context to error
      if (error instanceof AppError) {
        error.message = `[${serviceName}] ${error.message}`;
      }
      throw error;
    }
  });
};

/**
 * Creates a handler that automatically validates request data
 * @param validator Function to validate request data
 * @param handler The async route handler function
 * @returns Express middleware function
 */
export const createValidatedHandler = <T = any>(
  validator: (data: any) => Promise<any> | any,
  handler: AsyncRequestHandler<T>
): RequestHandler => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate request data
    await validator(req.body);
    
    // Call the actual handler
    return await handler(req, res, next);
  });
};

/**
 * Creates a handler with request logging
 * @param handler The async route handler function
 * @returns Express middleware function
 */
export const createLoggedHandler = <T = any>(
  handler: AsyncRequestHandler<T>
): RequestHandler => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    try {
      const result = await handler(req, res, next);
      const duration = Date.now() - startTime;
      
      console.log(`[${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${req.method}] ${req.path} - ERROR - ${duration}ms`, error);
      throw error;
    }
  });
}; 