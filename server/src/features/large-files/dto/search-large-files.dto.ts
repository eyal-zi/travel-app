import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { IsFeatureCollection } from '../../../common/validators/is-feature-collection.validator';

// Search a page of large files. Every filter is optional — an empty body returns
// the newest page unfiltered. Inherits `cursor`/`limit` for keyset pagination.
export class SearchLargeFilesDto extends PaginationQueryDto {
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
