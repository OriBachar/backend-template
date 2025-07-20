import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnv = (key: string, required = false): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new Error(`Environment variable ${key} is required`);
    }
    return value || '';
}

export const config = {
    server: {
        port: getEnv('AUTH_SERVICE_PORT') || '3001',
        env: getEnv('NODE_ENV') || 'development',
        whitelist: getEnv('CORS_WHITELIST') ? getEnv('CORS_WHITELIST').split(',') : []
    },
    mongodb: {
        uri: `${getEnv('MONGODB_URI')}/${getEnv('MONGODB_DATABASE')}`,
        dbName: getEnv('MONGODB_DATABASE', true)
    },
    jwt: {
        secret: getEnv('JWT_SECRET', true),
        accessTokenExpiry: getEnv('JWT_ACCESS_TOKEN_EXPIRY') || '15m',
        refreshTokenExpiry: getEnv('JWT_REFRESH_TOKEN_EXPIRY') || '7d'
    },
    aws: {
        accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
        region: getEnv('AWS_REGION'),
        s3Bucket: getEnv('AWS_S3_BUCKET'),
        ec2: {
            imageId: getEnv('AWS_EC2_IMAGE_ID'),
            instanceType: getEnv('AWS_EC2_INSTANCE_TYPE') || 't2.micro',
            minCount: parseInt(getEnv('AWS_EC2_MIN_COUNT') || '1'),
            maxCount: parseInt(getEnv('AWS_EC2_MAX_COUNT') || '1'),
            keyName: getEnv('AWS_EC2_KEY_NAME'),
            securityGroupIds: getEnv('AWS_EC2_SECURITY_GROUP_IDS') ?
                getEnv('AWS_EC2_SECURITY_GROUP_IDS').split(',') : undefined
        }
    },
    git: {
        repoUrl: getEnv('GITHUB_REPO_URL', true)
    }
};