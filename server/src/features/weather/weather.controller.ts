import {
  Body,
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

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
}
