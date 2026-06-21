import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Inject, Injectable, Logger } from '@nestjs/common';
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
}
