/**
 * Validation utilities for request data validation
 * Provides Zod integration and standardized error handling
 */

import { Response } from 'express';
import { ZodError, ZodSchema, ZodObject, ZodRawShape } from 'zod';
import { 
  AppError, 
  ValidationError 
} from '@/types/error';

// Interface for validation error details
interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}

/**
 * Handles Zod validation errors and converts them to standardized format
 * @param error The Zod error
 * @param res Express response object
 * @throws ValidationError with formatted error details
 */
export const handleValidationError = (error: unknown, res: Response): never => {
  if (error instanceof ZodError) {
    const formattedErrors: ValidationErrorDetail[] = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: err.code === 'invalid_type' ? err.received : undefined
    }));

    throw new ValidationError(
      'Validation failed',
      { errors: formattedErrors }
    );
  }

  if (error instanceof AppError) {
    throw error;
  }

  throw new ValidationError('Validation processing failed');
};

/**
 * Validates request data using a Zod schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns The validated data
 * @throws ValidationError if validation fails
 */
export const validateData = <T>(
  schema: ZodSchema<T>,
  data: unknown
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: ValidationErrorDetail[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.code === 'invalid_type' ? err.received : undefined
      }));

      throw new ValidationError(
        'Validation failed',
        { errors: formattedErrors }
      );
    }
    throw error;
  }
};

/**
 * Validates request data using a Zod schema (async version)
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns Promise resolving to the validated data
 * @throws ValidationError if validation fails
 */
export const validateDataAsync = async <T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<T> => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: ValidationErrorDetail[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.code === 'invalid_type' ? err.received : undefined
      }));

      throw new ValidationError(
        'Validation failed',
        { errors: formattedErrors }
      );
    }
    throw error;
  }
};

/**
 * Creates a validation middleware for Express routes
 * @param schema The Zod schema to validate against
 * @param target The request property to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
export const createValidationMiddleware = <T>(
  schema: ZodSchema<T>,
  target: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: any, res: Response, next: any) => {
    try {
      const validatedData = validateData(schema, req[target]);
      req[target] = validatedData;
      next();
    } catch (error) {
      handleValidationError(error, res);
    }
  };
};

/**
 * Validates partial data (only provided fields)
 * @param schema The Zod schema to validate against
 * @param data The partial data to validate
 * @returns The validated partial data
 * @throws ValidationError if validation fails
 */
export const validatePartialData = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: Partial<{ [K in keyof T]: any }>
): Partial<{ [K in keyof T]: any }> => {
  try {
    return schema.partial().parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: ValidationErrorDetail[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.code === 'invalid_type' ? err.received : undefined
      }));

      throw new ValidationError(
        'Partial validation failed',
        { errors: formattedErrors }
      );
    }
    throw error;
  }
};

/**
 * Sanitizes and validates email addresses
 * @param email The email to validate
 * @returns The sanitized email
 * @throws ValidationError if email is invalid
 */
export const validateEmail = (email: string): string => {
  const sanitizedEmail = email.trim().toLowerCase();
  
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitizedEmail)) {
    throw new ValidationError('Invalid email format');
  }
  
  return sanitizedEmail;
};

/**
 * Validates and sanitizes pagination parameters
 * @param page The page number
 * @param limit The limit per page
 * @param maxLimit Maximum allowed limit
 * @returns Sanitized pagination parameters
 */
export const validatePagination = (
  page?: number,
  limit?: number,
  maxLimit: number = 100
) => {
  const sanitizedPage = Math.max(1, page || 1);
  const sanitizedLimit = Math.min(Math.max(1, limit || 10), maxLimit);
  
  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    skip: (sanitizedPage - 1) * sanitizedLimit
  };
};

/**
 * Creates a Zod schema for common validation patterns
 */
export const createCommonSchemas = () => {
  const { z } = require('zod');
  
  return {
    // Email validation schema
    email: z.string()
      .email('Invalid email format')
      .min(1, 'Email is required')
      .max(255, 'Email is too long')
      .transform((val: string) => val.trim().toLowerCase()),
    
    // Password validation schema
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    
    // Pagination schema
    pagination: z.object({
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().max(100).default(10),
      sort: z.string().optional(),
      order: z.enum(['asc', 'desc']).default('desc')
    }),
    
    // ID validation schema
    id: z.string()
      .min(1, 'ID is required')
      .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid ID format'),
    
    // UUID validation schema
    uuid: z.string()
      .uuid('Invalid UUID format'),
    
    // Date validation schema
    date: z.string()
      .datetime('Invalid date format')
      .or(z.date())
      .transform((val: string | Date) => new Date(val))
  };
}; 