import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class FindPdfDto {
  // The calendar date ("YYYY-MM-DD"). We look for the PDF on this date, or the
  // closest preceding one (same day or older).
  @IsIsoDate()
  date: string;
}
