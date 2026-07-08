import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreatePdfDto {
  @IsIsoDate()
  date: string;
}
