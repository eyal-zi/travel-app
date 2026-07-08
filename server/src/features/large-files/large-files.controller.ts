import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LargeFilesService } from './large-files.service';
import { SearchLargeFilesDto } from './dto/search-large-files.dto';

@Controller('large-files')
export class LargeFilesController {
  constructor(private readonly largeFilesService: LargeFilesService) {}

  @Post('search')
  @HttpCode(200)
  search(@Body() dto: SearchLargeFilesDto) {
    return this.largeFilesService.search(dto);
  }
}
