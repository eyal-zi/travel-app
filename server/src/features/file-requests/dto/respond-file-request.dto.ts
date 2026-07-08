import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';
import { CreateLargeFileDto } from '../../large-files/dto/create-large-file.dto';

export class RespondFileRequestDto extends CreateLargeFileDto {
  @IsString()
  @MinLength(1)
  fileKey: string;

  @IsString()
  @MinLength(1)
  fileName: string;

  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
