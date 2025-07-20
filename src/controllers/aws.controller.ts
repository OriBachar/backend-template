import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
  Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../services/aws.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import { CreateInstanceDto, UploadFileDto, TerminateInstanceDto } from '../dto/aws.dto';
import { UserRole } from '../schemas/user.schema';
import { MongoSanitizeUtil } from '../common/utils/mongo-sanitize.util';

@Controller('aws')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AwsController {
  constructor(private awsService: AwsService) { }

  @Post('ec2/create')
  @Roles(UserRole.ADMIN)
  async createInstance(
    @Body() createInstanceDto: CreateInstanceDto,
    @User('userId') userId: string
  ) {
    const instance = await this.awsService.createEC2Instance(createInstanceDto);
    return {
      message: 'EC2 instance created successfully',
      data: {
        instance,
        createdBy: userId,
        createdAt: new Date().toISOString()
      },
    };
  }

  @Get('ec2/instances')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getInstances(@Query('instanceIds') instanceIds?: string) {
    // Sanitize query parameters
    const sanitizedInstanceIds = instanceIds ? MongoSanitizeUtil.sanitize(instanceIds) : undefined;
    const ids = sanitizedInstanceIds ? sanitizedInstanceIds.split(',') : undefined;
    const instances = await this.awsService.describeInstances(ids);
    return {
      message: 'Instances retrieved successfully',
      data: instances,
    };
  }

  @Get('ec2/instances/:instanceId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getInstance(@Param('instanceId') instanceId: string) {
    const instances = await this.awsService.describeInstances([instanceId]);
    if (!instances || instances.length === 0) {
      return {
        message: 'Instance not found',
        data: null,
      };
    }
    return {
      message: 'Instance retrieved successfully',
      data: instances[0],
    };
  }

  @Post('ec2/terminate')
  @Roles(UserRole.ADMIN)
  async terminateInstance(
    @Body() terminateInstanceDto: TerminateInstanceDto,
    @User('userId') userId: string
  ) {
    const result = await this.awsService.terminateInstance(terminateInstanceDto.instanceId);
    return {
      message: 'EC2 instance terminated successfully',
      data: {
        instanceId: terminateInstanceDto.instanceId,
        terminatedBy: userId,
        terminatedAt: new Date().toISOString()
      },
    };
  }

  @Post('s3/upload')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.ADMIN, UserRole.USER)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @User('userId') userId: string
  ) {
    const key = uploadFileDto.key || `${userId}/${Date.now()}-${file.originalname}`;
    const result = await this.awsService.uploadToS3(
      key,
      file.buffer,
      file.mimetype,
    );
    return {
      message: 'File uploaded successfully',
      data: {
        key,
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        size: file.size,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      },
    };
  }

  @Get('s3/download/:key')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async downloadFile(@Param('key') key: string) {
    const result = await this.awsService.getFromS3(key);
    return {
      message: 'File retrieved successfully',
      data: {
        key,
        contentType: result.ContentType,
        lastModified: result.LastModified,
        size: result.ContentLength,
      },
    };
  }
} 