import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from '../../routes/dto/is-feature-collection.validator';

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

  @IsDateString()
  startDate: string; // 'YYYY-MM-DD'

  @IsDateString()
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
