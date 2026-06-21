import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { FindWeatherDto } from './dto/find-weather.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Returns the stored weather record for a given date with a fresh signed URL
  // for fetching the image from S3.
  @Get()
  findByDate(@Query() query: FindWeatherDto) {
    return this.weatherService.findByDate(query.date);
  }

  // Multipart upload: an "image" file part plus a "date" field. Uploads the
  // image to S3 and returns the stored record with a signed URL.
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
    @Body() dto: CreateWeatherDto,
  ) {
    return this.weatherService.create(dto, image);
  }

  // Soft-deletes the stored weather image(s) for a given date. Responds 204 on
  // success and 404 when there's nothing to delete for that date.
  @Delete()
  @HttpCode(204)
  remove(@Query() query: FindWeatherDto) {
    return this.weatherService.softDeleteByDate(query.date);
  }
}
