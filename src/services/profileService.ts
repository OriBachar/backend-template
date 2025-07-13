import { ProfileRepositoryFactory } from '../data-access/index';
import { IProfile } from '../types/user';
import { AppError } from '../types/error';

export class ProfileService {
    private profileRepository = ProfileRepositoryFactory.create();

    async createProfile(profileData: { userId: string; firstName?: string; lastName?: string; avatar?: string; bio?: string; preferences?: Record<string, any> }): Promise<IProfile> {
        try {
            // Check if profile for this user already exists
            const existingProfile = await this.profileRepository.findByUserId(profileData.userId);
            if (existingProfile) {
                throw new AppError('Profile for this user already exists', 400);
            }

            return await this.profileRepository.create(profileData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to create profile', 500);
        }
    }

    async getAllProfiles(): Promise<IProfile[]> {
        try {
            return await this.profileRepository.find();
        } catch (error) {
            throw new AppError('Failed to fetch profiles', 500);
        }
    }

    async getProfileById(id: string): Promise<IProfile | null> {
        try {
            return await this.profileRepository.findById(id);
        } catch (error) {
            throw new AppError('Failed to fetch profile', 500);
        }
    }

    async getProfileByUserId(userId: string): Promise<IProfile | null> {
        try {
            return await this.profileRepository.findByUserId(userId);
        } catch (error) {
            throw new AppError('Failed to fetch profile', 500);
        }
    }

    async updateProfile(id: string, updateData: Partial<{ userId: string; firstName?: string; lastName?: string; avatar?: string; bio?: string; preferences?: Record<string, any> }>): Promise<IProfile | null> {
        try {
            // Check if profile exists
            const existingProfile = await this.profileRepository.findById(id);
            if (!existingProfile) {
                throw new AppError('Profile not found', 404);
            }

            // If userId is being updated, check for conflicts
            if (updateData.userId && updateData.userId !== existingProfile.userId) {
                const profileWithSameUserId = await this.profileRepository.findByUserId(updateData.userId);
                if (profileWithSameUserId) {
                    throw new AppError('Profile for this user already exists', 400);
                }
            }

            return await this.profileRepository.update(id, updateData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update profile', 500);
        }
    }

    async updateProfileByUserId(userId: string, updateData: Partial<{ firstName?: string; lastName?: string; avatar?: string; bio?: string; preferences?: Record<string, any> }>): Promise<IProfile | null> {
        try {
            // Check if profile exists
            const existingProfile = await this.profileRepository.findByUserId(userId);
            if (!existingProfile) {
                throw new AppError('Profile not found', 404);
            }

            return await this.profileRepository.update(existingProfile.id || existingProfile._id, updateData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update profile', 500);
        }
    }

    async deleteProfile(id: string): Promise<IProfile | null> {
        try {
            // Check if profile exists
            const existingProfile = await this.profileRepository.findById(id);
            if (!existingProfile) {
                throw new AppError('Profile not found', 404);
            }

            return await this.profileRepository.remove(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to delete profile', 500);
        }
    }

    async deleteProfileByUserId(userId: string): Promise<IProfile | null> {
        try {
            // Check if profile exists
            const existingProfile = await this.profileRepository.findByUserId(userId);
            if (!existingProfile) {
                throw new AppError('Profile not found', 404);
            }

            return await this.profileRepository.remove(existingProfile.id || existingProfile._id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to delete profile', 500);
        }
    }
} 