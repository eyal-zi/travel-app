import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UploadsService } from './uploads.service';
import {
  AbortMultipartUploadDto,
  CompleteMultipartUploadDto,
  CreateMultipartUploadDto,
  ListPartsDto,
  SignPartsDto,
} from './dto/multipart.dto';

@Controller('uploads/multipart')
@Roles('admin')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('create')
  create(@Body() dto: CreateMultipartUploadDto) {
    return this.uploadsService.create(dto);
  }

  @Post('sign')
  @HttpCode(HttpStatus.OK)
  sign(@Body() dto: SignPartsDto) {
    return { urls: this.uploadsService.signParts(dto) };
  }

  @Post('list')
  @HttpCode(HttpStatus.OK)
  list(@Body() dto: ListPartsDto) {
    return this.uploadsService.listParts(dto);
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  complete(@Body() dto: CompleteMultipartUploadDto) {
    return this.uploadsService.complete(dto);
  }

  @Post('abort')
  @HttpCode(HttpStatus.NO_CONTENT)
  abort(@Body() dto: AbortMultipartUploadDto) {
    return this.uploadsService.abort(dto);
  }
}
