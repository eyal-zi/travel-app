import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './features/common/storage/storage.module';
import { DatabaseModule } from './features/common/database/database.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
