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
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { Roles } from '../../common/auth/roles.decorator';
import type { AuthenticatedUser } from '../../common/auth/auth.types';
import { TripRequestsService } from './trip-requests.service';
import { CreateTripRequestDto } from './dto/create-trip-request.dto';
import { FindTripRequestsDto } from './dto/find-trip-requests.dto';
import { UpdateTripRequestDto } from './dto/update-trip-request.dto';

@Controller('trip-requests')
export class TripRequestsController {
  constructor(private readonly tripRequestsService: TripRequestsService) {}

  // Newest-first page of trip requests. Pass `cursor` (the createdAt of the last
  // item seen) to fetch the next, older page, and `status` to filter by workflow
  // status. Each item carries the admin's note and attached files.
  @Get()
  findAll(@Query() query: FindTripRequestsDto) {
    return this.tripRequestsService.findPage(
      query.limit,
      query.cursor,
      query.status,
    );
  }

  @Post()
  create(
    @Body() dto: CreateTripRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tripRequestsService.create(dto, user.id);
  }

  // Admin update: change the status and/or the admin note (both optional).
  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTripRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tripRequestsService.update(id, dto, user.id);
  }

  // Admin attaches a file (any type) to a request. Multipart "file" part.
  @Post(':id/files')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  addFile(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tripRequestsService.addFile(id, file);
  }

  // Admin removes a previously attached file.
  @Delete(':id/files/:fileId')
  @Roles('admin')
  @HttpCode(204)
  removeFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ) {
    return this.tripRequestsService.removeFile(id, fileId);
  }
}
