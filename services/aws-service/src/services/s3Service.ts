import { 
    PutObjectCommand, 
    DeleteObjectCommand, 
    ListObjectsV2Command, 
    ListBucketsCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, awsSettings } from '../config/aws';
import { UploadParams, S3UploadResult, AppError } from '@microservices-backend/shared-types';

export const uploadFileToS3 = async (params: UploadParams): Promise<S3UploadResult> => {
    try {
        const bucketName = params.bucketName || awsSettings.s3.bucket;
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: params.fileName,
            Body: params.file,
            ContentType: params.contentType,
            ACL: 'public-read'
        });

        const result = await s3Client.send(command);
        
        // In v3, we need to construct the URL ourselves
        const url = `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${params.fileName}`;
        
        return {
            url: url,
            key: params.fileName,
            bucket: bucketName
        };
    } catch (error) {
        throw new AppError('Failed to upload file to S3', 500, true, { error });
    }
};

export const deleteFileFromS3 = async (fileName: string, bucketName?: string): Promise<void> => {
    try {
        const bucket = bucketName || awsSettings.s3.bucket;
        
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: fileName
        });

        await s3Client.send(command);
    } catch (error) {
        throw new AppError('Failed to delete file from S3', 500, true, { error });
    }
};

export const generateSignedUrl = async (
    fileName: string, 
    bucketName?: string, 
    expirationInSeconds = 3600
): Promise<string> => {
    try {
        const bucket = bucketName || awsSettings.s3.bucket;
        
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: fileName
        });

        return await getSignedUrl(s3Client, command, { expiresIn: expirationInSeconds });
    } catch (error) {
        throw new AppError('Failed to generate signed URL', 500, true, { error });
    }
};

export const listS3Objects = async (bucketName?: string, prefix?: string): Promise<string[]> => {
    try {
        const bucket = bucketName || awsSettings.s3.bucket;
        
        const command = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix
        });

        const result = await s3Client.send(command);
        return result.Contents?.map(obj => obj.Key || '') || [];
    } catch (error) {
        throw new AppError('Failed to list S3 objects', 500, true, { error });
    }
};

export const checkS3Health = async (): Promise<boolean> => {
    try {
        const command = new ListBucketsCommand({});
        await s3Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}; 