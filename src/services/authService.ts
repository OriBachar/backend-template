import { userRepository } from '../data-access/index';
import { IUser, UserRole } from '../types/user';
import { AppError } from '../types/error';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import bcrypt from 'bcrypt';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const registerUser = async (email: string, password: string): Promise<IUser> => {
    const userExists = await userRepository.exists(email);
    if (userExists) {
        throw new AppError('User already exists with this email', 400);
    }
    
    return await userRepository.create({
        email,
        password,
        role: UserRole.USER,
        createdAt: new Date()
    });
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: IUser, tokens: { accessToken: string, refreshToken: string } }> => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email, type: 'access' },
        config.jwt.secret,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email, type: 'refresh' },
        config.jwt.secret,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { user, tokens: { accessToken, refreshToken } };
};

export const refreshTokens = async (refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> => {
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.secret) as { userId: string, email: string, type: string };
        
        if (decoded.type !== 'refresh') {
            throw new AppError('Invalid token type', 401);
        }

        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const newAccessToken = jwt.sign(
            { userId: user._id, email: user.email, type: 'access' },
            config.jwt.secret,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id, email: user.email, type: 'refresh' },
            config.jwt.secret,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }
};

export const setAuthCookies = (res: Response, tokens: { accessToken: string, refreshToken: string }) => {
    res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: config.server.env === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: config.server.env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};