import {
    PutObjectCommand,
    DeleteObjectCommand,
    ListBucketsCommand
} from '@aws-sdk/client-s3';
import {
    RunInstancesCommand,
    StopInstancesCommand,
    StartInstancesCommand,
    DescribeInstancesCommand
} from '@aws-sdk/client-ec2';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, ec2Client } from '../config/aws';
import { AppError } from '../types/error';
import { EC2InstanceParams } from '../types/ec2InstanceParams';
import { UploadParams } from '../types/uploadParams';

export const uploadToS3 = async ({ file, fileName, contentType, bucketName }: UploadParams): Promise<string> => {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file,
            ContentType: contentType,
            ACL: 'public-read'
        });

        await s3Client.send(command);
        return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
        throw new AppError('Failed to upload file to S3', 500);
    }
};

export const deleteFromS3 = async (bucketName: string, fileName: string): Promise<void> => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName
        });

        await s3Client.send(command);
    } catch (error) {
        throw new AppError('Failed to delete file from S3', 500);
    }
};

export const getSignedUrlForS3 = async (bucketName: string, fileName: string, expirationInSeconds = 3600): Promise<string> => {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName
        });

        return await getSignedUrl(s3Client, command, { expiresIn: expirationInSeconds });
    } catch (error) {
        throw new AppError('Failed to generate signed URL', 500);
    }
};

export const launchEC2Instance = async (params: EC2InstanceParams): Promise<string> => {
    try {
        const command = new RunInstancesCommand({
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
        });

        const result = await ec2Client.send(command);
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
        const command = new StopInstancesCommand({
            InstanceIds: [instanceId]
        });

        await ec2Client.send(command);
    } catch (error) {
        throw new AppError('Failed to stop EC2 instance', 500);
    }
};

export const startEC2Instance = async (instanceId: string): Promise<void> => {
    try {
        const command = new StartInstancesCommand({
            InstanceIds: [instanceId]
        });

        await ec2Client.send(command);
    } catch (error) {
        throw new AppError('Failed to start EC2 instance', 500);
    }
};

export const getEC2InstanceStatus = async (instanceId: string): Promise<string> => {
    try {
        const command = new DescribeInstancesCommand({
            InstanceIds: [instanceId]
        });

        const result = await ec2Client.send(command);
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
        const listBucketsCommand = new ListBucketsCommand({});
        await s3Client.send(listBucketsCommand);

        const describeInstancesCommand = new DescribeInstancesCommand({});
        await ec2Client.send(describeInstancesCommand);

        return true;
    } catch (error) {
        return false;
    }
};