import { Module } from '@nestjs/common';
import { AwsController } from '../controllers/aws.controller';
import { AwsService } from '../services/aws.service';

@Module({
  controllers: [AwsController],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule { } 