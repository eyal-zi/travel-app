import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';

// Body for an admin update. Both fields are optional: an admin can advance the
// workflow `status`, write/clear the `adminNote` (an empty string clears it), or
// both at once. Files are attached via the separate /files endpoints.
export class UpdateTripRequestDto {
  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
