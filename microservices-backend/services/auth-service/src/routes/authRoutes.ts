import { Router } from 'express';
import { register, login, refresh } from '../controllers/authController';
import { validateRegister, validateLogin, validateRefresh } from '../middleware/validators';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.post('/auth/register', validateRegister, register);

router.post('/auth/login', validateLogin, login);

router.post('/auth/refresh', validateRefresh, refresh);

export default router; 