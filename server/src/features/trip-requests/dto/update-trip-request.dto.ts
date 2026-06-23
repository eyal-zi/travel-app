import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  TRIP_REQUEST_STATUSES,
  type TripRequestStatus,
} from '../trip-requests.schema';

// Body for an admin update. Both fields are optional: an admin can advance the
// workflow `status`, write/clear the `adminNote` (an empty string clears it), or
// both at once. Files are attached via the separate /files endpoints.
export class UpdateTripRequestDto {
  @IsOptional()
  @IsIn(TRIP_REQUEST_STATUSES)
  status?: TripRequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
