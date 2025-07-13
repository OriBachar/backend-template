import { RoleRepositoryFactory } from '../data-access/index';
import { IRole } from '../types/user';
import { AppError } from '../types/error';

export class RoleService {
    private roleRepository = RoleRepositoryFactory.create();

    async createRole(roleData: { name: string; description?: string }): Promise<IRole> {
        try {
            // Check if role with same name already exists
            const existingRole = await this.roleRepository.findByName(roleData.name);
            if (existingRole) {
                throw new AppError('Role with this name already exists', 400);
            }

            return await this.roleRepository.create(roleData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to create role', 500);
        }
    }

    async getAllRoles(): Promise<IRole[]> {
        try {
            return await this.roleRepository.find();
        } catch (error) {
            throw new AppError('Failed to fetch roles', 500);
        }
    }

    async getRoleById(id: string): Promise<IRole | null> {
        try {
            return await this.roleRepository.findById(id);
        } catch (error) {
            throw new AppError('Failed to fetch role', 500);
        }
    }

    async getRoleByName(name: string): Promise<IRole | null> {
        try {
            return await this.roleRepository.findByName(name);
        } catch (error) {
            throw new AppError('Failed to fetch role', 500);
        }
    }

    async updateRole(id: string, updateData: Partial<{ name: string; description?: string }>): Promise<IRole | null> {
        try {
            // Check if role exists
            const existingRole = await this.roleRepository.findById(id);
            if (!existingRole) {
                throw new AppError('Role not found', 404);
            }

            // If name is being updated, check for conflicts
            if (updateData.name && updateData.name !== existingRole.name) {
                const roleWithSameName = await this.roleRepository.findByName(updateData.name);
                if (roleWithSameName) {
                    throw new AppError('Role with this name already exists', 400);
                }
            }

            return await this.roleRepository.update(id, updateData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update role', 500);
        }
    }

    async deleteRole(id: string): Promise<IRole | null> {
        try {
            // Check if role exists
            const existingRole = await this.roleRepository.findById(id);
            if (!existingRole) {
                throw new AppError('Role not found', 404);
            }

            // Prevent deletion of system roles (admin, user)
            if (existingRole.name === 'admin' || existingRole.name === 'user') {
                throw new AppError('Cannot delete system roles', 400);
            }

            return await this.roleRepository.remove(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to delete role', 500);
        }
    }
} 