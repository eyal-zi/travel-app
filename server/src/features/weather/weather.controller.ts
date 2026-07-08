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
import { Roles } from '../../common/auth/roles.decorator';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { FindWeatherDto } from './dto/find-weather.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('closest')
  findClosest(@Query() query: FindWeatherDto) {
    return this.weatherService.findClosest(query.date);
  }

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
    @Body() dto: CreateWeatherDto,
  ) {
    return this.weatherService.create(dto, image);
  }

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  remove(@Query() query: FindWeatherDto) {
    return this.weatherService.softDeleteByDate(query.date);
  }
}
