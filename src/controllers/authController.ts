import { RequestHandler } from 'express';
import { registerUser, authenticateUser, generateTokenAndSetCookie } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../types/error';

export const register: RequestHandler = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json({ 
        status: 'success',
        message: 'User registered successfully',
        data: { userId: user._id }
    });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
    const { user, token } = await authenticateUser(req.body.email, req.body.password);
    generateTokenAndSetCookie(res, user._id, user.email);
    res.status(200).json({ 
        status: 'success',
        message: 'Logged in successfully'
    });
});