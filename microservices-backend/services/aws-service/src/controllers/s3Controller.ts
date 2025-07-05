import { RequestHandler } from 'express';
import { asyncHandler } from '@microservices-backend/shared-utils';
import {
    uploadFileToS3,
    deleteFileFromS3,
    generateSignedUrl,
    listS3Objects,
    checkS3Health
} from '../services/s3Service';
import { UploadParams } from '@microservices-backend/shared-types';

export const uploadFile: RequestHandler = asyncHandler(async (req, res) => {
    const { fileName, contentType, bucketName, fileData } = req.body;
    
    // For now, expect base64 file data in the request body
    // After multer is set up, this will use req.file?.buffer
    if (!fileData) {
        return res.status(400).json({
            status: 'error',
            message: 'No file data provided. Please provide base64 encoded file in fileData field'
        });
    }

    const file = Buffer.from(fileData, 'base64');

    const uploadParams: UploadParams = {
        file,
        fileName,
        contentType,
        bucketName
    };

    const result = await uploadFileToS3(uploadParams);

    res.status(200).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: result
    });
});

export const deleteFile: RequestHandler = asyncHandler(async (req, res) => {
    const { fileName, bucketName } = req.body;

    await deleteFileFromS3(fileName, bucketName);

    res.status(200).json({
        status: 'success',
        message: 'File deleted successfully'
    });
});

export const getSignedUrl: RequestHandler = asyncHandler(async (req, res) => {
    const { fileName, bucketName, expirationInSeconds } = req.body;

    const signedUrl = await generateSignedUrl(fileName, bucketName, expirationInSeconds);

    res.status(200).json({
        status: 'success',
        message: 'Signed URL generated successfully',
        data: { signedUrl }
    });
});

export const listFiles: RequestHandler = asyncHandler(async (req, res) => {
    const { bucketName, prefix } = req.query;

    const files = await listS3Objects(
        bucketName as string,
        prefix as string
    );

    res.status(200).json({
        status: 'success',
        message: 'Files listed successfully',
        data: { files }
    });
});

export const getS3Health: RequestHandler = asyncHandler(async (req, res) => {
    const isHealthy = await checkS3Health();

    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'success' : 'error',
        message: `S3 service is ${isHealthy ? 'healthy' : 'unhealthy'}`,
        data: { healthy: isHealthy }
    });
}); 