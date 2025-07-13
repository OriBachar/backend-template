import { IRole } from '../../../types/user';
import { Role } from '../../../models/Role';
import { AppError } from '../../../types/error';
import { createRepository } from '../baseRepository';

const baseRoleRepository = createRepository<IRole>(Role);

export const roleRepository = {
    ...baseRoleRepository,
    
    findByName: async (name: string): Promise<IRole | null> => {
        try {
            return await baseRoleRepository.findOne({ name });
        } catch (error) {
            throw new AppError('Failed to find role by name', 500, true, { error });
        }
    }
}; 