import { Router } from 'express';
import { register, login, refresh } from '../controllers/authController';
import { validateRegister, validateLogin, validateRefresh } from '../middleware/validators';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'auth-service',
    message: 'Auth service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001
  });
});

router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

router.post('/refresh', validateRefresh, refresh);

export default router; 