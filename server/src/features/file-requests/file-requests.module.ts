import { Module } from '@nestjs/common';
import { LargeFilesModule } from '../large-files/large-files.module';
import { FileRequestsController } from './file-requests.controller';
import { FileRequestsService } from './file-requests.service';

@Module({
  // LargeFilesModule provides LargeFilesService, used to create the large file
  // that fulfils a request when an admin responds.
  imports: [LargeFilesModule],
  controllers: [FileRequestsController],
  providers: [FileRequestsService],
})
export class FileRequestsModule {}
