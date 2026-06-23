import { Module } from '@nestjs/common';
import { StorageModule } from '../../common/storage/storage.module';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [StorageModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
