import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from '../../../common/validators/is-feature-collection.validator';

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsFeatureCollection()
  data?: FeatureCollection;
}
