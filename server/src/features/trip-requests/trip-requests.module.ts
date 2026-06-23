import { Module } from '@nestjs/common';
import { StorageModule } from '../../common/storage/storage.module';
import { TripRequestsController } from './trip-requests.controller';
import { TripRequestsService } from './trip-requests.service';

@Module({
  imports: [StorageModule],
  controllers: [TripRequestsController],
  providers: [TripRequestsService],
})
export class TripRequestsModule {}
