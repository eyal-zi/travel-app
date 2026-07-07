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

// S3 allows at most 10,000 parts per multipart upload, numbered from 1.
const MAX_PART_NUMBER = 10_000;

// Opens a multipart upload. The server derives the object key from `fileName`, so
// the client never chooses where the object lands.
export class CreateMultipartUploadDto {
  @IsString()
  @MinLength(1)
  fileName: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}

// Requests presigned PUT URLs for a batch of part numbers of an open upload.
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

// One uploaded part, reported back after its PUT succeeded.
export class UploadedPartDto {
  @IsInt()
  @Min(1)
  @Max(MAX_PART_NUMBER)
  partNumber: number;

  @IsString()
  @MinLength(1)
  etag: string;
}

// Finalizes an upload by assembling the reported parts into the object.
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

// Lists the parts already uploaded to an open upload, so the client can resume.
export class ListPartsDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  uploadId: string;
}

// Aborts an open upload so its parts are discarded.
export class AbortMultipartUploadDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  uploadId: string;
}
