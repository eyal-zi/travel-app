import { IsNotEmpty, IsString } from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from './is-feature-collection.validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsFeatureCollection()
  data: FeatureCollection;
}
