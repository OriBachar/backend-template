import { RequestHandler } from 'express';
import { asyncHandler } from '@microservices-backend/shared-utils';
import { 
    getUserById, 
    getUserByEmail, 
    updateUserProfile, 
    deleteUser, 
    searchUsers, 
    getUserStats,
    changeUserRole,
    UserSearchParams 
} from '../services/userService';
import { UserRole } from '@microservices-backend/shared-types';

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await getUserById(userId);
    
    res.status(200).json({
        status: 'success',
        message: 'User retrieved successfully',
        data: user
    });
});

export const getUserProfile: RequestHandler = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    
    res.status(200).json({
        status: 'success',
        message: 'User profile retrieved successfully',
        data: user
    });
});

export const updateProfile: RequestHandler = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    
    const updatedUser = await updateUserProfile(userId, updateData);
    
    res.status(200).json({
        status: 'success',
        message: 'User profile updated successfully',
        data: updatedUser
    });
});

export const removeUser: RequestHandler = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    await deleteUser(userId);
    
    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
    });
});

export const getUsers: RequestHandler = asyncHandler(async (req, res) => {
    const searchParams: UserSearchParams = {
        search: req.query.search as string,
        role: req.query.role as UserRole,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };
    
    const result = await searchUsers(searchParams);
    
    res.status(200).json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: result.data,
        pagination: result.pagination
    });
});

export const getStatistics: RequestHandler = asyncHandler(async (req, res) => {
    const stats = await getUserStats();
    
    res.status(200).json({
        status: 'success',
        message: 'User statistics retrieved successfully',
        data: stats
    });
});

export const updateUserRole: RequestHandler = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid role provided'
        });
    }
    
    const updatedUser = await changeUserRole(userId, role);
    
    res.status(200).json({
        status: 'success',
        message: 'User role updated successfully',
        data: updatedUser
    });
}); 