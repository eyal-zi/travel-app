import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsDateString()
  startDate: string; // 'YYYY-MM-DD'

  @IsDateString()
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
