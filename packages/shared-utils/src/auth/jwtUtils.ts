import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthTokens, AppError } from '@microservices-backend/shared-types';

export interface JWTConfig {
    secret: string;
    accessTokenExpiry?: string;
    refreshTokenExpiry?: string;
}

export const generateTokens = (userId: string, config: JWTConfig): AuthTokens => {
    const accessTokenOptions: SignOptions = {
        expiresIn: (config.accessTokenExpiry || '15m') as any
    };

    const refreshTokenOptions: SignOptions = {
        expiresIn: (config.refreshTokenExpiry || '7d') as any
    };

    const accessToken = jwt.sign(
        { userId, type: 'access' },
        config.secret,
        accessTokenOptions
    );

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        config.secret,
        refreshTokenOptions
    );

    return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string): { userId: string, type: string } => {
    try {
        const decoded = jwt.verify(token, secret) as { userId: string, type: string };
        return decoded;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError('Invalid token', 401);
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Token expired', 401);
        }
        throw error;
    }
};

export const verifyAccessToken = (token: string, secret: string): { userId: string } => {
    const decoded = verifyToken(token, secret);
    if (decoded.type !== 'access') {
        throw new AppError('Invalid token type', 401);
    }
    return { userId: decoded.userId };
};

export const verifyRefreshToken = (token: string, secret: string): { userId: string } => {
    const decoded = verifyToken(token, secret);
    if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
    }
    return { userId: decoded.userId };
}; 