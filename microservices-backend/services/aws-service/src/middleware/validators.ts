import { z } from 'zod';
import { RequestHandler } from 'express';
import { handleValidationError } from '@microservices-backend/shared-utils';

// S3 Upload validation
export const uploadFileSchema = z.object({
    fileName: z.string().min(1, 'File name is required'),
    contentType: z.string().min(1, 'Content type is required'),
    bucketName: z.string().min(1, 'Bucket name is required').optional()
});

// S3 Delete validation
export const deleteFileSchema = z.object({
    fileName: z.string().min(1, 'File name is required'),
    bucketName: z.string().min(1, 'Bucket name is required').optional()
});

// S3 Signed URL validation
export const signedUrlSchema = z.object({
    fileName: z.string().min(1, 'File name is required'),
    bucketName: z.string().min(1, 'Bucket name is required').optional(),
    expirationInSeconds: z.number().positive().optional()
});

// EC2 Instance validation
export const ec2InstanceSchema = z.object({
    imageId: z.string().min(1, 'Image ID is required').optional(),
    instanceType: z.string().min(1, 'Instance type is required').optional(),
    minCount: z.number().positive().optional(),
    maxCount: z.number().positive().optional(),
    keyName: z.string().optional(),
    securityGroupIds: z.array(z.string()).optional(),
    userData: z.string().optional(),
    tags: z.array(z.object({
        Key: z.string(),
        Value: z.string()
    })).optional()
});

// Instance ID validation
export const instanceIdSchema = z.object({
    instanceId: z.string().min(1, 'Instance ID is required')
});

// Deployment validation
export const deploymentSchema = z.object({
    projectName: z.string().min(1, 'Project name is required').optional(),
    environment: z.string().min(1, 'Environment is required').optional()
});

// Validation middleware creators
const validateBody = (schema: z.ZodSchema): RequestHandler => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

const validateParams = (schema: z.ZodSchema): RequestHandler => (req, res, next) => {
    try {
        schema.parse(req.params);
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

const validateQuery = (schema: z.ZodSchema): RequestHandler => (req, res, next) => {
    try {
        schema.parse(req.query);
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

// Middleware exports
export const validateUploadFile = validateBody(uploadFileSchema);
export const validateDeleteFile = validateBody(deleteFileSchema);
export const validateSignedUrl = validateBody(signedUrlSchema);
export const validateEC2Instance = validateBody(ec2InstanceSchema);
export const validateInstanceId = validateParams(instanceIdSchema);
export const validateDeployment = validateBody(deploymentSchema); 