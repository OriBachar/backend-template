export interface EC2InstanceParams {
    imageId: string;
    instanceType: string;
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