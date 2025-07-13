import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { RoleService } from '../services/roleService';
import { AppError } from '../types/error';

const roleService = new RoleService();

export const roleController = {
    // Create a new role
    createRole: asyncHandler(async (req: Request, res: Response) => {
        const { name, description } = req.body;

        if (!name) {
            throw new AppError('Role name is required', 400);
        }

        const role = await roleService.createRole({
            name,
            description
        });

        res.status(201).json({
            success: true,
            data: role,
            message: 'Role created successfully'
        });
    }),

    // Get all roles
    getAllRoles: asyncHandler(async (req: Request, res: Response) => {
        const roles = await roleService.getAllRoles();

        res.status(200).json({
            success: true,
            data: roles,
            message: 'Roles retrieved successfully'
        });
    }),

    // Get role by ID
    getRoleById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const role = await roleService.getRoleById(id);
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        res.status(200).json({
            success: true,
            data: role,
            message: 'Role retrieved successfully'
        });
    }),

    // Get role by name
    getRoleByName: asyncHandler(async (req: Request, res: Response) => {
        const { name } = req.params;

        const role = await roleService.getRoleByName(name);
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        res.status(200).json({
            success: true,
            data: role,
            message: 'Role retrieved successfully'
        });
    }),

    // Update role
    updateRole: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description } = req.body;

        const role = await roleService.updateRole(id, {
            name,
            description
        });

        if (!role) {
            throw new AppError('Role not found', 404);
        }

        res.status(200).json({
            success: true,
            data: role,
            message: 'Role updated successfully'
        });
    }),

    // Delete role
    deleteRole: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const role = await roleService.deleteRole(id);

        if (!role) {
            throw new AppError('Role not found', 404);
        }

        res.status(200).json({
            success: true,
            data: role,
            message: 'Role deleted successfully'
        });
    })
}; 