import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreateWeatherDto {
  // The calendar date the uploaded image belongs to ("YYYY-MM-DD"); stored as a
  // date-only value.
  @IsIsoDate()
  date: string;
}
