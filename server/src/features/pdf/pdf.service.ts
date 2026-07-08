import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, lte } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { S3Service } from '../../common/storage/s3.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Pdf, pdf } from './pdf.schema';

export interface PdfWithUrl extends Pdf {
  signedUrl: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly bucket = process.env.S3_PDF_BUCKET ?? 'pdfs';

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly s3: S3Service,
  ) {}

  async create(
    dto: CreatePdfDto,
    file: Express.Multer.File,
  ): Promise<PdfWithUrl> {
    const key = `${randomUUID()}${extname(file.originalname)}`;

    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: this.bucket,
      contentType: file.mimetype,
    });

    const [row] = await this.db
      .insert(pdf)
      .values({ fileKey: key, date: dto.date })
      .onConflictDoUpdate({
        target: pdf.date,
        set: { fileKey: key, isDeleted: false, updatedAt: new Date() },
      })
      .returning();
    this.logger.log(`Stored PDF ${key} for ${dto.date}`);

    return { ...row, signedUrl: this.s3.getSignedUrl(key, this.bucket) };
  }

  async findClosest(date: string): Promise<PdfWithUrl> {
    const [row] = await this.db
      .select()
      .from(pdf)
      .where(and(eq(pdf.isDeleted, false), lte(pdf.date, date)))
      .orderBy(desc(pdf.date))
      .limit(1);
    if (!row) throw new NotFoundException(`No PDF found on or before ${date}`);

    return {
      ...row,
      signedUrl: this.s3.getSignedUrl(row.fileKey, this.bucket),
    };
  }

  async softDeleteByDate(date: string): Promise<void> {
    await this.db
      .update(pdf)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(pdf.date, date), eq(pdf.isDeleted, false)));
    this.logger.log(`Soft-deleted PDF for ${date}`);
  }
}
