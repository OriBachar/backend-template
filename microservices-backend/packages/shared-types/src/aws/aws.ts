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

export interface UploadParams {
    file: Buffer | Uint8Array;
    fileName: string;
    contentType: string;
    bucketName: string;
}

export interface S3UploadResult {
    url: string;
    key: string;
    bucket: string;
}

export interface EC2InstanceResult {
    instanceId: string;
    state: string;
    publicIp?: string;
    privateIp?: string;
} 