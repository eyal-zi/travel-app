import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';
import { CreateLargeFileDto } from '../../large-files/dto/create-large-file.dto';

// Body for an admin responding to a file request: the large-file metadata (sent
// as multipart form fields alongside the uploaded `file` part) plus the workflow
// `status` and `adminNote`. Responding creates a large file and links it to the
// request; `status` defaults to "done" server-side when omitted.
export class RespondFileRequestDto extends CreateLargeFileDto {
  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
