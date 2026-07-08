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
import { Roles } from '../../common/auth/roles.decorator';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { FindPdfDto } from './dto/find-pdf.dto';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('closest')
  findClosest(@Query() query: FindPdfDto) {
    return this.pdfService.findClosest(query.date);
  }

  @Post()
  @Roles('admin')
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

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  remove(@Query() query: FindPdfDto) {
    return this.pdfService.softDeleteByDate(query.date);
  }
}
