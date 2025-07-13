import { PermissionRepositoryFactory } from '../data-access/index';
import { IPermission } from '../types/user';
import { AppError } from '../types/error';

export class PermissionService {
    private permissionRepository = PermissionRepositoryFactory.create();

    async createPermission(permissionData: { name: string; description?: string; resource: string; action: string }): Promise<IPermission> {
        try {
            // Check if permission with same name already exists
            const existingPermission = await this.permissionRepository.findByName(permissionData.name);
            if (existingPermission) {
                throw new AppError('Permission with this name already exists', 400);
            }

            return await this.permissionRepository.create(permissionData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to create permission', 500);
        }
    }

    async getAllPermissions(): Promise<IPermission[]> {
        try {
            return await this.permissionRepository.find();
        } catch (error) {
            throw new AppError('Failed to fetch permissions', 500);
        }
    }

    async getPermissionById(id: string): Promise<IPermission | null> {
        try {
            return await this.permissionRepository.findById(id);
        } catch (error) {
            throw new AppError('Failed to fetch permission', 500);
        }
    }

    async getPermissionByName(name: string): Promise<IPermission | null> {
        try {
            return await this.permissionRepository.findByName(name);
        } catch (error) {
            throw new AppError('Failed to fetch permission', 500);
        }
    }

    async getPermissionsByResource(resource: string): Promise<IPermission[]> {
        try {
            const allPermissions = await this.permissionRepository.find();
            return allPermissions.filter(permission => permission.resource === resource);
        } catch (error) {
            throw new AppError('Failed to fetch permissions by resource', 500);
        }
    }

    async updatePermission(id: string, updateData: Partial<{ name: string; description?: string; resource: string; action: string }>): Promise<IPermission | null> {
        try {
            // Check if permission exists
            const existingPermission = await this.permissionRepository.findById(id);
            if (!existingPermission) {
                throw new AppError('Permission not found', 404);
            }

            // If name is being updated, check for conflicts
            if (updateData.name && updateData.name !== existingPermission.name) {
                const permissionWithSameName = await this.permissionRepository.findByName(updateData.name);
                if (permissionWithSameName) {
                    throw new AppError('Permission with this name already exists', 400);
                }
            }

            return await this.permissionRepository.update(id, updateData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update permission', 500);
        }
    }

    async deletePermission(id: string): Promise<IPermission | null> {
        try {
            // Check if permission exists
            const existingPermission = await this.permissionRepository.findById(id);
            if (!existingPermission) {
                throw new AppError('Permission not found', 404);
            }

            // Prevent deletion of system permissions
            const systemPermissions = ['user:read', 'user:write', 'admin:full'];
            if (systemPermissions.includes(existingPermission.name)) {
                throw new AppError('Cannot delete system permissions', 400);
            }

            return await this.permissionRepository.remove(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to delete permission', 500);
        }
    }
} 