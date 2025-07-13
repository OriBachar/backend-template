import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ProfileService } from '../services/profileService';
import { AppError } from '../types/error';

const profileService = new ProfileService();

export const profileController = {
    // Create a new profile
    createProfile: asyncHandler(async (req: Request, res: Response) => {
        const { userId, firstName, lastName, avatar, bio, preferences } = req.body;

        if (!userId) {
            throw new AppError('User ID is required', 400);
        }

        const profile = await profileService.createProfile({
            userId,
            firstName,
            lastName,
            avatar,
            bio,
            preferences
        });

        res.status(201).json({
            success: true,
            data: profile,
            message: 'Profile created successfully'
        });
    }),

    // Get all profiles
    getAllProfiles: asyncHandler(async (req: Request, res: Response) => {
        const profiles = await profileService.getAllProfiles();

        res.status(200).json({
            success: true,
            data: profiles,
            message: 'Profiles retrieved successfully'
        });
    }),

    // Get profile by ID
    getProfileById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const profile = await profileService.getProfileById(id);
        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Profile retrieved successfully'
        });
    }),

    // Get profile by user ID
    getProfileByUserId: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;

        const profile = await profileService.getProfileByUserId(userId);
        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Profile retrieved successfully'
        });
    }),

    // Update profile by ID
    updateProfile: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { userId, firstName, lastName, avatar, bio, preferences } = req.body;

        const profile = await profileService.updateProfile(id, {
            userId,
            firstName,
            lastName,
            avatar,
            bio,
            preferences
        });

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Profile updated successfully'
        });
    }),

    // Update profile by user ID
    updateProfileByUserId: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { firstName, lastName, avatar, bio, preferences } = req.body;

        const profile = await profileService.updateProfileByUserId(userId, {
            firstName,
            lastName,
            avatar,
            bio,
            preferences
        });

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Profile updated successfully'
        });
    }),

    // Delete profile by ID
    deleteProfile: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const profile = await profileService.deleteProfile(id);

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Profile deleted successfully'
        });
    }),

    // Delete profile by user ID
    deleteProfileByUserId: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;

        const profile = await profileService.deleteProfileByUserId(userId);

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Profile deleted successfully'
        });
    })
}; 