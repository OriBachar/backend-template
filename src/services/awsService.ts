import { S3, EC2 } from 'aws-sdk';
import { s3, ec2 } from '../config/aws';
import { AppError } from '../types/error';
import { EC2InstanceParams } from '../types/ec2InstanceParams';
import { UploadParams } from '../types/uploadParams';

export const uploadToS3 = async ({ file, fileName, contentType, bucketName }: UploadParams): Promise<string> => {
    try {
        const params: S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: fileName,
            Body: file,
            ContentType: contentType,
            ACL: 'public-read'
        };

        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        throw new AppError('Failed to upload file to S3', 500);
    }
};

export const deleteFromS3 = async (bucketName: string, fileName: string): Promise<void> => {
    try {
        const params: S3.DeleteObjectRequest = {
            Bucket: bucketName,
            Key: fileName
        };

        await s3.deleteObject(params).promise();
    } catch (error) {
        throw new AppError('Failed to delete file from S3', 500);
    }
};

export const getSignedUrl = async (bucketName: string, fileName: string, expirationInSeconds = 3600): Promise<string> => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Expires: expirationInSeconds
        };

        return s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
        throw new AppError('Failed to generate signed URL', 500);
    }
};

export const launchEC2Instance = async (params: EC2InstanceParams): Promise<string> => {
    try {
        const ec2Params: EC2.RunInstancesRequest = {
            ImageId: params.imageId,
            InstanceType: params.instanceType,
            MinCount: params.minCount,
            MaxCount: params.maxCount,
            KeyName: params.keyName,
            SecurityGroupIds: params.securityGroupIds,
            UserData: params.userData,
            TagSpecifications: params.tags ? [
                {
                    ResourceType: 'instance',
                    Tags: params.tags
                }
            ] : undefined
        };

        const result = await ec2.runInstances(ec2Params).promise();
        const instanceId = result.Instances?.[0]?.InstanceId;

        if (!instanceId) {
            throw new AppError('Failed to get instance ID', 500);
        }

        return instanceId;
    } catch (error) {
        throw new AppError('Failed to launch EC2 instance', 500);
    }
};
export const stopEC2Instance = async (instanceId: string): Promise<void> => {
    try {
        await ec2.stopInstances({
            InstanceIds: [instanceId]
        }).promise();
    } catch (error) {
        throw new AppError('Failed to stop EC2 instance', 500);
    }
};

export const startEC2Instance = async (instanceId: string): Promise<void> => {
    try {
        await ec2.startInstances({
            InstanceIds: [instanceId]
        }).promise();
    } catch (error) {
        throw new AppError('Failed to start EC2 instance', 500);
    }
};

export const getEC2InstanceStatus = async (instanceId: string): Promise<string> => {
    try {
        const result = await ec2.describeInstances({
            InstanceIds: [instanceId]
        }).promise();

        const status = result.Reservations?.[0]?.Instances?.[0]?.State?.Name;
        if (!status) {
            throw new AppError('Failed to get instance status', 500);
        }

        return status;
    } catch (error) {
        throw new AppError('Failed to get EC2 instance status', 500);
    }
};

export const checkAWSServices = async (): Promise<boolean> => {
    try {
        await s3.listBuckets().promise();

        await ec2.describeInstances().promise();

        return true;
    } catch (error) {
        return false;
    }
};