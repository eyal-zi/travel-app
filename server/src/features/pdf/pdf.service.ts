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
  // Short-lived presigned URL for fetching the PDF from S3.
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
    // Store under a uuid-based key so uploads never collide; keep the original
    // extension so the object's name stays meaningful.
    const key = `${randomUUID()}${extname(file.originalname)}`;

    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: this.bucket,
      contentType: file.mimetype,
    });

    // Upsert by date: exactly one PDF per date. Posting a date that already
    // exists overwrites its key (and resurrects it if it had been soft-deleted)
    // instead of inserting a duplicate.
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
    // Newest non-deleted PDF at or before the target date wins — same date if
    // present, otherwise the closest preceding one. Signed URLs are short-lived
    // and not stored, so we regenerate one on each read.
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
    // Soft-delete the PDF for this exact date so findClosest falls back to the
    // closest preceding date again. If the date never had its own PDF (the view
    // was showing a fallback from an earlier date), this is a no-op — we must
    // not delete that earlier PDF, which still belongs to its own date.
    await this.db
      .update(pdf)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(pdf.date, date), eq(pdf.isDeleted, false)));
    this.logger.log(`Soft-deleted PDF for ${date}`);
  }
}
