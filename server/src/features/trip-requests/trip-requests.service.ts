import { Inject, Injectable } from '@nestjs/common';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import {
  RequestWithFilesService,
  type RequestServiceConfig,
} from '../../common/requests/request-with-files.service';
import { S3Service } from '../../common/storage/s3.service';
import { CreateTripRequestDto } from './dto/create-trip-request.dto';
import {
  tripRequestFiles,
  tripRequests,
  TripRequest,
  TripRequestFile,
} from './trip-requests.schema';

@Injectable()
export class TripRequestsService extends RequestWithFilesService<
  TripRequest,
  TripRequestFile,
  CreateTripRequestDto
> {
  protected readonly config: RequestServiceConfig = {
    requestTable: tripRequests,
    fileTable: tripRequestFiles,
    idColumn: tripRequests.id,
    createdAtColumn: tripRequests.createdAt,
    statusColumn: tripRequests.status,
    fileForeignKeyColumn: tripRequestFiles.tripRequestId,
    fileCreatedAtColumn: tripRequestFiles.createdAt,
    fileIdColumn: tripRequestFiles.id,
    bucket: process.env.S3_TRIP_REQUEST_BUCKET ?? 'trip-request-files',
    label: 'Trip request',
  };

  constructor(@Inject(DRIZZLE) db: DrizzleDB, s3: S3Service) {
    super(db, s3);
  }
}
