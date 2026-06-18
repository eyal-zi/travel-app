import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DRIZZLE, type DrizzleDB } from '../common/database/database.constants';
import { S3Service } from '../common/storage/s3.service';
import { Route, routes } from './routes.schema';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);
  private readonly bucket = process.env.S3_ROUTES_BUCKET ?? 'routes';

  constructor(
    private readonly s3Service: S3Service,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async uploadRoute(file: Express.Multer.File): Promise<Route> {
    const key = `${randomUUID()}-${file.originalname}`;

    await this.s3Service.uploadFile({
      bucket: this.bucket,
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    const [route] = await this.db
      .insert(routes)
      .values({
        bucket: this.bucket,
        key,
        originalName: file.originalname,
        contentType: file.mimetype,
        fileSize: file.size,
      })
      .returning();

    this.logger.log(`Stored route ${route.id} at ${this.bucket}/${key}`);

    return route;
  }
}
