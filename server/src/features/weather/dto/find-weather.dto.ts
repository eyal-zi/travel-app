import { IsDateString, IsNotEmpty } from 'class-validator';

export class FindWeatherDto {
  // The calendar date to fetch the weather image for. ISO date (e.g.
  // "2026-06-18") or full timestamp; matched against the stored date-only value.
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
