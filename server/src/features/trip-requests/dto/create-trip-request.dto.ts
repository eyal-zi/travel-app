import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreateTripRequestDto {
  @IsString()
  @IsNotEmpty()
  tripGoal: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsIsoDate()
  startDate: string;

  @IsIsoDate()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  @IsString()
  @IsNotEmpty()
  landmark: string;

  @IsString()
  @IsNotEmpty()
  timeDivision: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
