import { IUser } from '../../../types/user';
import { User } from '../../../models/User';
import { AppError } from '../../../types/error';
import { createRepository } from '../baseRepository'

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
    }
};