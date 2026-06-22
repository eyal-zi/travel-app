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
import { TripRequestsService } from './trip-requests.service';
import { CreateTripRequestDto } from './dto/create-trip-request.dto';
import { FindTripRequestsDto } from './dto/find-trip-requests.dto';
import { UpdateTripRequestStatusDto } from './dto/update-trip-request-status.dto';

@Controller('trip-requests')
export class TripRequestsController {
  constructor(private readonly tripRequestsService: TripRequestsService) {}

  // Newest-first page of trip requests. Pass `cursor` (the createdAt of the last
  // item seen) to fetch the next, older page, and `status` to filter by workflow
  // status.
  @Get()
  findAll(@Query() query: FindTripRequestsDto) {
    return this.tripRequestsService.findPage(
      query.limit,
      query.cursor,
      query.status,
    );
  }

  @Post()
  create(@Body() dto: CreateTripRequestDto) {
    return this.tripRequestsService.create(dto);
  }

  // Admin-only workflow transition: move a request to a new status.
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTripRequestStatusDto,
  ) {
    return this.tripRequestsService.updateStatus(id, dto.status);
  }
}
