import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { FindAnnouncementsDto } from './dto/find-announcements.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // Newest-first page of announcements. Pass `cursor` (the createdAt of the last
  // item seen) to fetch the next, older page.
  @Get()
  findAll(@Query() query: FindAnnouncementsDto) {
    return this.announcementsService.findPage(query.limit, query.cursor);
  }

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }
}
