import { prisma } from '../../../config/database';
import { IRole } from '../../../types/user';
import { AppError } from '../../../types/error';

export class PostgreSQLRoleRepository {
    async create(roleData: Omit<IRole, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<IRole> {
        try {
            const role = await prisma.role.create({
                data: {
                    name: roleData.name,
                    description: roleData.description
                }
            });

            return {
                id: role.id,
                _id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            } as IRole;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                throw new AppError('Role already exists', 400);
            }
            throw new AppError('Failed to create role', 500);
        }
    }

    async findById(id: string): Promise<IRole | null> {
        try {
            const role = await prisma.role.findUnique({
                where: { id }
            });

            if (!role) return null;

            return {
                id: role.id,
                _id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            } as IRole;
        } catch (error) {
            throw new AppError('Failed to find role', 500);
        }
    }

    async findByName(name: string): Promise<IRole | null> {
        try {
            const role = await prisma.role.findUnique({
                where: { name }
            });

            if (!role) return null;

            return {
                id: role.id,
                _id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            } as IRole;
        } catch (error) {
            throw new AppError('Failed to find role', 500);
        }
    }

    async update(id: string, updateData: Partial<Omit<IRole, 'id' | '_id' | 'createdAt' | 'updatedAt'>>): Promise<IRole | null> {
        try {
            const role = await prisma.role.update({
                where: { id },
                data: updateData
            });

            return {
                id: role.id,
                _id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            } as IRole;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to update not found')) {
                return null;
            }
            throw new AppError('Failed to update role', 500);
        }
    }

    async remove(id: string): Promise<IRole | null> {
        try {
            const role = await prisma.role.delete({
                where: { id }
            });

            return {
                id: role.id,
                _id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            } as IRole;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return null;
            }
            throw new AppError('Failed to delete role', 500);
        }
    }

    async find(filter?: any, options?: any): Promise<IRole[]> {
        try {
            const roles = await prisma.role.findMany();
            
            return roles.map((role: any) => ({
                id: role.id,
                _id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            })) as IRole[];
        } catch (error) {
            throw new AppError('Failed to fetch roles', 500);
        }
    }
} 