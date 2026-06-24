import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LargeFilesService } from './large-files.service';
import { SearchLargeFilesDto } from './dto/search-large-files.dto';

@Controller('large-files')
export class LargeFilesController {
  constructor(private readonly largeFilesService: LargeFilesService) {}

  // Newest-first page of large files matching the filters in the body. POST (not
  // GET) because the payload carries a GeoJSON area and arrays; main.ts raises
  // the JSON body limit for exactly this kind of geometry. Pass `cursor` (the
  // createdAt of the last item seen) to fetch the next, older page.
  @Post('search')
  @HttpCode(200)
  search(@Body() dto: SearchLargeFilesDto) {
    return this.largeFilesService.search(dto);
  }
}
