import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { Roles } from '../../common/auth/roles.decorator';
import type { AuthenticatedUser } from '../../common/auth/auth.types';
import { FileRequestsService } from './file-requests.service';
import { CreateFileRequestDto } from './dto/create-file-request.dto';
import { FindFileRequestsDto } from './dto/find-file-requests.dto';
import { RespondFileRequestDto } from './dto/respond-file-request.dto';
import { UpdateFileRequestDto } from './dto/update-file-request.dto';

@Controller('file-requests')
export class FileRequestsController {
  constructor(private readonly fileRequestsService: FileRequestsService) {}

  // Newest-first page of file requests. Pass `cursor` (the createdAt of the last
  // item seen) to fetch the next, older page, and `status` to filter by workflow
  // status. Each item carries the admin's note and the large file (if any) that
  // fulfilled it.
  @Get()
  findAll(@Query() query: FindFileRequestsDto) {
    return this.fileRequestsService.findPage(
      query.limit,
      query.cursor,
      query.status,
    );
  }

  @Post()
  create(
    @Body() dto: CreateFileRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileRequestsService.create(dto, user.id);
  }

  // Admin update: change the status and/or the admin note (both optional).
  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFileRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileRequestsService.update(id, dto, user.id);
  }

  // Admin response: create the fulfilling large file from the large-file metadata
  // plus a reference (`fileKey`/`fileName`) to the object the admin already
  // uploaded straight to S3 via the presigned multipart flow. Links it to the
  // request and advances its status. This is a plain JSON body — no file bytes.
  @Post(':id/respond')
  @Roles('admin')
  respond(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RespondFileRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileRequestsService.respond(id, dto, user.id);
  }
}
