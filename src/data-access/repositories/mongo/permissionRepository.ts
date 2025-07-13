import { IPermission } from '../../../types/user';
import { Permission } from '../../../models/Permission';
import { AppError } from '../../../types/error';
import { createRepository } from '../baseRepository';

const basePermissionRepository = createRepository<IPermission>(Permission);

export const permissionRepository = {
    ...basePermissionRepository,
    
    findByName: async (name: string): Promise<IPermission | null> => {
        try {
            return await basePermissionRepository.findOne({ name });
        } catch (error) {
            throw new AppError('Failed to find permission by name', 500, true, { error });
        }
    }
}; 