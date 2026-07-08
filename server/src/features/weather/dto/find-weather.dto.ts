import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class FindWeatherDto {
  @IsIsoDate()
  date: string;
}
