import { Router } from 'express';
import { permissionController } from '../controllers/permissionController';
import { auth } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - name
 *         - resource
 *         - action
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the permission
 *         name:
 *           type: string
 *           description: The name of the permission
 *         description:
 *           type: string
 *           description: The description of the permission
 *         resource:
 *           type: string
 *           description: The resource this permission applies to
 *         action:
 *           type: string
 *           description: The action this permission allows
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, permissionController.getAllPermissions);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - resource
 *               - action
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the permission
 *               description:
 *                 type: string
 *                 description: The description of the permission
 *               resource:
 *                 type: string
 *                 description: The resource this permission applies to
 *               action:
 *                 type: string
 *                 description: The action this permission allows
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth, permissionController.createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       404:
 *         description: Permission not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, permissionController.getPermissionById);

/**
 * @swagger
 * /api/permissions/name/{name}:
 *   get:
 *     summary: Get permission by name
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission name
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       404:
 *         description: Permission not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/name/:name', auth, permissionController.getPermissionByName);

/**
 * @swagger
 * /api/permissions/resource/{resource}:
 *   get:
 *     summary: Get permissions by resource
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource name
 *     responses:
 *       200:
 *         description: Permissions for the resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/resource/:resource', auth, permissionController.getPermissionsByResource);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the permission
 *               description:
 *                 type: string
 *                 description: The description of the permission
 *               resource:
 *                 type: string
 *                 description: The resource this permission applies to
 *               action:
 *                 type: string
 *                 description: The action this permission allows
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, permissionController.updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete system permissions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, permissionController.deletePermission);

export default router; 