import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/auth/roles.decorator';
import { FileRequestsService } from './file-requests.service';
import { CreateFileRequestDto } from './dto/create-file-request.dto';
import { FindFileRequestsDto } from './dto/find-file-requests.dto';
import { UpdateFileRequestDto } from './dto/update-file-request.dto';

@Controller('file-requests')
export class FileRequestsController {
  constructor(private readonly fileRequestsService: FileRequestsService) {}

  // Newest-first page of file requests. Pass `cursor` (the createdAt of the last
  // item seen) to fetch the next, older page, and `status` to filter by workflow
  // status. Each item carries the admin's note and attached files.
  @Get()
  findAll(@Query() query: FindFileRequestsDto) {
    return this.fileRequestsService.findPage(
      query.limit,
      query.cursor,
      query.status,
    );
  }

  @Post()
  create(@Body() dto: CreateFileRequestDto) {
    return this.fileRequestsService.create(dto);
  }

  // Admin update: change the status and/or the admin note (both optional).
  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFileRequestDto,
  ) {
    return this.fileRequestsService.update(id, dto);
  }

  // Admin attaches a file (any type) to a request. Multipart "file" part.
  @Post(':id/files')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  addFile(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileRequestsService.addFile(id, file);
  }

  // Admin removes a previously attached file.
  @Delete(':id/files/:fileId')
  @Roles('admin')
  @HttpCode(204)
  removeFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ) {
    return this.fileRequestsService.removeFile(id, fileId);
  }
}
