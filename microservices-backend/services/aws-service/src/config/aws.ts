import { S3Client } from '@aws-sdk/client-s3';
import { EC2Client } from '@aws-sdk/client-ec2';
import { getEnv } from '@microservices-backend/shared-config';

// AWS Configuration
const awsConfig = {
    credentials: {
        accessKeyId: getEnv('AWS_ACCESS_KEY_ID', true),
        secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', true),
    },
    region: getEnv('AWS_REGION', true)
};

// Create clients
export const s3Client = new S3Client(awsConfig);
export const ec2Client = new EC2Client(awsConfig);

export const awsSettings = {
    s3: {
        bucket: getEnv('AWS_S3_BUCKET', true)
    },
    ec2: {
        imageId: getEnv('AWS_EC2_IMAGE_ID', true),
        instanceType: getEnv('AWS_EC2_INSTANCE_TYPE') || 't2.micro',
        minCount: parseInt(getEnv('AWS_EC2_MIN_COUNT') || '1'),
        maxCount: parseInt(getEnv('AWS_EC2_MAX_COUNT') || '1'),
        keyName: getEnv('AWS_EC2_KEY_NAME'),
        securityGroupIds: getEnv('AWS_EC2_SECURITY_GROUP_IDS') ?
            getEnv('AWS_EC2_SECURITY_GROUP_IDS').split(',') : undefined
    },
    git: {
        repoUrl: getEnv('GITHUB_REPO_URL', true)
    }
}; 