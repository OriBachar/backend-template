import { IUser, AppError } from '@microservices-backend/shared-types';
import { User } from '../models/User';
import { createRepository } from './baseRepository';

const baseUserRepository = createRepository<IUser>(User);

export const userRepository = {
    ...baseUserRepository,
    
    findByEmail: async (email: string): Promise<IUser | null> => {
        try {
            return await baseUserRepository.findOne({ email });
        } catch (error) {
            throw new AppError('Failed to find user by email', 500, true, { error });
        }
    },

    exists: async (email: string): Promise<boolean> => {
        try {
            const user = await baseUserRepository.findOne({ email });
            return !!user;
        } catch (error) {
            throw new AppError('Failed to check user existence', 500, true, { error });
        }
    },

    findByRole: async (role: string): Promise<IUser[]> => {
        try {
            return await baseUserRepository.find({ role });
        } catch (error) {
            throw new AppError('Failed to find users by role', 500, true, { error });
        }
    },

    updateProfile: async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
        try {
            // Exclude sensitive fields from being updated
            const { password, ...safeUpdateData } = updateData as any;
            return await baseUserRepository.update(userId, safeUpdateData);
        } catch (error) {
            throw new AppError('Failed to update user profile', 500, true, { error });
        }
    },

    searchUsers: async (searchTerm: string, page: number = 1, limit: number = 10) => {
        try {
            const filter = {
                $or: [
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            };
            return await baseUserRepository.findWithPagination(filter, page, limit, { createdAt: -1 });
        } catch (error) {
            throw new AppError('Failed to search users', 500, true, { error });
        }
    },

    getActiveUsers: async (page: number = 1, limit: number = 10) => {
        try {
            // For now, we'll consider all users as active. In the future, 
            // this could filter by last login date or other activity indicators
            return await baseUserRepository.findWithPagination({}, page, limit, { createdAt: -1 });
        } catch (error) {
            throw new AppError('Failed to get active users', 500, true, { error });
        }
    }
}; 