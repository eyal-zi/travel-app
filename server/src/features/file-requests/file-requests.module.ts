import { Module } from '@nestjs/common';
import { LargeFilesModule } from '../large-files/large-files.module';
import { FileRequestsController } from './file-requests.controller';
import { FileRequestsService } from './file-requests.service';

@Module({
  imports: [LargeFilesModule],
  controllers: [FileRequestsController],
  providers: [FileRequestsService],
})
export class FileRequestsModule {}
