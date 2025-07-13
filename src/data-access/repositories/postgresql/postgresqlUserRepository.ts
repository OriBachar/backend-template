import { prisma } from '../../../config/database';
import { IPostgreSQLUser, UserRole } from '../../../types/user';
import { AppError } from '../../../types/error';
import * as argon2 from 'argon2';

export class PostgreSQLUserRepository {
    async create(userData: Omit<IPostgreSQLUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPostgreSQLUser> {
        try {
            const hashedPassword = await argon2.hash(userData.password);
            
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    role: userData.role as any,
                    isActive: userData.isActive ?? true
                }
            });

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role as UserRole,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                throw new AppError('Email already exists', 400);
            }
            throw new AppError('Failed to create user', 500);
        }
    }

    async findByEmail(email: string): Promise<IPostgreSQLUser | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) return null;

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role as UserRole,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw new AppError('Failed to find user', 500);
        }
    }

    async findById(id: string): Promise<IPostgreSQLUser | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) return null;

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role as UserRole,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw new AppError('Failed to find user', 500);
        }
    }

    async update(id: string, updateData: Partial<Omit<IPostgreSQLUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IPostgreSQLUser | null> {
        try {
            const updatePayload: any = { ...updateData };
            
            // Hash password if it's being updated
            if (updateData.password) {
                updatePayload.password = await argon2.hash(updateData.password);
            }

            const user = await prisma.user.update({
                where: { id },
                data: updatePayload
            });

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role as UserRole,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to update not found')) {
                return null;
            }
            throw new AppError('Failed to update user', 500);
        }
    }

    async remove(id: string): Promise<IPostgreSQLUser | null> {
        try {
            const user = await prisma.user.delete({
                where: { id }
            });

            return {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role as UserRole,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return null;
            }
            throw new AppError('Failed to delete user', 500);
        }
    }

    async find(filter?: any, options?: any): Promise<IPostgreSQLUser[]> {
        try {
            const users = await prisma.user.findMany();
            
            return users.map((user: any) => ({
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role as UserRole,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
        } catch (error) {
            throw new AppError('Failed to fetch users', 500);
        }
    }

    async exists(email: string): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            return !!user;
        } catch (error) {
            throw new AppError('Failed to check user existence', 500);
        }
    }
} 