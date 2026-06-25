import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // Newest-first page of announcements. Pass `cursor` (the createdAt of the last
  // item seen) to fetch the next, older page.
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.announcementsService.findPage(query.limit, query.cursor);
  }

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }
}
