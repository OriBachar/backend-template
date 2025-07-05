import { z } from 'zod';
import { RequestHandler } from 'express';
import { UserRole } from '@microservices-backend/shared-types';
import { handleValidationError } from '@microservices-backend/shared-utils';

// User ID validation
export const userIdSchema = z.object({
    userId: z.string().min(1, 'User ID is required')
});

// Email validation
export const emailSchema = z.object({
    email: z.string().email('Invalid email format')
});

// User profile update validation
export const updateProfileSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
    role: z.nativeEnum(UserRole, { 
        errorMap: () => ({ message: 'Invalid user role' })
    }).optional()
});

// User search query validation
export const searchQuerySchema = z.object({
    search: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
    page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional()
});

// Role update validation
export const updateRoleSchema = z.object({
    role: z.nativeEnum(UserRole, { 
        errorMap: () => ({ message: 'Invalid user role' })
    })
});

// Validation middleware creators
const validateBody = (schema: z.ZodSchema): RequestHandler => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

const validateParams = (schema: z.ZodSchema): RequestHandler => (req, res, next) => {
    try {
        schema.parse(req.params);
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

const validateQuery = (schema: z.ZodSchema): RequestHandler => (req, res, next) => {
    try {
        schema.parse(req.query);
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

// Middleware exports
export const validateUserId = validateParams(userIdSchema);
export const validateEmail = validateParams(emailSchema);
export const validateUpdateProfile = validateBody(updateProfileSchema);
export const validateSearchQuery = validateQuery(searchQuerySchema);
export const validateUpdateRole = validateBody(updateRoleSchema); 