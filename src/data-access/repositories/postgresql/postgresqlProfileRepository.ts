import { prisma } from '../../../config/database';
import { IProfile } from '../../../types/user';
import { AppError } from '../../../types/error';

export class PostgreSQLProfileRepository {
    async create(profileData: Omit<IProfile, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<IProfile> {
        try {
            const profile = await prisma.profile.create({
                data: {
                    userId: profileData.userId,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    avatar: profileData.avatar,
                    bio: profileData.bio,
                    preferences: profileData.preferences || {}
                }
            });

            return {
                id: profile.id,
                _id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                bio: profile.bio,
                preferences: profile.preferences,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            } as IProfile;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                throw new AppError('Profile already exists for this user', 400);
            }
            throw new AppError('Failed to create profile', 500);
        }
    }

    async findById(id: string): Promise<IProfile | null> {
        try {
            const profile = await prisma.profile.findUnique({
                where: { id }
            });

            if (!profile) return null;

            return {
                id: profile.id,
                _id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                bio: profile.bio,
                preferences: profile.preferences,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            } as IProfile;
        } catch (error) {
            throw new AppError('Failed to find profile', 500);
        }
    }

    async findByUserId(userId: string): Promise<IProfile | null> {
        try {
            const profile = await prisma.profile.findUnique({
                where: { userId }
            });

            if (!profile) return null;

            return {
                id: profile.id,
                _id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                bio: profile.bio,
                preferences: profile.preferences,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            } as IProfile;
        } catch (error) {
            throw new AppError('Failed to find profile', 500);
        }
    }

    async update(id: string, updateData: Partial<Omit<IProfile, 'id' | '_id' | 'createdAt' | 'updatedAt'>>): Promise<IProfile | null> {
        try {
            const profile = await prisma.profile.update({
                where: { id },
                data: updateData
            });

            return {
                id: profile.id,
                _id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                bio: profile.bio,
                preferences: profile.preferences,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            } as IProfile;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to update not found')) {
                return null;
            }
            throw new AppError('Failed to update profile', 500);
        }
    }

    async remove(id: string): Promise<IProfile | null> {
        try {
            const profile = await prisma.profile.delete({
                where: { id }
            });

            return {
                id: profile.id,
                _id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                bio: profile.bio,
                preferences: profile.preferences,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            } as IProfile;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return null;
            }
            throw new AppError('Failed to delete profile', 500);
        }
    }

    async find(filter?: any, options?: any): Promise<IProfile[]> {
        try {
            const profiles = await prisma.profile.findMany();
            
            return profiles.map((profile: any) => ({
                id: profile.id,
                _id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                bio: profile.bio,
                preferences: profile.preferences,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            })) as IProfile[];
        } catch (error) {
            throw new AppError('Failed to fetch profiles', 500);
        }
    }
} 