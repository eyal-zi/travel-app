import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';

export class FindTripRequestsDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;
}
