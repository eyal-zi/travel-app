import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateWeatherDto {
  // The calendar date the uploaded image belongs to. ISO date (e.g.
  // "2026-06-18") or full timestamp; stored as a date-only value.
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
