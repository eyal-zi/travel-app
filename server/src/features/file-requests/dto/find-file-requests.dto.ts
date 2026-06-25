import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';

// Query for a page of file requests. Inherits `cursor`/`limit` keyset pagination.
export class FindFileRequestsDto extends PaginationQueryDto {
  // Optional workflow-status filter. Omit to list requests of every status.
  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;
}
