import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import {
  FILE_REQUEST_STATUSES,
  type FileRequestStatus,
} from '../file-requests.schema';

// Query for a page of file requests. Cursor pagination on `createdAt`: pass the
// `createdAt` of the last item you already have to fetch the next (older) page.
export class FindFileRequestsDto {
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
  @IsIn(FILE_REQUEST_STATUSES)
  status?: FileRequestStatus;
}
