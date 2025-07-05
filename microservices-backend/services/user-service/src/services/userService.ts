import { userRepository } from '../repositories/userRepository';
import { IUser, AppError, UserRole, ApiResponse, PaginatedResponse } from '@microservices-backend/shared-types';

export interface UserProfileData {
    email?: string;
    role?: UserRole;
}

export interface UserSearchParams {
    search?: string;
    role?: UserRole;
    page?: number;
    limit?: number;
}

export const getUserById = async (userId: string): Promise<IUser> => {
    const user = await userRepository.findById(userId);
    
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword as IUser;
};

export const getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword as IUser;
};

export const updateUserProfile = async (userId: string, updateData: UserProfileData): Promise<IUser> => {
    // Check if user exists
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
        throw new AppError('User not found', 404);
    }

    // If email is being updated, check if it's already taken
    if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await userRepository.exists(updateData.email);
        if (emailExists) {
            throw new AppError('Email already in use', 409);
        }
    }

    const updatedUser = await userRepository.updateProfile(userId, updateData);
    
    if (!updatedUser) {
        throw new AppError('Failed to update user profile', 500);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword as IUser;
};

export const deleteUser = async (userId: string): Promise<void> => {
    const user = await userRepository.findById(userId);
    
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const deletedUser = await userRepository.remove(userId);
    
    if (!deletedUser) {
        throw new AppError('Failed to delete user', 500);
    }
};

export const searchUsers = async (params: UserSearchParams): Promise<PaginatedResponse<Omit<IUser, 'password'>>> => {
    const { search, role, page = 1, limit = 10 } = params;

    let result;

    if (search) {
        result = await userRepository.searchUsers(search, page, limit);
    } else if (role) {
        const users = await userRepository.findByRole(role);
        // Simple pagination for role-based search
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        result = {
            data: users.slice(startIndex, endIndex),
            total: users.length,
            page,
            totalPages: Math.ceil(users.length / limit)
        };
    } else {
        result = await userRepository.getActiveUsers(page, limit);
    }

    // Remove passwords from all users
    const usersWithoutPasswords = result.data.map(user => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    });

    return {
        data: usersWithoutPasswords,
        pagination: {
            page: result.page,
            limit,
            total: result.total,
            totalPages: result.totalPages
        }
    };
};

export const getUserStats = async (): Promise<{ totalUsers: number; usersByRole: Record<string, number> }> => {
    const totalUsers = await userRepository.count({});
    
    // Get counts by role
    const userRoles = Object.values(UserRole);
    const usersByRole: Record<string, number> = {};
    
    for (const role of userRoles) {
        const count = await userRepository.count({ role });
        usersByRole[role] = count;
    }

    return {
        totalUsers,
        usersByRole
    };
};

export const changeUserRole = async (userId: string, newRole: UserRole): Promise<IUser> => {
    const user = await userRepository.findById(userId);
    
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const updatedUser = await userRepository.update(userId, { role: newRole });
    
    if (!updatedUser) {
        throw new AppError('Failed to update user role', 500);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword as IUser;
}; 