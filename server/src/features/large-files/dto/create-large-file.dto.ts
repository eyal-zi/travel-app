import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from '../../../common/validators/is-feature-collection.validator';
import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreateLargeFileDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  fileType: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(15)
  accuracy: number;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsIsoDate()
  coverageDate?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? (JSON.parse(value) as unknown) : value,
  )
  @IsFeatureCollection()
  area: FeatureCollection;
}
