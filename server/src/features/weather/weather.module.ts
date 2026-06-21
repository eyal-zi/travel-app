import { Module } from '@nestjs/common';
import { StorageModule } from '../../common/storage/storage.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [StorageModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
