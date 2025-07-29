import { _InstanceType } from '@aws-sdk/client-ec2';

export interface EC2InstanceParams {
    imageId: string;
    instanceType: _InstanceType;
    minCount: number;
    maxCount: number;
    keyName?: string;
    securityGroupIds?: string[];
    userData: string;
    tags?: {
        Key: string;
        Value: string;
    }[];
}