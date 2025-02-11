import { RequestHandler } from 'express';
import { User } from '../models/User';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/error';
import { asyncHandler } from '../utils/asyncHandler';

export const auth: RequestHandler = asyncHandler(async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError('Authorization token is required', 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string, email: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new AppError('Invalid token - User not found', 401);
        }

        (req as any).user = user;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError('Invalid or expired token', 401);
        }
        throw error;
    }
});