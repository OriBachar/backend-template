import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EC2Client, RunInstancesCommand, DescribeInstancesCommand, TerminateInstancesCommand } from '@aws-sdk/client-ec2';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private ec2Client: EC2Client;
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('aws.region');
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not properly configured');
    }

    this.ec2Client = new EC2Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async createEC2Instance(instanceParams: any) {
    try {
      const command = new RunInstancesCommand({
        ImageId: instanceParams.imageId || this.configService.get<string>('aws.ec2.imageId'),
        InstanceType: instanceParams.instanceType || this.configService.get<string>('aws.ec2.instanceType'),
        MinCount: instanceParams.minCount || this.configService.get<number>('aws.ec2.minCount'),
        MaxCount: instanceParams.maxCount || this.configService.get<number>('aws.ec2.maxCount'),
        KeyName: instanceParams.keyName || this.configService.get<string>('aws.ec2.keyName'),
        SecurityGroupIds: instanceParams.securityGroupIds || this.configService.get<string[]>('aws.ec2.securityGroupIds'),
        TagSpecifications: [
          {
            ResourceType: 'instance',
            Tags: [
              {
                Key: 'Name',
                Value: instanceParams.name || 'NestJS-Created-Instance',
              },
              {
                Key: 'CreatedBy',
                Value: 'NestJS-Backend',
              },
            ],
          },
        ],
      });

      const response = await this.ec2Client.send(command);
      this.logger.log(`EC2 instance created: ${response.Instances?.[0]?.InstanceId}`);
      return response.Instances?.[0];
    } catch (error) {
      this.logger.error(`Failed to create EC2 instance: ${error.message}`);
      throw new Error(`Failed to create EC2 instance: ${error.message}`);
    }
  }

  async describeInstances(instanceIds?: string[]) {
    try {
      const command = new DescribeInstancesCommand({
        InstanceIds: instanceIds,
      });

      const response = await this.ec2Client.send(command);
      const instances = response.Reservations?.flatMap(reservation => reservation.Instances || []);
      this.logger.log(`Retrieved ${instances?.length || 0} instances`);
      return instances;
    } catch (error) {
      this.logger.error(`Failed to describe instances: ${error.message}`);
      throw new Error(`Failed to describe instances: ${error.message}`);
    }
  }

  async terminateInstance(instanceId: string) {
    try {
      const command = new TerminateInstancesCommand({
        InstanceIds: [instanceId],
      });

      const response = await this.ec2Client.send(command);
      this.logger.log(`EC2 instance terminated: ${instanceId}`);
      return response.TerminatingInstances?.[0];
    } catch (error) {
      this.logger.error(`Failed to terminate instance: ${error.message}`);
      throw new Error(`Failed to terminate instance: ${error.message}`);
    }
  }

  async uploadToS3(key: string, body: Buffer, contentType?: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('aws.s3Bucket'),
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      const response = await this.s3Client.send(command);
      this.logger.log(`File uploaded to S3: ${key}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to upload to S3: ${error.message}`);
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }

  async getFromS3(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get<string>('aws.s3Bucket'),
        Key: key,
      });

      const response = await this.s3Client.send(command);
      this.logger.log(`File retrieved from S3: ${key}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to get from S3: ${error.message}`);
      throw new Error(`Failed to get from S3: ${error.message}`);
    }
  }

  async deleteFromS3(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get<string>('aws.s3Bucket'),
        Key: key,
      });

      const response = await this.s3Client.send(command);
      this.logger.log(`File deleted from S3: ${key}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to delete from S3: ${error.message}`);
      throw new Error(`Failed to delete from S3: ${error.message}`);
    }
  }
} 