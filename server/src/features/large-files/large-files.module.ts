import { Module } from '@nestjs/common';
import { StorageModule } from '../../common/storage/storage.module';
import { LargeFilesController } from './large-files.controller';
import { LargeFilesService } from './large-files.service';

@Module({
  imports: [StorageModule],
  controllers: [LargeFilesController],
  providers: [LargeFilesService],

  exports: [LargeFilesService],
})
export class LargeFilesModule {}
