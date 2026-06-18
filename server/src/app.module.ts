import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './common/storage/storage.module';
import { DatabaseModule } from './common/database/database.module';
import { RoutesModule } from './features/routes/routes.module';
import { EventsModule } from './features/events/events.module';

@Module({
  imports: [DatabaseModule, StorageModule, RoutesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
