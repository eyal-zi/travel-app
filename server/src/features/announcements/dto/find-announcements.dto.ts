import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

// Query for a page of announcements. Cursor pagination on `createdAt`: pass the
// `createdAt` of the last item you already have to fetch the next (older) page.
export class FindAnnouncementsDto {
  @IsOptional()
  @IsDateString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
