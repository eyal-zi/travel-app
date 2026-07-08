import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreateWeatherDto {
  @IsIsoDate()
  date: string;
}
