import AWS from 'aws-sdk';
import { config } from './env';

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});

export const s3 = new AWS.S3();
export const ec2 = new AWS.EC2();