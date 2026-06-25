import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

export class CreatePdfDto {
  // The calendar date the PDF belongs to ("YYYY-MM-DD"). One PDF per date:
  // posting a date that already exists overwrites that PDF (see PdfService).
  @IsIsoDate()
  date: string;
}
