import { Router } from 'express';
import {
    getUser,
    getUserProfile,
    updateProfile,
    removeUser,
    getUsers,
    getStatistics,
    updateUserRole
} from '../controllers/userController';
import {
    validateUserId,
    validateEmail,
    validateUpdateProfile,
    validateSearchQuery,
    validateUpdateRole
} from '../middleware/validators';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        service: 'user-service',
        message: 'User service is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.USER_SERVICE_PORT || 3002
    });
});

// User management routes
router.get('/users', validateSearchQuery, getUsers);
router.get('/users/stats', getStatistics);
router.get('/users/:userId', validateUserId, getUser);
router.get('/users/profile/:email', validateEmail, getUserProfile);
router.put('/users/:userId', validateUserId, validateUpdateProfile, updateProfile);
router.delete('/users/:userId', validateUserId, removeUser);
router.patch('/users/:userId/role', validateUserId, validateUpdateRole, updateUserRole);

export default router; 