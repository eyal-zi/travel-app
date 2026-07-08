import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import {
  RequestService,
  type RequestBaseConfig,
  type RequestUsernames,
} from '../../common/requests/request-with-files.service';
import { LargeFilesService } from '../large-files/large-files.service';
import type { LargeFileResult } from '../large-files/types';
import { users } from '../auth/users.schema';
import { CreateFileRequestDto } from './dto/create-file-request.dto';
import { RespondFileRequestDto } from './dto/respond-file-request.dto';
import { fileRequests, FileRequest } from './file-requests.schema';

export type FileRequestWithLargeFile = FileRequest &
  RequestUsernames & {
    largeFile: LargeFileResult | null;
  };

@Injectable()
export class FileRequestsService extends RequestService<
  FileRequest,
  CreateFileRequestDto,
  FileRequestWithLargeFile
> {
  protected readonly config: RequestBaseConfig = {
    requestTable: fileRequests,
    idColumn: fileRequests.id,
    createdAtColumn: fileRequests.createdAt,
    statusColumn: fileRequests.status,
    createdByColumn: fileRequests.createdBy,
    updatedByColumn: fileRequests.updatedBy,
    userTable: users,
    userIdColumn: users.id,
    userNameColumn: users.username,
    label: 'File request',
  };

  constructor(
    @Inject(DRIZZLE) db: DrizzleDB,
    private readonly largeFilesService: LargeFilesService,
  ) {
    super(db);
  }

  protected async enrich(
    rows: (FileRequest & RequestUsernames)[],
  ): Promise<FileRequestWithLargeFile[]> {
    const ids = rows
      .map((row) => row.largeFileId)
      .filter((id): id is string => Boolean(id));
    const largeFiles = await this.largeFilesService.findResultsByIds(ids);

    return rows.map((row) => ({
      ...row,
      largeFile: row.largeFileId
        ? (largeFiles.get(row.largeFileId) ?? null)
        : null,
    }));
  }

  async respond(
    id: string,
    dto: RespondFileRequestDto,
    updatedBy?: string,
  ): Promise<FileRequestWithLargeFile> {
    await this.ensureExists(id);

    const largeFile = await this.largeFilesService.create(dto, {
      key: dto.fileKey,
      fileName: dto.fileName,
    });

    const [row] = (await this.db
      .update(fileRequests)
      .set({
        largeFileId: largeFile.id,
        status: dto.status ?? 'done',
        ...(dto.adminNote !== undefined && { adminNote: dto.adminNote }),
        ...(updatedBy && { updatedBy }),
      })
      .where(eq(fileRequests.id, id))
      .returning()) as FileRequest[];

    this.logger.log(
      `Responded to file request ${id} with large file ${largeFile.id}`,
    );

    return {
      ...row,
      createdByUsername: null,
      updatedByUsername: null,
      largeFile,
    };
  }
}
