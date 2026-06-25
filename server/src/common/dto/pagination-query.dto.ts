import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// Shared cursor-pagination query params. `cursor` is the opaque token returned as
// `nextCursor` from the previous page (it encodes the keyset position); pass it
// back verbatim to fetch the next, older page. `limit` caps the page size.
export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
