import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../common/database/database.constants';
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

  async findByDate(date: string): Promise<WeatherWithUrl> {
    // Newest non-deleted image for the exact date; signed URLs are short-lived
    // and not stored, so we regenerate one on each read.
    const [row] = await this.db
      .select()
      .from(weather)
      .where(and(eq(weather.date, date), eq(weather.isDeleted, false)))
      .orderBy(desc(weather.createdAt))
      .limit(1);
    if (!row) throw new NotFoundException(`No weather found for ${date}`);

    return { ...row, signedUrl: this.s3.getSignedUrl(row.imageKey, this.bucket) };
  }

  async softDeleteByDate(date: string): Promise<void> {
    // Flip the soft-delete flag rather than removing rows (or the S3 object),
    // so the image stays recoverable and the history is preserved. Any
    // non-deleted rows for the date are cleared so findByDate stops returning.
    const deleted = await this.db
      .update(weather)
      .set({ isDeleted: true })
      .where(and(eq(weather.date, date), eq(weather.isDeleted, false)))
      .returning({ id: weather.id });
    if (deleted.length === 0) {
      throw new NotFoundException(`No weather found for ${date}`);
    }

    this.logger.log(`Soft-deleted weather image(s) for ${date}`);
  }
}
