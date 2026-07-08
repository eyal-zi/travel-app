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
import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class SearchLargeFilesDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(15)
  accuracy?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileTypes?: string[];

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsIsoDate()
  startDate?: string;

  @IsOptional()
  @IsIsoDate()
  endDate?: string;

  @IsOptional()
  @IsFeatureCollection()
  area?: FeatureCollection;
}
