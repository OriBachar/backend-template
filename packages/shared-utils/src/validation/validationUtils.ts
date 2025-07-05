import { Response } from 'express';
import { ZodError } from 'zod';

// AppError class - temporary until shared-types is built
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(message: string, statusCode: number, isOperational = true, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

export const handleValidationError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        
        throw new AppError(
            'Validation failed',
            400,
            true,
            { errors: formattedErrors }
        );
    }

    if (error instanceof AppError) {
        throw error;
    }

    throw new AppError('Validation processing failed', 500);
}; 