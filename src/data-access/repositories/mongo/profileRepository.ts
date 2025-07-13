import { IProfile } from '../../../types/user';
import { Profile } from '../../../models/Profile';
import { AppError } from '../../../types/error';
import { createRepository } from '../baseRepository';

const baseProfileRepository = createRepository<IProfile>(Profile);

export const profileRepository = {
    ...baseProfileRepository,
    
    findByUserId: async (userId: string): Promise<IProfile | null> => {
        try {
            return await baseProfileRepository.findOne({ userId });
        } catch (error) {
            throw new AppError('Failed to find profile by user id', 500, true, { error });
        }
    }
}; 