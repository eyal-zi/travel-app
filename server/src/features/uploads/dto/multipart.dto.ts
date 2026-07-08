import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

const MAX_PART_NUMBER = 10_000;

export class CreateMultipartUploadDto {
  @IsString()
  @MinLength(1)
  fileName: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}

export class SignPartsDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  uploadId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(MAX_PART_NUMBER, { each: true })
  partNumbers: number[];
}

export class UploadedPartDto {
  @IsInt()
  @Min(1)
  @Max(MAX_PART_NUMBER)
  partNumber: number;

  @IsString()
  @MinLength(1)
  etag: string;
}

export class CompleteMultipartUploadDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  uploadId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UploadedPartDto)
  parts: UploadedPartDto[];
}

export class ListPartsDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  uploadId: string;
}

export class AbortMultipartUploadDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  uploadId: string;
}
