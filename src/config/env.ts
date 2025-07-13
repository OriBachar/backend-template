import dotenv from 'dotenv';
import path from 'path';
import { AppError } from '../types/error';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnv = (key: string, required = false): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new AppError(`Environment variable ${key} is required`, 500);
    }
    return value || '';
}

export const config = {
    server: {
        port: getEnv('PORT') || '3000',
        env: getEnv('NODE_ENV') || 'development',
        whitelist: getEnv('CORS_WHITELIST') ? getEnv('CORS_WHITELIST').split(',') : []
    },
    database: {
        type: getEnv('DATABASE_TYPE') || 'mongodb', // 'mongodb' or 'postgresql'
        mongodb: {
            uri: getEnv('MONGODB_URI'),
            dbName: getEnv('DB_NAME')
        },
        postgresql: {
            url: getEnv('DATABASE_URL')
        }
    },
    jwt: {
        secret: getEnv('JWT_SECRET', true)
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