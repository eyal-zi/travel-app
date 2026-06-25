import { IsNotEmpty, IsString } from 'class-validator';
import type { FeatureCollection } from 'geojson';
import { IsFeatureCollection } from '../../../common/validators/is-feature-collection.validator';
import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // The calendar date the route belongs to ("YYYY-MM-DD"). One route per date:
  // posting a date that already exists overwrites that route (see RoutesService).
  @IsIsoDate()
  date: string;

  @IsFeatureCollection()
  data: FeatureCollection;
}
