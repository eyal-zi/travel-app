import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  requestStatus,
  type RequestStatus,
} from '../../../common/database/enums';

export class UpdateTripRequestDto {
  @IsOptional()
  @IsIn(requestStatus.enumValues)
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
