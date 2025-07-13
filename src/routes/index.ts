import { Router } from 'express';
import authRoutes from './authRoutes';
import roleRoutes from './roleRoutes';
import permissionRoutes from './permissionRoutes';
import profileRoutes from './profileRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/profiles', profileRoutes);

export default router;
