import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validators'

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 minLength: 1
 *                 maxLength: 255
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 minLength: 8
 *                 maxLength: 100
 *                 pattern: ^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,100}$
 *                 example: Password123!
 *                 x-pattern-description: |
 *                   Password must contain:
 *                   - At least 8 characters
 *                   - At least one uppercase letter
 *                   - At least one lowercase letter
 *                   - At least one number
 *                   - At least one special character
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 minLength: 1
 *                 maxLength: 255
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 minLength: 8
 *                 maxLength: 100
 *                 pattern: ^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,100}$
 *                 example: Password123!
 *                 x-pattern-description: |
 *                   Password must contain:
 *                   - At least 8 characters
 *                   - At least one uppercase letter
 *                   - At least one lowercase letter
 *                   - At least one number
 *                   - At least one special character
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, login);

export default router;