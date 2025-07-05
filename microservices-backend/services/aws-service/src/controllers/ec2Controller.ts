import { RequestHandler } from 'express';
import { asyncHandler } from '@microservices-backend/shared-utils';
import {
    launchEC2Instance,
    stopEC2Instance,
    startEC2Instance,
    terminateEC2Instance,
    getEC2InstanceStatus,
    listEC2Instances,
    checkEC2Health
} from '../services/ec2Service';
import { EC2InstanceParams } from '@microservices-backend/shared-types';

export const createInstance: RequestHandler = asyncHandler(async (req, res) => {
    const instanceParams: Partial<EC2InstanceParams> = req.body;

    const result = await launchEC2Instance(instanceParams);

    res.status(201).json({
        status: 'success',
        message: 'EC2 instance launched successfully',
        data: result
    });
});

export const stopInstance: RequestHandler = asyncHandler(async (req, res) => {
    const { instanceId } = req.params;

    await stopEC2Instance(instanceId);

    res.status(200).json({
        status: 'success',
        message: 'EC2 instance stopped successfully'
    });
});

export const startInstance: RequestHandler = asyncHandler(async (req, res) => {
    const { instanceId } = req.params;

    await startEC2Instance(instanceId);

    res.status(200).json({
        status: 'success',
        message: 'EC2 instance started successfully'
    });
});

export const terminateInstance: RequestHandler = asyncHandler(async (req, res) => {
    const { instanceId } = req.params;

    await terminateEC2Instance(instanceId);

    res.status(200).json({
        status: 'success',
        message: 'EC2 instance terminated successfully'
    });
});

export const getInstanceStatus: RequestHandler = asyncHandler(async (req, res) => {
    const { instanceId } = req.params;

    const instance = await getEC2InstanceStatus(instanceId);

    res.status(200).json({
        status: 'success',
        message: 'Instance status retrieved successfully',
        data: instance
    });
});

export const getAllInstances: RequestHandler = asyncHandler(async (req, res) => {
    const instances = await listEC2Instances();

    res.status(200).json({
        status: 'success',
        message: 'Instances listed successfully',
        data: { instances }
    });
});

export const getEC2Health: RequestHandler = asyncHandler(async (req, res) => {
    const isHealthy = await checkEC2Health();

    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'success' : 'error',
        message: `EC2 service is ${isHealthy ? 'healthy' : 'unhealthy'}`,
        data: { healthy: isHealthy }
    });
}); 