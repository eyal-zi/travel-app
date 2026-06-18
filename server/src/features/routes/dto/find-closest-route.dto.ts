import { IsDateString, IsNotEmpty } from 'class-validator';

export class FindClosestRouteDto {
  // ISO date (e.g. "2026-06-18") or full timestamp. We look for the route whose
  // createdAt is closest to this value without going past it (same day or older).
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
