import { RequestHandler } from 'express';
import { registerUser, authenticateUser, setAuthCookies, refreshTokens } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';

export const register: RequestHandler = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json({ 
        status: 'success',
        message: 'User registered successfully',
        data: { userId: user._id }
    });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
    const { user, tokens } = await authenticateUser(req.body.email, req.body.password);
    setAuthCookies(res, tokens);
    res.status(200).json({ 
        status: 'success',
        message: 'Logged in successfully'
    });
});

export const refresh: RequestHandler = asyncHandler(async (req, res) => {
    const tokens = await refreshTokens(req.body.refreshToken);
    setAuthCookies(res, tokens);
    res.status(200).json({ 
        status: 'success',
        message: 'Tokens refreshed successfully'
    });
});