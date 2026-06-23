import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { FindPdfDto } from './dto/find-pdf.dto';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // Returns the PDF for the date (or the closest preceding one) with a fresh
  // signed URL for fetching it from S3.
  @Get('closest')
  findClosest(@Query() query: FindPdfDto) {
    return this.pdfService.findClosest(query.date);
  }

  // Multipart upload: a "file" part plus a "date" field. Uploads the PDF to S3
  // and returns the stored record with a signed URL.
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreatePdfDto,
  ) {
    return this.pdfService.create(dto, file);
  }

  // Soft-deletes the stored PDF for a given date so the view falls back to the
  // closest preceding date. A no-op (still 204) if that date had no PDF.
  @Delete()
  @HttpCode(204)
  remove(@Query() query: FindPdfDto) {
    return this.pdfService.softDeleteByDate(query.date);
  }
}
