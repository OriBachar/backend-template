import { RequestHandler } from 'express';
import { registerSchema, loginSchema } from '../types/auth';
import { ZodError } from 'zod';
import { AppError } from '../types/error';
import { asyncHandler } from '../utils/asyncHandler';

export const validateRegister = asyncHandler(async (req, res, next) => {
    try {
        await registerSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));


            next(new AppError(
                'Validation failed',
                400,
                true,
                { errors: formattedErrors }
            ));
            return;
            
        }

        next(new AppError('Validation processing failed', 500));

    };
});

export const validateLogin: RequestHandler = asyncHandler(async (req, res, next) => {
    try {
        await loginSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));


            next(new AppError(
                'Validation failed',
                400,
                true,
                { errors: formattedErrors }
            ));
            return;
        }
        
        next(new AppError('Validation processing failed', 500));
    }
});