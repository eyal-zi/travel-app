import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  TRIP_REQUEST_STATUSES,
  type TripRequestStatus,
} from '../trip-requests.schema';

// Query for a page of trip requests. Cursor pagination on `createdAt`: pass the
// `createdAt` of the last item you already have to fetch the next (older) page.
export class FindTripRequestsDto {
  @IsOptional()
  @IsDateString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  // Optional workflow-status filter. Omit to list requests of every status.
  @IsOptional()
  @IsIn(TRIP_REQUEST_STATUSES)
  status?: TripRequestStatus;
}
