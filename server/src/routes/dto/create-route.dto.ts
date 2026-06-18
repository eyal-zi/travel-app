import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from './is-feature-collection.validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // The calendar date the route belongs to ("YYYY-MM-DD"). One route per date:
  // posting a date that already exists overwrites that route (see RoutesService).
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsFeatureCollection()
  data: FeatureCollection;
}
