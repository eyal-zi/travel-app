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
  startDate: string;

  @IsIsoDate()
  endDate: string;

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
