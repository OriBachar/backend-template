import { RequestHandler } from 'express';
import { asyncHandler } from '@microservices-backend/shared-utils';
import {
    deployToEC2,
    createCustomDeployment,
    DeploymentOptions
} from '../services/deploymentService';

export const deployApplication: RequestHandler = asyncHandler(async (req, res) => {
    const deploymentOptions: DeploymentOptions = req.body;

    const result = await deployToEC2(deploymentOptions);

    res.status(201).json({
        status: 'success',
        message: 'Application deployed successfully',
        data: result
    });
});

export const createCustomDeploy: RequestHandler = asyncHandler(async (req, res) => {
    const { userData, instanceParams, tags } = req.body;

    if (!userData) {
        return res.status(400).json({
            status: 'error',
            message: 'User data script is required for custom deployment'
        });
    }

    const result = await createCustomDeployment(userData, instanceParams, tags);

    res.status(201).json({
        status: 'success',
        message: 'Custom deployment created successfully',
        data: result
    });
}); 