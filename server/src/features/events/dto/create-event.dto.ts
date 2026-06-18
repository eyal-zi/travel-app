import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// Mirrors the client EventColor union.
export const EVENT_COLORS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
] as const;

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // Calendar start ("YYYY-MM-DD" for all-day, "YYYY-MM-DDTHH:mm" for timed).
  @IsString()
  @IsNotEmpty()
  start: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  end?: string;

  @IsBoolean()
  allDay: boolean;

  @IsOptional()
  @IsIn(EVENT_COLORS)
  color?: (typeof EVENT_COLORS)[number];
}
