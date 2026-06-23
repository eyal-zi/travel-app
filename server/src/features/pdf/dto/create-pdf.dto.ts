import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePdfDto {
  // The calendar date the PDF belongs to ("YYYY-MM-DD"). One PDF per date:
  // posting a date that already exists overwrites that PDF (see PdfService).
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
