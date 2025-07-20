import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class CreateInstanceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imageId?: string;

  @IsOptional()
  @IsString()
  instanceType?: string;

  @IsOptional()
  @IsNumber()
  minCount?: number;

  @IsOptional()
  @IsNumber()
  maxCount?: number;

  @IsOptional()
  @IsString()
  keyName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  securityGroupIds?: string[];
}

export class UploadFileDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}

export class TerminateInstanceDto {
  @IsNotEmpty()
  @IsString()
  instanceId: string;
}

export class DeleteFileDto {
  @IsNotEmpty()
  @IsString()
  key: string;
} 