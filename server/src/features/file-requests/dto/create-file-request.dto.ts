import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from '../../../common/validators/is-feature-collection.validator';
import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

// All fields except `notes` are required. `status` is set server-side
// ("received"), not accepted from the client — the global ValidationPipe
// (whitelist + forbidNonWhitelisted) rejects any extra properties such as a
// client-supplied status.
export class CreateFileRequestDto {
  @IsString()
  @IsNotEmpty()
  tripGoal: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  agency: string;

  @IsIsoDate()
  startDate: string; // 'YYYY-MM-DD'

  @IsIsoDate()
  endDate: string; // 'YYYY-MM-DD'

  // Area of interest drawn on the map.
  @IsFeatureCollection()
  area: FeatureCollection;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  fileTypes: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  geo: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
