import bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '../models/User';
import { config } from '../config/env';
import { IUser, AppError, AuthTokens } from '@microservices-backend/shared-types';
import { generateTokens, verifyRefreshToken } from '@microservices-backend/shared-utils';

export const registerUser = async (email: string, password: string): Promise<IUser> => {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const user = new User({
        email,
        password,
    });

    await user.save();
    return user;
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: IUser, tokens: AuthTokens }> => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    const tokens = generateTokens(user._id, config.jwt);
    
    return { user, tokens };
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
    try {
        const decoded = verifyRefreshToken(refreshToken, config.jwt.secret);
        
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return generateTokens(user._id, config.jwt);
    } catch (error) {
        throw error;
    }
};

export const setAuthCookies = (res: Response, tokens: AuthTokens) => {
    const isProduction = config.server.env === 'production';

    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}; 