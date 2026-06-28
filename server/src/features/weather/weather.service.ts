import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, lte } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { S3Service } from '../../common/storage/s3.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather, weather } from './weather.schema';

export interface WeatherWithUrl extends Weather {
  // Short-lived presigned URL for fetching the image from S3.
  signedUrl: string;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly bucket = process.env.S3_WEATHER_BUCKET ?? 'weather';

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly s3: S3Service,
  ) {}

  async create(
    dto: CreateWeatherDto,
    file: Express.Multer.File,
  ): Promise<WeatherWithUrl> {
    // Store under a uuid-based key so uploads never collide; keep the original
    // extension so the object's name stays meaningful.
    const key = `${randomUUID()}${extname(file.originalname)}`;

    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: this.bucket,
      contentType: file.mimetype,
    });

    const [row] = await this.db
      .insert(weather)
      .values({ imageKey: key, date: dto.date })
      .returning();
    this.logger.log(`Stored weather image ${key} for ${dto.date}`);

    return { ...row, signedUrl: this.s3.getSignedUrl(key, this.bucket) };
  }

  async findClosest(date: string): Promise<WeatherWithUrl> {
    // Newest non-deleted image at or before the target date wins — same date if
    // present, otherwise the closest preceding one. Ties on date fall back to
    // the most recently uploaded. Signed URLs are short-lived and not stored, so
    // we regenerate one on each read.
    const [row] = await this.db
      .select()
      .from(weather)
      .where(and(eq(weather.isDeleted, false), lte(weather.date, date)))
      .orderBy(desc(weather.date), desc(weather.createdAt))
      .limit(1);
    if (!row) {
      throw new NotFoundException(`No weather found on or before ${date}`);
    }

    return {
      ...row,
      signedUrl: this.s3.getSignedUrl(row.imageKey, this.bucket),
    };
  }

  async softDeleteByDate(date: string): Promise<void> {
    // Soft-delete the image(s) for this exact date so findClosest falls back to
    // the closest preceding date again. Flip the flag rather than removing rows
    // (or the S3 object), so the image stays recoverable and the history is
    // preserved. If the date never had its own image (the view was showing a
    // fallback from an earlier date), this is a no-op — we must not delete that
    // earlier image, which still belongs to its own date.
    await this.db
      .update(weather)
      .set({ isDeleted: true })
      .where(and(eq(weather.date, date), eq(weather.isDeleted, false)));
    this.logger.log(`Soft-deleted weather image(s) for ${date}`);
  }
}
