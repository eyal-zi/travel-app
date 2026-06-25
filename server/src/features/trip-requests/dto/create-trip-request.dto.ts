import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

// All fields except `notes` are required. `status` is set server-side
// ("received"), not accepted from the client — the global ValidationPipe
// (whitelist + forbidNonWhitelisted) rejects any extra properties such as a
// client-supplied status.
export class CreateTripRequestDto {
  @IsString()
  @IsNotEmpty()
  tripGoal: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsIsoDate()
  startDate: string; // 'YYYY-MM-DD'

  @IsIsoDate()
  endDate: string; // 'YYYY-MM-DD'

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
