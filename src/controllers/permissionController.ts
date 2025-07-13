import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { PermissionService } from '../services/permissionService';
import { AppError } from '../types/error';

const permissionService = new PermissionService();

export const permissionController = {
    // Create a new permission
    createPermission: asyncHandler(async (req: Request, res: Response) => {
        const { name, description, resource, action } = req.body;

        if (!name || !resource || !action) {
            throw new AppError('Permission name, resource, and action are required', 400);
        }

        const permission = await permissionService.createPermission({
            name,
            description,
            resource,
            action
        });

        res.status(201).json({
            success: true,
            data: permission,
            message: 'Permission created successfully'
        });
    }),

    // Get all permissions
    getAllPermissions: asyncHandler(async (req: Request, res: Response) => {
        const permissions = await permissionService.getAllPermissions();

        res.status(200).json({
            success: true,
            data: permissions,
            message: 'Permissions retrieved successfully'
        });
    }),

    // Get permission by ID
    getPermissionById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const permission = await permissionService.getPermissionById(id);
        if (!permission) {
            throw new AppError('Permission not found', 404);
        }

        res.status(200).json({
            success: true,
            data: permission,
            message: 'Permission retrieved successfully'
        });
    }),

    // Get permission by name
    getPermissionByName: asyncHandler(async (req: Request, res: Response) => {
        const { name } = req.params;

        const permission = await permissionService.getPermissionByName(name);
        if (!permission) {
            throw new AppError('Permission not found', 404);
        }

        res.status(200).json({
            success: true,
            data: permission,
            message: 'Permission retrieved successfully'
        });
    }),

    // Get permissions by resource
    getPermissionsByResource: asyncHandler(async (req: Request, res: Response) => {
        const { resource } = req.params;

        const permissions = await permissionService.getPermissionsByResource(resource);

        res.status(200).json({
            success: true,
            data: permissions,
            message: 'Permissions retrieved successfully'
        });
    }),

    // Update permission
    updatePermission: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description, resource, action } = req.body;

        const permission = await permissionService.updatePermission(id, {
            name,
            description,
            resource,
            action
        });

        if (!permission) {
            throw new AppError('Permission not found', 404);
        }

        res.status(200).json({
            success: true,
            data: permission,
            message: 'Permission updated successfully'
        });
    }),

    // Delete permission
    deletePermission: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const permission = await permissionService.deletePermission(id);

        if (!permission) {
            throw new AppError('Permission not found', 404);
        }

        res.status(200).json({
            success: true,
            data: permission,
            message: 'Permission deleted successfully'
        });
    })
}; 