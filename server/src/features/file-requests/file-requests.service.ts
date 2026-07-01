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
import { users } from '../auth/users.schema';
import { CreateFileRequestDto } from './dto/create-file-request.dto';
import {
  fileRequestFiles,
  fileRequests,
  FileRequest,
  FileRequestFile,
} from './file-requests.schema';

@Injectable()
export class FileRequestsService extends RequestWithFilesService<
  FileRequest,
  FileRequestFile,
  CreateFileRequestDto
> {
  protected readonly config: RequestServiceConfig = {
    requestTable: fileRequests,
    fileTable: fileRequestFiles,
    idColumn: fileRequests.id,
    createdAtColumn: fileRequests.createdAt,
    statusColumn: fileRequests.status,
    createdByColumn: fileRequests.createdBy,
    updatedByColumn: fileRequests.updatedBy,
    fileForeignKeyColumn: fileRequestFiles.fileRequestId,
    fileCreatedAtColumn: fileRequestFiles.createdAt,
    fileIdColumn: fileRequestFiles.id,
    userTable: users,
    userIdColumn: users.id,
    userNameColumn: users.username,
    bucket: process.env.S3_FILE_REQUEST_BUCKET ?? 'file-request-files',
    label: 'File request',
  };

  constructor(@Inject(DRIZZLE) db: DrizzleDB, s3: S3Service) {
    super(db, s3);
  }
}
