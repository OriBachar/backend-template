import { Router } from 'express';
import { register, login, refresh } from '../controllers/authController';
import { validateRegister, validateLogin, validateRefresh } from '../middleware/validators';

const router = Router();

router.post('/auth/register', validateRegister, register);

router.post('/auth/login', validateLogin, login);

router.post('/auth/refresh', validateRefresh, refresh);

export default router; 