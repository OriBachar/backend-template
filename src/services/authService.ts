import { UserRepository } from '../data-access';
import { IUser, UserRole } from '../types/user';
import { AppError } from '../types/error';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export const registerUser = async (email: string, password: string): Promise<IUser> => {
    const userExists = await userRepository.exists(email);
    if (userExists) {
        throw new AppError('User already exists with this email', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await userRepository.create({
        email,
        password: hashedPassword,
        role: UserRole.USER,
        createdAt: new Date()
    });
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: IUser, token: string }> => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwt.secret,
        { expiresIn: '24h' }
    );

    return { user, token };
};

export const generateTokenAndSetCookie = (res: Response, userId: string, email: string) => {
    try {
        const token = jwt.sign({ userId, email }, config.jwt.secret, { expiresIn: '1h' });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: config.server.env === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });

        return token;
    } catch (error) {
        throw new AppError('Error generating authentication token', 500);
    }
}