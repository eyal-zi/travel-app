import { Module } from '@nestjs/common';
import { StorageModule } from '../common/storage/storage.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [StorageModule],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
