import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from '../../routes/dto/is-feature-collection.validator';

// Search a page of large files. Every filter is optional — an empty body
// returns the newest page unfiltered. Cursor pagination on `createdAt`: pass the
// `createdAt` of the last item you already have to fetch the next (older) page.
export class SearchLargeFilesDto {
  @IsOptional()
  @IsDateString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  // Target accuracy 0..15; matches records whose accuracy is within ±1.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(15)
  accuracy?: number;

  // Matches records whose file type is one of these. Omit/empty to match any.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileTypes?: string[];

  // The drawn search area. Records whose geometry intersects any feature match.
  @IsOptional()
  @IsFeatureCollection()
  area?: FeatureCollection;
}
