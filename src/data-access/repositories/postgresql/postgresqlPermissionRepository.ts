import { prisma } from '../../../config/database';
import { IPermission } from '../../../types/user';
import { AppError } from '../../../types/error';

export class PostgreSQLPermissionRepository {
    async create(permissionData: Omit<IPermission, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<IPermission> {
        try {
            const permission = await prisma.permission.create({
                data: {
                    name: permissionData.name,
                    description: permissionData.description,
                    resource: permissionData.resource,
                    action: permissionData.action
                }
            });

            return {
                id: permission.id,
                _id: permission.id,
                name: permission.name,
                description: permission.description,
                resource: permission.resource,
                action: permission.action,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt
            } as IPermission;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                throw new AppError('Permission already exists', 400);
            }
            throw new AppError('Failed to create permission', 500);
        }
    }

    async findById(id: string): Promise<IPermission | null> {
        try {
            const permission = await prisma.permission.findUnique({
                where: { id }
            });

            if (!permission) return null;

            return {
                id: permission.id,
                _id: permission.id,
                name: permission.name,
                description: permission.description,
                resource: permission.resource,
                action: permission.action,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt
            } as IPermission;
        } catch (error) {
            throw new AppError('Failed to find permission', 500);
        }
    }

    async findByName(name: string): Promise<IPermission | null> {
        try {
            const permission = await prisma.permission.findUnique({
                where: { name }
            });

            if (!permission) return null;

            return {
                id: permission.id,
                _id: permission.id,
                name: permission.name,
                description: permission.description,
                resource: permission.resource,
                action: permission.action,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt
            } as IPermission;
        } catch (error) {
            throw new AppError('Failed to find permission', 500);
        }
    }

    async update(id: string, updateData: Partial<Omit<IPermission, 'id' | '_id' | 'createdAt' | 'updatedAt'>>): Promise<IPermission | null> {
        try {
            const permission = await prisma.permission.update({
                where: { id },
                data: updateData
            });

            return {
                id: permission.id,
                _id: permission.id,
                name: permission.name,
                description: permission.description,
                resource: permission.resource,
                action: permission.action,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt
            } as IPermission;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to update not found')) {
                return null;
            }
            throw new AppError('Failed to update permission', 500);
        }
    }

    async remove(id: string): Promise<IPermission | null> {
        try {
            const permission = await prisma.permission.delete({
                where: { id }
            });

            return {
                id: permission.id,
                _id: permission.id,
                name: permission.name,
                description: permission.description,
                resource: permission.resource,
                action: permission.action,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt
            } as IPermission;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return null;
            }
            throw new AppError('Failed to delete permission', 500);
        }
    }

    async find(filter?: any, options?: any): Promise<IPermission[]> {
        try {
            const permissions = await prisma.permission.findMany();
            
            return permissions.map((permission: any) => ({
                id: permission.id,
                _id: permission.id,
                name: permission.name,
                description: permission.description,
                resource: permission.resource,
                action: permission.action,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt
            })) as IPermission[];
        } catch (error) {
            throw new AppError('Failed to fetch permissions', 500);
        }
    }
} 