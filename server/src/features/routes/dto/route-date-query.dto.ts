import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class RouteDateQueryDto {
  @IsIsoDate()
  date: string;
}
