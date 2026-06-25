import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class FindWeatherDto {
  // The calendar date to fetch the weather image for ("YYYY-MM-DD"); matched
  // against the stored date-only value.
  @IsIsoDate()
  date: string;
}
