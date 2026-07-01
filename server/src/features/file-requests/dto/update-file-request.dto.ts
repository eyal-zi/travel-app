import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';

// Body for an admin update. Both fields are optional: an admin can advance the
// workflow `status`, write/clear the `adminNote` (an empty string clears it), or
// both at once. A fulfilling large file is created via the separate /respond
// endpoint.
export class UpdateFileRequestDto {
  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
