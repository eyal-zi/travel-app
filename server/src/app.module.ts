import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './common/storage/storage.module';
import { DatabaseModule } from './common/database/database.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [DatabaseModule, StorageModule, RoutesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
