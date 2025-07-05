import { RequestHandler } from 'express';
import { registerSchema, loginSchema, refreshTokenSchema } from '@microservices-backend/shared-types';
import { handleValidationError } from '@microservices-backend/shared-utils';
import { asyncHandler } from '@microservices-backend/shared-utils';

export const validateRegister: RequestHandler = asyncHandler(async (req, res, next) => {
    try {
        await registerSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
});

export const validateLogin: RequestHandler = asyncHandler(async (req, res, next) => {
    try {
        await loginSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
});

export const validateRefresh: RequestHandler = asyncHandler(async (req, res, next) => {
    try {
        await refreshTokenSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
}); 