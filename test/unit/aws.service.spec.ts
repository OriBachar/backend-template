import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AwsService } from '../../src/services/aws.service';
import { CreateInstanceDto } from '../../src/dto/aws.dto';

// Mock AWS SDK
const mockSend = jest.fn();

jest.mock('@aws-sdk/client-ec2', () => ({
    EC2Client: jest.fn().mockImplementation(() => ({
        send: mockSend,
    })),
    RunInstancesCommand: jest.fn().mockImplementation((params) => ({ input: params })),
    DescribeInstancesCommand: jest.fn().mockImplementation((params) => ({ input: params })),
    TerminateInstancesCommand: jest.fn().mockImplementation((params) => ({ input: params })),
}));

jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn().mockImplementation(() => ({
        send: mockSend,
    })),
    PutObjectCommand: jest.fn().mockImplementation((params) => ({ input: params })),
    GetObjectCommand: jest.fn().mockImplementation((params) => ({ input: params })),
    DeleteObjectCommand: jest.fn().mockImplementation((params) => ({ input: params })),
}));

describe('AwsService', () => {
    let service: AwsService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AwsService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            const config = {
                                'aws.region': 'us-east-1',
                                'aws.accessKeyId': 'test-access-key',
                                'aws.secretAccessKey': 'test-secret-key',
                                'aws.s3Bucket': 'test-bucket',
                                'aws.ec2.instanceType': 't2.micro',
                                'aws.ec2.minCount': 1,
                                'aws.ec2.maxCount': 1,
                                'aws.ec2.imageId': 'ami-default',
                            };
                            return config[key];
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AwsService>(AwsService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createEC2Instance', () => {
        it('should create EC2 instance successfully', async () => {
            const createInstanceDto: CreateInstanceDto = {
                name: 'Test Instance',
                instanceType: 't2.micro',
                imageId: 'ami-12345678',
                minCount: 1,
                maxCount: 1,
            };

            const mockResponse = {
                Instances: [
                    {
                        InstanceId: 'i-1234567890abcdef0',
                        InstanceType: 't2.micro',
                        State: { Name: 'pending', Code: 0 },
                        LaunchTime: new Date(),
                    },
                ],
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.createEC2Instance(createInstanceDto);

            expect(result).toEqual(mockResponse.Instances[0]);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        ImageId: 'ami-12345678',
                        InstanceType: 't2.micro',
                        MinCount: 1,
                        MaxCount: 1,
                    }),
                }),
            );
        });

        it('should use default values when not provided', async () => {
            const createInstanceDto: CreateInstanceDto = {
                name: 'Test Instance',
                // Missing instanceType, imageId, minCount, maxCount
            };

            const mockResponse = {
                Instances: [
                    {
                        InstanceId: 'i-1234567890abcdef0',
                        InstanceType: 't2.micro',
                        State: { Name: 'pending', Code: 0 },
                        LaunchTime: new Date(),
                    },
                ],
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.createEC2Instance(createInstanceDto);

            expect(result).toEqual(mockResponse.Instances[0]);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        ImageId: 'ami-default',
                        InstanceType: 't2.micro',
                        MinCount: 1,
                        MaxCount: 1,
                    }),
                }),
            );
        });

        it('should handle EC2 creation errors', async () => {
            const createInstanceDto: CreateInstanceDto = {
                name: 'Test Instance',
                instanceType: 't2.micro',
                imageId: 'ami-12345678',
                minCount: 1,
                maxCount: 1,
            };

            const mockError = new Error('EC2 creation failed');
            mockSend.mockRejectedValue(mockError);

            await expect(service.createEC2Instance(createInstanceDto)).rejects.toThrow('EC2 creation failed');
        });
    });

    describe('describeInstances', () => {
        it('should describe all instances when no instanceIds provided', async () => {
            const mockResponse = {
                Reservations: [
                    {
                        Instances: [
                            {
                                InstanceId: 'i-1234567890abcdef0',
                                InstanceType: 't2.micro',
                                State: { Name: 'running', Code: 16 },
                                LaunchTime: new Date(),
                            },
                        ],
                    },
                ],
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.describeInstances();

            expect(result).toEqual(mockResponse.Reservations[0].Instances);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: {},
                }),
            );
        });

        it('should describe specific instances when instanceIds provided', async () => {
            const instanceIds = ['i-1234567890abcdef0', 'i-0987654321fedcba0'];

            const mockResponse = {
                Reservations: [
                    {
                        Instances: [
                            {
                                InstanceId: 'i-1234567890abcdef0',
                                InstanceType: 't2.micro',
                                State: { Name: 'running', Code: 16 },
                            },
                        ],
                    },
                ],
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.describeInstances(instanceIds);

            expect(result).toEqual(mockResponse.Reservations[0].Instances);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: {
                        InstanceIds: instanceIds,
                    },
                }),
            );
        });

        it('should handle describe instances errors', async () => {
            const mockError = new Error('Describe instances failed');
            mockSend.mockRejectedValue(mockError);

            await expect(service.describeInstances()).rejects.toThrow('Describe instances failed');
        });
    });

    describe('terminateInstance', () => {
        it('should terminate instance successfully', async () => {
            const instanceId = 'i-1234567890abcdef0';

            const mockResponse = {
                TerminatingInstances: [
                    {
                        InstanceId: instanceId,
                        CurrentState: { Name: 'shutting-down', Code: 32 },
                        PreviousState: { Name: 'running', Code: 16 },
                    },
                ],
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.terminateInstance(instanceId);

            expect(result).toEqual(mockResponse.TerminatingInstances[0]);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: {
                        InstanceIds: [instanceId],
                    },
                }),
            );
        });

        it('should handle termination errors', async () => {
            const instanceId = 'i-1234567890abcdef0';
            const mockError = new Error('Termination failed');
            mockSend.mockRejectedValue(mockError);

            await expect(service.terminateInstance(instanceId)).rejects.toThrow('Termination failed');
        });
    });

    describe('uploadToS3', () => {
        it('should upload file to S3 successfully', async () => {
            const key = 'test-file.txt';
            const buffer = Buffer.from('test content');
            const contentType = 'text/plain';

            const mockResponse = {
                ETag: '"abc123"',
                Location: 'https://bucket.s3.region.amazonaws.com/test-file.txt',
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.uploadToS3(key, buffer, contentType);

            expect(result).toEqual(mockResponse);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        Bucket: expect.any(String),
                        Key: key,
                        Body: buffer,
                        ContentType: contentType,
                    }),
                }),
            );
        });

        it('should handle S3 upload errors', async () => {
            const key = 'test-file.txt';
            const buffer = Buffer.from('test content');
            const contentType = 'text/plain';

            const mockError = new Error('S3 upload failed');
            mockSend.mockRejectedValue(mockError);

            await expect(service.uploadToS3(key, buffer, contentType)).rejects.toThrow('S3 upload failed');
        });
    });

    describe('getFromS3', () => {
        it('should get file from S3 successfully', async () => {
            const key = 'test-file.txt';

            const mockResponse = {
                Body: Buffer.from('test content'),
                ContentType: 'text/plain',
                ContentLength: 12,
                LastModified: new Date(),
                ETag: '"abc123"',
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.getFromS3(key);

            expect(result).toEqual(mockResponse);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        Bucket: expect.any(String),
                        Key: key,
                    }),
                }),
            );
        });

        it('should handle S3 get errors', async () => {
            const key = 'test-file.txt';
            const mockError = new Error('S3 get failed');
            mockSend.mockRejectedValue(mockError);

            await expect(service.getFromS3(key)).rejects.toThrow('S3 get failed');
        });
    });

    describe('deleteFromS3', () => {
        it('should delete file from S3 successfully', async () => {
            const key = 'test-file.txt';

            const mockResponse = {
                DeleteMarker: true,
                VersionId: 'v1',
            };

            mockSend.mockResolvedValue(mockResponse);

            const result = await service.deleteFromS3(key);

            expect(result).toEqual(mockResponse);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        Bucket: expect.any(String),
                        Key: key,
                    }),
                }),
            );
        });

        it('should handle S3 delete errors', async () => {
            const key = 'test-file.txt';
            const mockError = new Error('S3 delete failed');
            mockSend.mockRejectedValue(mockError);

            await expect(service.deleteFromS3(key)).rejects.toThrow('S3 delete failed');
        });
    });
}); 