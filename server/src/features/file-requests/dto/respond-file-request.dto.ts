import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';
import { CreateLargeFileDto } from '../../large-files/dto/create-large-file.dto';

// Body for an admin responding to a file request: the large-file metadata plus a
// reference to the file the admin already uploaded straight to S3 (`fileKey` +
// original `fileName`), and the workflow `status`/`adminNote`. Responding creates
// a large file from that object and links it to the request; `status` defaults to
// "done" server-side when omitted.
export class RespondFileRequestDto extends CreateLargeFileDto {
  // Key of the object the client uploaded via the presigned multipart flow.
  @IsString()
  @MinLength(1)
  fileKey: string;

  // The uploaded file's original name, stored for display/download.
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
