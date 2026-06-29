import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './common/storage/storage.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { RoutesModule } from './features/routes/routes.module';
import { EventsModule } from './features/events/events.module';
import { WeatherModule } from './features/weather/weather.module';
import { PdfModule } from './features/pdf/pdf.module';
import { AnnouncementsModule } from './features/announcements/announcements.module';
import { TripRequestsModule } from './features/trip-requests/trip-requests.module';
import { LargeFilesModule } from './features/large-files/large-files.module';
import { FileRequestsModule } from './features/file-requests/file-requests.module';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    AuthModule,
    RoutesModule,
    EventsModule,
    WeatherModule,
    PdfModule,
    AnnouncementsModule,
    TripRequestsModule,
    LargeFilesModule,
    FileRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
