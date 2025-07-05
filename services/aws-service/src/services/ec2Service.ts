import { 
    RunInstancesCommand, 
    StopInstancesCommand, 
    StartInstancesCommand, 
    TerminateInstancesCommand, 
    DescribeInstancesCommand,
    RunInstancesCommandInput,
    DescribeInstancesCommandOutput,
    _InstanceType
} from '@aws-sdk/client-ec2';
import { ec2Client, awsSettings } from '../config/aws';
import { EC2InstanceParams, EC2InstanceResult, AppError } from '@microservices-backend/shared-types';

export const launchEC2Instance = async (params?: Partial<EC2InstanceParams>): Promise<EC2InstanceResult> => {
    try {
        const instanceParams: RunInstancesCommandInput = {
            ImageId: params?.imageId || awsSettings.ec2.imageId,
            InstanceType: (params?.instanceType || awsSettings.ec2.instanceType) as _InstanceType,
            MinCount: params?.minCount || awsSettings.ec2.minCount,
            MaxCount: params?.maxCount || awsSettings.ec2.maxCount,
            KeyName: params?.keyName || awsSettings.ec2.keyName,
            SecurityGroupIds: params?.securityGroupIds || awsSettings.ec2.securityGroupIds,
            UserData: params?.userData,
            TagSpecifications: params?.tags ? [
                {
                    ResourceType: 'instance',
                    Tags: params.tags
                }
            ] : undefined
        };

        const command = new RunInstancesCommand(instanceParams);
        const result = await ec2Client.send(command);
        const instance = result.Instances?.[0];

        if (!instance?.InstanceId) {
            throw new AppError('Failed to get instance ID', 500);
        }

        return {
            instanceId: instance.InstanceId,
            state: instance.State?.Name || 'unknown',
            publicIp: instance.PublicIpAddress,
            privateIp: instance.PrivateIpAddress
        };
    } catch (error) {
        throw new AppError('Failed to launch EC2 instance', 500, true, { error });
    }
};

export const stopEC2Instance = async (instanceId: string): Promise<void> => {
    try {
        const command = new StopInstancesCommand({
            InstanceIds: [instanceId]
        });
        await ec2Client.send(command);
    } catch (error) {
        throw new AppError('Failed to stop EC2 instance', 500, true, { error });
    }
};

export const startEC2Instance = async (instanceId: string): Promise<void> => {
    try {
        const command = new StartInstancesCommand({
            InstanceIds: [instanceId]
        });
        await ec2Client.send(command);
    } catch (error) {
        throw new AppError('Failed to start EC2 instance', 500, true, { error });
    }
};

export const terminateEC2Instance = async (instanceId: string): Promise<void> => {
    try {
        const command = new TerminateInstancesCommand({
            InstanceIds: [instanceId]
        });
        await ec2Client.send(command);
    } catch (error) {
        throw new AppError('Failed to terminate EC2 instance', 500, true, { error });
    }
};

export const getEC2InstanceStatus = async (instanceId: string): Promise<EC2InstanceResult> => {
    try {
        const command = new DescribeInstancesCommand({
            InstanceIds: [instanceId]
        });
        const result = await ec2Client.send(command);

        const instance = result.Reservations?.[0]?.Instances?.[0];
        
        if (!instance) {
            throw new AppError('Instance not found', 404);
        }

        return {
            instanceId: instance.InstanceId || instanceId,
            state: instance.State?.Name || 'unknown',
            publicIp: instance.PublicIpAddress,
            privateIp: instance.PrivateIpAddress
        };
    } catch (error) {
        throw new AppError('Failed to get EC2 instance status', 500, true, { error });
    }
};

export const listEC2Instances = async (): Promise<EC2InstanceResult[]> => {
    try {
        const command = new DescribeInstancesCommand({});
        const result = await ec2Client.send(command);
        const instances: EC2InstanceResult[] = [];

        result.Reservations?.forEach(reservation => {
            reservation.Instances?.forEach(instance => {
                if (instance.InstanceId) {
                    instances.push({
                        instanceId: instance.InstanceId,
                        state: instance.State?.Name || 'unknown',
                        publicIp: instance.PublicIpAddress,
                        privateIp: instance.PrivateIpAddress
                    });
                }
            });
        });

        return instances;
    } catch (error) {
        throw new AppError('Failed to list EC2 instances', 500, true, { error });
    }
};

export const checkEC2Health = async (): Promise<boolean> => {
    try {
        const command = new DescribeInstancesCommand({});
        await ec2Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}; 