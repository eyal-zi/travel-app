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

// Metadata for creating a large file. Sent as JSON now (the file itself is
// uploaded separately, straight to S3), but `accuracy`/`area` keep their coercion
// so the DTO also tolerates the string-valued form this used to arrive in.
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

  // Country the file covers; omit for an unknown country.
  @IsOptional()
  @IsString()
  country?: string;

  // Coverage date as 'YYYY-MM-DD'; omit when unknown.
  @IsOptional()
  @IsIsoDate()
  coverageDate?: string;

  // The file's footprint, drawn on the map. Parsed from a JSON string (multipart
  // fields are strings) and validated as a GeoJSON FeatureCollection.
  @Transform(({ value }) =>
    typeof value === 'string' ? (JSON.parse(value) as unknown) : value,
  )
  @IsFeatureCollection()
  area: FeatureCollection;
}
