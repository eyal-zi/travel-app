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
    await this.db
      .update(weather)
      .set({ isDeleted: true })
      .where(and(eq(weather.date, date), eq(weather.isDeleted, false)));
    this.logger.log(`Soft-deleted weather image(s) for ${date}`);
  }
}
