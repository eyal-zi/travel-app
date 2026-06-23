import { IsDateString, IsNotEmpty } from 'class-validator';

export class FindPdfDto {
  // ISO date (e.g. "2026-06-18"). We look for the PDF on this date, or the
  // closest preceding one (same day or older).
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
