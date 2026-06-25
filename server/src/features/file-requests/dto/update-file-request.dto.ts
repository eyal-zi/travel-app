import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  FILE_REQUEST_STATUSES,
  type FileRequestStatus,
} from '../file-requests.schema';

// Body for an admin update. Both fields are optional: an admin can advance the
// workflow `status`, write/clear the `adminNote` (an empty string clears it), or
// both at once. Files are attached via the separate /files endpoints.
export class UpdateFileRequestDto {
  @IsOptional()
  @IsIn(FILE_REQUEST_STATUSES)
  status?: FileRequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
