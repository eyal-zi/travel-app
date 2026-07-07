import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UploadsService } from './uploads.service';
import {
  AbortMultipartUploadDto,
  CompleteMultipartUploadDto,
  CreateMultipartUploadDto,
  ListPartsDto,
  SignPartsDto,
} from './dto/multipart.dto';

// Presigned multipart upload endpoints (admin only). The client uploads parts
// directly to S3/MinIO with the URLs signed here; this controller never touches
// the file bytes. Routes are under /api/uploads/multipart (global 'api' prefix).
@Controller('uploads/multipart')
@Roles('admin')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // Opens an upload; returns the object key and upload id.
  @Post('create')
  create(@Body() dto: CreateMultipartUploadDto) {
    return this.uploadsService.create(dto);
  }

  // Signs a batch of part PUT URLs.
  @Post('sign')
  @HttpCode(HttpStatus.OK)
  sign(@Body() dto: SignPartsDto) {
    return { urls: this.uploadsService.signParts(dto) };
  }

  // Lists already-uploaded parts so an interrupted upload can resume.
  @Post('list')
  @HttpCode(HttpStatus.OK)
  list(@Body() dto: ListPartsDto) {
    return this.uploadsService.listParts(dto);
  }

  // Finalizes the upload; returns the key plus the object's real size/type.
  @Post('complete')
  @HttpCode(HttpStatus.OK)
  complete(@Body() dto: CompleteMultipartUploadDto) {
    return this.uploadsService.complete(dto);
  }

  // Aborts an abandoned upload.
  @Post('abort')
  @HttpCode(HttpStatus.NO_CONTENT)
  abort(@Body() dto: AbortMultipartUploadDto) {
    return this.uploadsService.abort(dto);
  }
}
