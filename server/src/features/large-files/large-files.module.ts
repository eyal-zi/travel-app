import { Module } from '@nestjs/common';
import { LargeFilesController } from './large-files.controller';
import { LargeFilesService } from './large-files.service';

@Module({
  controllers: [LargeFilesController],
  providers: [LargeFilesService],
})
export class LargeFilesModule {}
